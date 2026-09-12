'use client';

import { MapPicker } from '@/components/MapPicker';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';

interface Step2LocationProps {
  data: { locationLat: number | null; locationLng: number | null; address: string };
  onChange: (field: string, value: any) => void;
  errors: Record<string, string>;
}

export function Step2Location({ data, onChange, errors }: Step2LocationProps) {
  function handleLocationSelect(lat: number, lng: number, address: string) {
    onChange('locationLat', lat);
    onChange('locationLng', lng);
    onChange('address', address);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Where is it?</h2>
        <p className="text-sm text-muted-foreground">
          Tap the spot on the map, or use your device location if you are standing there now.
        </p>
      </div>

      {/* Map — SSR guard is handled inside MapPicker itself */}
      <MapPicker
        onLocationSelect={handleLocationSelect}
        initialLat={data.locationLat ?? undefined}
        initialLng={data.locationLng ?? undefined}
      />

      {errors.locationLat && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {errors.locationLat}
        </p>
      )}

      {/* Reverse-geocoded address, editable */}
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-primary pointer-events-none" />
          <Input
            id="address"
            className="pl-10"
            placeholder="Fills in from the map — edit it if the street name is off"
            value={data.address}
            onChange={(e) => onChange('address', e.target.value)}
          />
        </div>
        {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
      </div>

      {data.locationLat != null && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-xs text-emerald-700 dark:text-emerald-400">
            Pinned at {data.locationLat.toFixed(4)}°N, {data.locationLng?.toFixed(4)}°E
          </p>
        </div>
      )}
    </div>
  );
}
