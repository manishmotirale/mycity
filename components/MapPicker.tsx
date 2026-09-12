'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Locate, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MAP_DEFAULT_CENTER } from '@/lib/constants';

// Leaflet touches `window` at import time, so the map itself must never render on
// the server. Declared at module scope so the component identity stays stable.
const MapCanvas = dynamic(() => import('@/components/MapCanvas'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-muted/60 z-10">
      <Loader2 className="w-6 h-6 text-primary animate-spin" />
    </div>
  ),
});

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  initialLat?: number;
  initialLng?: number;
}

/** Reverse geocode using Nominatim (OpenStreetMap) — free, no API key required. */
async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    return data.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  } catch {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
}

export function MapPicker({ onLocationSelect, initialLat, initialLng }: MapPickerProps) {
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    initialLat != null && initialLng != null ? { lat: initialLat, lng: initialLng } : null
  );
  const [locating, setLocating] = useState(false);

  const handleMapClick = useCallback(
    async (lat: number, lng: number) => {
      setMarker({ lat, lng });
      const address = await reverseGeocode(lat, lng);
      onLocationSelect(lat, lng, address);
    },
    [onLocationSelect]
  );

  const handleGeolocate = useCallback(() => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        await handleMapClick(coords.latitude, coords.longitude);
        setLocating(false);
      },
      () => setLocating(false)
    );
  }, [handleMapClick]);

  const center: [number, number] = [
    initialLat ?? MAP_DEFAULT_CENTER.lat,
    initialLng ?? MAP_DEFAULT_CENTER.lng,
  ];

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border border-foreground/10"
      style={{ height: 320 }}
    >
      <MapCanvas
        center={center}
        zoom={initialLat != null ? 14 : MAP_DEFAULT_CENTER.zoom}
        marker={marker}
        onMapClick={handleMapClick}
      />

      {/* Hint overlay */}
      {!marker && (
        <div className="absolute inset-0 flex items-end justify-center pb-4 pointer-events-none z-[1000]">
          <div className="glass-card px-4 py-2 rounded-xl text-sm text-muted-foreground text-center">
            Tap the map to drop a pin
          </div>
        </div>
      )}

      {/* Geolocate button */}
      <div className="absolute bottom-3 left-3 z-[1000]">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={handleGeolocate}
          disabled={locating}
          className="gap-2 backdrop-blur-sm bg-card/90 border-foreground/20"
          id="map-geolocate-btn"
        >
          {locating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Locate className="w-3.5 h-3.5" />
          )}
          {locating ? 'Locating...' : 'Use My Location'}
        </Button>
      </div>

      {/* Pinned coord display */}
      {marker && (
        <div className="absolute top-3 right-3 z-[1000]">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-card/90 backdrop-blur-sm border border-foreground/10 text-xs text-primary">
            <MapPin className="w-3 h-3" />
            {marker.lat.toFixed(4)}°, {marker.lng.toFixed(4)}°
          </div>
        </div>
      )}
    </div>
  );
}
