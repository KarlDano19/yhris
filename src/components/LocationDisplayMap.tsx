'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationDisplayMapProps {
  latitude: number;
  longitude: number;
  address: string;
}

const LocationDisplayMap = ({ latitude, longitude, address }: LocationDisplayMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize the map
    const map = L.map(mapContainerRef.current, {
      center: [latitude, longitude],
      zoom: 15,
      dragging: false, // Disable dragging
      touchZoom: false, // Disable touch zoom
      scrollWheelZoom: false, // Disable scroll wheel zoom
      doubleClickZoom: false, // Disable double-click zoom
      boxZoom: false, // Disable box zoom
      keyboard: false, // Disable keyboard navigation
      zoomControl: false, // Hide zoom controls
    });

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add marker
    const marker = L.marker([latitude, longitude]).addTo(map);
    if (address) {
      marker.bindPopup(address);
    }

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  // Update marker position when coordinates change
  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      const newLatLng = L.latLng(latitude, longitude);
      markerRef.current.setLatLng(newLatLng);
      mapRef.current.setView(newLatLng, 15);
      
      if (address) {
        markerRef.current.bindPopup(address);
      }
    }
  }, [latitude, longitude, address]);

  return (
    <div className="relative">
      <div
        ref={mapContainerRef}
        className="h-[300px] w-full rounded-lg border border-gray-300 relative"
      />
      {/* Overlay to prevent interaction */}
      <div className="absolute inset-0 bg-transparent rounded-lg pointer-events-auto cursor-not-allowed" />
      <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded shadow-md text-xs text-gray-600 z-[1000]">
        Location preview (read-only)
      </div>
    </div>
  );
};

export default LocationDisplayMap;


