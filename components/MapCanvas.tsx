'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';

// Leaflet resolves its default marker images via relative paths that the bundler
// rewrites, which breaks the icon. Point them at the CDN copies instead.
// Runs once at module scope — this file is only ever loaded on the client.
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/** Reports map clicks upward. Must live inside <MapContainer> to access the map context. */
function ClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

/**
 * <MapContainer> only reads `center`/`zoom` on mount, so pans triggered from
 * outside the map (e.g. the "Use My Location" button) need to be applied here.
 */
function Recenter({ marker }: { marker: { lat: number; lng: number } | null }) {
  const map = useMap();

  useEffect(() => {
    if (marker) map.setView([marker.lat, marker.lng], Math.max(map.getZoom(), 14));
  }, [map, marker]);

  return null;
}

interface MapCanvasProps {
  center: [number, number];
  zoom: number;
  marker: { lat: number; lng: number } | null;
  onMapClick: (lat: number, lng: number) => void;
}

export default function MapCanvas({ center, zoom, marker, onMapClick }: MapCanvasProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ width: '100%', height: '100%' }}
      zoomControl
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler onMapClick={onMapClick} />
      <Recenter marker={marker} />
      {marker && <Marker position={[marker.lat, marker.lng]} />}
    </MapContainer>
  );
}
