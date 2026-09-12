'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadImage } from '@/lib/upload-client';
import { toast } from '@/hooks/use-toast';

interface Step3PhotoProps {
  data: { photoUrl: string };
  onChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

export function Step3Photo({ data, onChange, errors }: Step3PhotoProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      setUploading(true);
      try {
        onChange('photoUrl', await uploadImage(file, 'issue'));
      } catch (err) {
        toast({
          title: 'Upload failed',
          description: err instanceof Error ? err.message : 'Could not upload that photo.',
          variant: 'destructive',
        });
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Add a photo</h2>
        <p className="text-sm text-muted-foreground">
          One clear shot, required. Without it the authority has no way to confirm the report.
        </p>
      </div>

      {/* Upload zone */}
      {!data.photoUrl && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-200 ${
            dragOver
              ? 'border-sky-500 bg-sky-500/10'
              : 'border-foreground/20 hover:border-foreground/40 hover:bg-foreground/[0.02]'
          }`}
        >
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleFileChange}
            id="photo-upload-input"
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Uploading photo...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                <Upload className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Drag & drop or <span className="text-primary">click to browse</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP up to 10MB</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preview */}
      {data.photoUrl && (
        <div className="relative rounded-2xl overflow-hidden border border-foreground/10">
          <Image
            src={data.photoUrl}
            alt="Issue photo preview"
            width={800}
            height={400}
            className="w-full object-cover max-h-64"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
          <div className="absolute top-3 right-3">
            <Button
              type="button"
              size="icon"
              variant="destructive"
              onClick={() => onChange('photoUrl', '')}
              className="w-8 h-8 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
            <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs text-emerald-400 font-medium">Photo attached</span>
          </div>
        </div>
      )}

      {errors.photoUrl && (
        <p className="text-xs text-destructive">{errors.photoUrl}</p>
      )}
    </div>
  );
}
