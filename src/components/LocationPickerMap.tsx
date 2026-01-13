'use client';

import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';

// Types for the location data
export interface LocationData {
  address: string;
  latitude: number;
  longitude: number;
}

interface LocationPickerMapProps {
  value: LocationData | null;
  onChange: (location: LocationData) => void;
  placeholder?: string;
  error?: string;
}

// Default center (Cagayan de Oro, Philippines)
const DEFAULT_CENTER: [number, number] = [8.4542, 124.6319];
const DEFAULT_ZOOM = 13;

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(
  () => import('./LocationPickerMapClient'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] w-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    )
  }
);

const LocationPickerMap = ({ value, onChange, placeholder = 'Search for a location...', error }: LocationPickerMapProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{
    display_name: string;
    lat: string;
    lon: string;
  }>>([]);
  const [showResults, setShowResults] = useState(false);

  // Reverse geocode to get address from coordinates
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );
      const data = await response.json();
      return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch {
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  }, []);

  // Handle map click
  const handleMapClick = useCallback(async (lat: number, lng: number) => {
    const address = await reverseGeocode(lat, lng);
    onChange({
      address,
      latitude: lat,
      longitude: lng,
    });
    setSearchQuery(address);
    setShowResults(false);
  }, [onChange, reverseGeocode]);

  // Search for locations using Nominatim
  const searchLocations = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=ph`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );
      const data = await response.json();
      setSearchResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('Error searching locations:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 3) {
        searchLocations(searchQuery);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, searchLocations]);

  // Handle search result selection
  const handleSelectResult = (result: { display_name: string; lat: string; lon: string }) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    onChange({
      address: result.display_name,
      latitude: lat,
      longitude: lng,
    });
    setSearchQuery(result.display_name);
    setShowResults(false);
  };

  // Update search query when value changes
  useEffect(() => {
    if (value?.address && value.address !== searchQuery) {
      setSearchQuery(value.address);
    }
  }, [value?.address]);

  return (
    <div className="space-y-2">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => {
            if (searchResults.length > 0) {
              setShowResults(true);
            }
          }}
          placeholder={placeholder}
          className={`block w-full rounded-lg border shadow-sm focus:border-savoy-blue focus:ring-savoy-blue sm:text-sm px-3 py-2 pr-10 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}

        {/* Search Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute z-20 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto">
            {searchResults.map((result, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectResult(result)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {result.display_name}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Map */}
      <div className="relative rounded-lg overflow-hidden border border-gray-300">
        <MapComponent
          center={value ? [value.latitude, value.longitude] : DEFAULT_CENTER}
          zoom={value ? 15 : DEFAULT_ZOOM}
          markerPosition={value ? [value.latitude, value.longitude] : null}
          onMapClick={handleMapClick}
        />
      </div>

      {/* Selected Location Display */}
      {value && (
        <div className="text-xs text-gray-500">
          <span className="font-medium">Coordinates:</span> {value.latitude.toFixed(6)}, {value.longitude.toFixed(6)}
        </div>
      )}
    </div>
  );
};

export default LocationPickerMap;
