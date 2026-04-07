'use client';

import { useState } from 'react';
import Modal from '../components/Modal';
import { MapPinIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import LocationPickerMap, { LocationData } from '@/components/LocationPickerMap';

interface LocationPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationObtained: (latitude: number, longitude: number) => void;
}

const LocationPermissionModal = ({
  isOpen,
  onClose,
  onLocationObtained,
}: LocationPermissionModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [showMap, setShowMap] = useState(false);

  const handleAllowLocation = () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Use reverse geocoding to get address from coordinates
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const address = data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

          setSelectedLocation({
            address,
            latitude,
            longitude,
          });
          setIsLoading(false);
        } catch (error) {
          // If reverse geocoding fails, just use coordinates
          setSelectedLocation({
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
            latitude,
            longitude,
          });
          setIsLoading(false);
        }
      },
      (err) => {
        setIsLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError(
              'Location permission was denied. Please enable location access in your browser settings or select your location on the map below.'
            );
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location information is unavailable. Please select your location on the map below.');
            break;
          case err.TIMEOUT:
            setError('The request to get your location timed out. Please select your location on the map below.');
            break;
          default:
            setError('An unknown error occurred. Please select your location on the map below.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleMapLocationChange = (location: LocationData) => {
    setSelectedLocation(location);
    setError(null);
  };

  const handleSaveLocation = () => {
    if (selectedLocation) {
      onLocationObtained(selectedLocation.latitude, selectedLocation.longitude);
      onClose();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Enable Location Services" size={showMap ? 'lg' : 'md'}>
      <div className="p-6">
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-savoy-blue/10 rounded-full flex items-center justify-center mb-4">
            <MapPinIcon className="w-8 h-8 text-savoy-blue" />
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Share Your Location
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4">
            To help you find nearby jobs and connect with local businesses, we need your location.
          </p>

          {/* Use My Current Location Button */}
          <button
            onClick={handleAllowLocation}
            disabled={isLoading}
            className="w-full px-4 py-2.5 bg-savoy-blue text-white rounded-lg font-medium hover:bg-savoy-blue/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mb-4"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Getting Location...</span>
              </>
            ) : (
              <>
                <MapPinIcon className="w-4 h-4" />
                <span>Use My Current Location</span>
              </>
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 text-left">{error}</p>
            </div>
          )}

          {/* OR Divider */}
          <div className="w-full flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-sm text-gray-500">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Pick Location Button or Map */}
          {!showMap ? (
            <div className="w-full mb-4">
              <button
                onClick={() => setShowMap(true)}
                className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <MapPinIcon className="w-4 h-4" />
                <span>Pick Location on Map</span>
              </button>
              {/* Show selected location info when map is collapsed */}
              {selectedLocation && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700 text-center">
                    <span className="font-medium">Selected:</span> {selectedLocation.address}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full mb-4 text-left">
              <LocationPickerMap
                value={selectedLocation}
                onChange={handleMapLocationChange}
                placeholder="Search for a location or click on the map..."
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={handleSkip}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Skip for Now
            </button>
            <button
              onClick={handleSaveLocation}
              disabled={!selectedLocation || isLoading}
              className="flex-1 px-4 py-2.5 bg-savoy-blue text-white rounded-lg font-medium hover:bg-savoy-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <MapPinIcon className="w-4 h-4" />
              <span>Save Location</span>
            </button>
          </div>

          {/* Privacy Note */}
          <p className="text-xs text-gray-500 mt-4">
            Your location data is only used to improve your job search experience and is never
            shared with third parties.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default LocationPermissionModal;
