'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StepIndicator } from './StepIndicator';
import { Step1Details } from './Step1Details';
import { Step2Location } from './Step2Location';
import { Step3Photo } from './Step3Photo';
import { Button } from '@/components/ui/button';
import { createIssue } from '@/lib/actions';
import { UPVOTE_THRESHOLD } from '@/lib/constants';
import { toast } from '@/hooks/use-toast';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';

const STEPS = ['Details', 'Location', 'Photo'];

interface FormData {
  title: string;
  description: string;
  category: string;
  locationLat: number | null;
  locationLng: number | null;
  address: string;
  photoUrl: string;
}

const INITIAL: FormData = {
  title: '',
  description: '',
  category: '',
  locationLat: null,
  locationLng: null,
  address: '',
  photoUrl: '',
};

export function ReportForm() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  function handleChange(field: string, value: any) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => { const e = { ...prev }; delete e[field]; return e; });
  }

  function validateStep(s: number): boolean {
    const newErrors: Record<string, string> = {};

    if (s === 0) {
      if (!formData.category) newErrors.category = 'Please select a category';
      if (formData.title.length < 5) newErrors.title = 'Title must be at least 5 characters';
      if (formData.description.length < 20) newErrors.description = 'Description must be at least 20 characters';
    }

    if (s === 1) {
      // Compared against null rather than falsy: latitude 0 is the equator, and a
      // truthiness test rejected it as "not pinned".
      if (formData.locationLat == null)
        newErrors.locationLat = 'Please pin a location on the map';
      if (!formData.address) newErrors.address = 'Address is required';
    }

    if (s === 2) {
      if (!formData.photoUrl) newErrors.photoUrl = 'Please upload a photo of the issue';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    if (validateStep(step)) setStep((s) => s + 1);
  }

  function handleBack() {
    setStep((s) => s - 1);
    setErrors({});
  }

  async function handleSubmit() {
    if (!validateStep(2)) return;
    setSubmitting(true);

    const result = await createIssue({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      locationLat: formData.locationLat!,
      locationLng: formData.locationLng!,
      address: formData.address,
      photoUrl: formData.photoUrl,
    });

    if (result?.error) {
      toast({ title: 'Error', description: result.error, variant: 'destructive' });
      setSubmitting(false);
      return;
    }

    toast({
      title: 'Report filed',
      description: `It is now on the feed. Once it reaches ${UPVOTE_THRESHOLD} votes it goes to the authority.`,
      variant: 'success',
    });

    router.push('/dashboard');
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step indicator */}
      <div className="mb-10">
        <StepIndicator currentStep={step} steps={STEPS} />
      </div>

      {/* Step content */}
      <div className="glass-card p-8 min-h-[400px]">
        {step === 0 && (
          <Step1Details data={formData} onChange={handleChange} errors={errors} />
        )}
        {step === 1 && (
          <Step2Location data={formData} onChange={handleChange} errors={errors} />
        )}
        {step === 2 && (
          <Step3Photo data={formData} onChange={handleChange} errors={errors} />
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={step === 0}
          className="gap-2"
          id="report-form-back-btn"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>

        {step < STEPS.length - 1 ? (
          <Button type="button" onClick={handleNext} className="gap-2" id="report-form-next-btn">
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="gradient"
            onClick={handleSubmit}
            loading={submitting}
            className="gap-2 px-8"
            id="report-form-submit-btn"
          >
            <Send className="w-4 h-4" />
            Submit Report
          </Button>
        )}
      </div>
    </div>
  );
}
