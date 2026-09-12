'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Camera, Loader2, Save, User as UserIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { updateProfile } from '@/lib/profile-actions';
import { uploadImage } from '@/lib/upload-client';
import { toast } from '@/hooks/use-toast';

interface ProfileFormProps {
  initial: {
    name: string;
    username: string;
    bio: string;
    location: string;
    image: string;
  };
}

const BIO_LIMIT = 280;

export function ProfileForm({ initial }: ProfileFormProps) {
  const [form, setForm] = useState(initial);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setError(null);
  }

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file, 'avatar');
      set('image', url);
      toast({ title: 'Photo ready', description: 'Save to apply it.', variant: 'success' });
    } catch (err) {
      toast({
        title: 'Upload failed',
        description: err instanceof Error ? err.message : 'Could not upload that photo.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const result = await updateProfile(form);

    if (result?.error) {
      setError(result.error);
      setSaving(false);
      return;
    }

    toast({ title: 'Profile saved', variant: 'success' });
    setSaving(false);
    // Refresh so the navbar avatar and any cached server data pick up the change.
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Edit profile</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Your name, photo and username appear on your reports and the leaderboard.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-200"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p className="text-xs leading-relaxed">{error}</p>
        </div>
      )}

      {/* Photo */}
      <div className="flex items-center gap-5">
        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center flex-shrink-0">
          {form.image ? (
            <Image src={form.image} alt="" fill className="object-cover" sizes="80px" />
          ) : (
            <UserIcon className="w-8 h-8 text-white" />
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="avatar-input"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium cursor-pointer hover:bg-foreground/5 transition-colors"
          >
            <Camera className="w-4 h-4" />
            {form.image ? 'Change photo' : 'Add a photo'}
          </label>
          <input
            id="avatar-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={handlePhoto}
            disabled={uploading}
          />
          <p className="text-xs text-muted-foreground mt-2">JPG, PNG or WEBP, up to 10MB.</p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Display name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Your name"
            required
            maxLength={60}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              @
            </span>
            <Input
              id="username"
              value={form.username}
              onChange={(e) => set('username', e.target.value.toLowerCase())}
              placeholder="yourhandle"
              className="pl-7"
              maxLength={20}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Lowercase letters, numbers and underscores. Optional.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Area</Label>
        <Input
          id="location"
          value={form.location}
          onChange={(e) => set('location', e.target.value)}
          placeholder="e.g. Akurdi, Pune"
          maxLength={80}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">About you</Label>
        <Textarea
          id="bio"
          value={form.bio}
          onChange={(e) => set('bio', e.target.value.slice(0, BIO_LIMIT))}
          placeholder="A line or two about the part of the city you look out for."
          rows={3}
          maxLength={BIO_LIMIT}
        />
        <p className="text-xs text-muted-foreground text-right">
          {form.bio.length}/{BIO_LIMIT}
        </p>
      </div>

      <div className="flex justify-end">
        <Button type="submit" loading={saving} disabled={uploading} className="gap-2">
          <Save className="w-4 h-4" />
          Save changes
        </Button>
      </div>
    </form>
  );
}
