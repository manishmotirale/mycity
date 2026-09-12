import { Check } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CATEGORY_META } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface Step1DetailsProps {
  data: { title: string; description: string; category: string };
  onChange: (field: string, value: string) => void;
  errors: Record<string, string>;
}

const CATEGORIES = Object.entries(CATEGORY_META);

export function Step1Details({ data, onChange, errors }: Step1DetailsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">What is the problem?</h2>
        <p className="text-sm text-muted-foreground">
          Be specific enough that someone could find it without asking you.
        </p>
      </div>

      {/* Category tiles. A 12-item dropdown is awkward on a phone, and tiles let
          each option carry a one-line explanation of what belongs in it. */}
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium mb-2">
          Category <span className="text-muted-foreground">*</span>
        </legend>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CATEGORIES.map(([key, meta]) => {
            const selected = data.category === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onChange('category', key)}
                aria-pressed={selected}
                title={meta.hint}
                className={cn(
                  'relative text-left rounded-xl border p-3 transition-all duration-200',
                  'hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  selected
                    ? 'border-primary/60 bg-primary/10 shadow-sm'
                    : 'border-border bg-foreground/[0.02] hover:border-primary/30'
                )}
                id={`category-${key.toLowerCase()}`}
              >
                {selected && (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-primary-foreground" strokeWidth={3.5} />
                  </span>
                )}
                <span className="text-xl leading-none block mb-1.5" aria-hidden>
                  {meta.icon}
                </span>
                <span
                  className={cn(
                    'block text-xs font-medium leading-tight',
                    selected ? 'text-primary' : 'text-foreground'
                  )}
                >
                  {meta.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Explains the chosen tile without cluttering all twelve at once. */}
        {data.category && CATEGORY_META[data.category as keyof typeof CATEGORY_META] && (
          <p className="text-xs text-muted-foreground pt-1">
            {CATEGORY_META[data.category as keyof typeof CATEGORY_META].hint}
          </p>
        )}
        {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
      </fieldset>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">
          Title <span className="text-muted-foreground">*</span>
        </Label>
        <Input
          id="title"
          placeholder="e.g. Large pothole on MG Road near park entrance"
          value={data.title}
          onChange={(e) => onChange('title', e.target.value)}
          maxLength={100}
        />
        <div className="flex justify-between gap-3">
          {errors.title ? <p className="text-xs text-destructive">{errors.title}</p> : <span />}
          <p className="text-xs text-muted-foreground tabular-nums">{data.title.length}/100</p>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">
          Description <span className="text-muted-foreground">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="How long has it been there? Is anyone at risk? Which side of the road, near which landmark?"
          value={data.description}
          onChange={(e) => onChange('description', e.target.value)}
          maxLength={1000}
          rows={5}
        />
        <div className="flex justify-between gap-3">
          {errors.description ? (
            <p className="text-xs text-destructive">{errors.description}</p>
          ) : (
            <span />
          )}
          <p className="text-xs text-muted-foreground tabular-nums">
            {data.description.length}/1000
          </p>
        </div>
      </div>
    </div>
  );
}
