import { useState } from 'react';

interface FormData {
  scentFamily: string[];
  occasion: string[];
  season: string[];
  intensity: string;
  ingredientCuriosity: string[];
  name: string;
  email: string;
  message: string;
}

const STEPS = [
  { title: 'Scent Family', subtitle: 'What calls to you?' },
  { title: 'Occasion & Season', subtitle: 'When will you wear it?' },
  { title: 'Intensity', subtitle: 'How bold do you go?' },
  { title: 'Curiosities', subtitle: 'What intrigues you?' },
  { title: 'About You', subtitle: 'How can I reach you?' },
];

const SCENT_FAMILIES = [
  { id: 'woody', label: 'Woody', desc: 'Cedar, sandalwood, oud' },
  { id: 'floral', label: 'Floral', desc: 'Jasmine, rose, tuberose' },
  { id: 'oriental', label: 'Oriental', desc: 'Amber, spices, resins' },
  { id: 'fresh', label: 'Fresh', desc: 'Citrus, green, aquatic' },
  { id: 'animalic', label: 'Animalic', desc: 'Musk, leather, ambergris' },
  { id: 'gourmand', label: 'Gourmand', desc: 'Vanilla, honey, tonka' },
];

const OCCASIONS = [
  { id: 'daily', label: 'Daily Wear' },
  { id: 'special', label: 'Special Events' },
  { id: 'evening', label: 'Evening / Romance' },
  { id: 'professional', label: 'Professional' },
  { id: 'ceremonial', label: 'Ceremonial / Ritual' },
  { id: 'signature', label: 'Signature Scent Hunt' },
];

const SEASONS = [
  { id: 'spring', label: 'Spring' },
  { id: 'summer', label: 'Summer' },
  { id: 'autumn', label: 'Autumn' },
  { id: 'winter', label: 'Winter' },
  { id: 'all-year', label: 'All Year' },
];

const INTENSITIES = [
  { id: 'subtle', label: 'Subtle', desc: 'Close to skin, intimate' },
  { id: 'moderate', label: 'Moderate', desc: 'Noticeable, not overwhelming' },
  { id: 'bold', label: 'Bold', desc: 'Commanding, leaves an impression' },
  { id: 'beast', label: 'Beast Mode', desc: 'Unforgettable, fills the room' },
];

const INGREDIENT_CURIOSITIES = [
  { id: 'deer-musk', label: 'Deer Musk', desc: 'Warm, animalic, sensual' },
  { id: 'oud', label: 'Oud', desc: 'Smoky, balsamic, transcendent' },
  { id: 'ambergris', label: 'Ambergris', desc: 'Salty, ethereal, marine' },
  { id: 'florals', label: 'Delicate Florals', desc: 'Jasmine, rose, tuberose' },
  { id: 'spices', label: 'Exotic Spices', desc: 'Saffron, cardamom, cinnamon' },
  { id: 'woods', label: 'Rare Woods', desc: 'Sandalwood, cedar, cypress' },
];

const WEB3FORMS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY';

export default function ConsultationQuestionnaire() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    scentFamily: [],
    occasion: [],
    season: [],
    intensity: '',
    ingredientCuriosity: [],
    name: '',
    email: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const toggleArrayItem = (arr: string[], item: string): string[] =>
    arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];

  const update = (field: keyof FormData, value: string | string[]) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const canProceed = (): boolean => {
    switch (step) {
      case 0: return formData.scentFamily.length > 0;
      case 1: return formData.occasion.length > 0 || formData.season.length > 0;
      case 2: return formData.intensity !== '';
      case 3: return true; // optional
      case 4: return formData.name.trim() !== '' && formData.email.trim() !== '';
      default: return true;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Scent Consultation from ${formData.name}`,
          from_name: 'Panoply Parfums Consultation',
          name: formData.name,
          email: formData.email,
          message: `
SCENT CONSULTATION REQUEST
==========================

Name: ${formData.name}
Email: ${formData.email}

Scent Families: ${formData.scentFamily.join(', ') || 'None selected'}
Occasions: ${formData.occasion.join(', ') || 'None selected'}
Seasons: ${formData.season.join(', ') || 'None selected'}
Intensity: ${formData.intensity || 'Not specified'}
Ingredient Curiosities: ${formData.ingredientCuriosity.join(', ') || 'None selected'}

Additional Notes: ${formData.message || 'None'}
          `.trim(),
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        setError('Something went wrong. Please try again or email me directly at varun@panoplyparfums.com.');
      }
    } catch {
      setError('Network error. Please try again or email me directly at varun@panoplyparfums.com.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-16 px-6">
        <span className="text-4xl">⚗️</span>
        <h2 className="mt-6 font-[family-name:var(--font-display)] text-3xl text-[var(--color-parchment)]">
          Your Raven Has Been Sent
        </h2>
        <p className="mt-4 mx-auto max-w-md text-sm leading-relaxed text-[var(--color-parchment-dim)]">
          Thank you, {formData.name}. I'll review your preferences and send a personalized
          recommendation to {formData.email} within 48 hours. Each consultation receives
          individual attention — you're not a ticket in a queue.
        </p>
        <p className="mt-6 font-[family-name:var(--font-body)] text-xs italic text-[var(--color-parchment-dim)]/50">
          — Varun, Panoply Parfums
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Step indicators */}
      <div className="mb-10 flex items-center justify-center gap-2">
        {STEPS.map((s, i) => (
          <button
            key={i}
            onClick={() => i < step && setStep(i)}
            className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-[family-name:var(--font-display)] transition-all duration-300 ${
              i === step
                ? 'border-[var(--color-amber)] bg-[var(--color-amber)]/10 text-[var(--color-amber)]'
                : i < step
                  ? 'border-[var(--color-amber)]/40 bg-[var(--color-amber)]/5 text-[var(--color-amber)]/60 cursor-pointer hover:border-[var(--color-amber)]/70'
                  : 'border-[var(--color-amber)]/15 bg-transparent text-[var(--color-parchment-dim)]/30'
            }`}
            aria-label={`Go to step ${i + 1}: ${s.title}`}
          >
            {i < step ? '✓' : i + 1}
          </button>
        ))}
      </div>

      {/* Step title */}
      <div className="mb-8 text-center">
        <span className="font-[family-name:var(--font-display)] text-xs tracking-[0.2em] uppercase text-[var(--color-amber)]/60">
          Step {step + 1} of {STEPS.length}
        </span>
        <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-[var(--color-parchment)]">
          {STEPS[step].title}
        </h3>
        <p className="mt-1 font-[family-name:var(--font-body)] text-sm italic text-[var(--color-parchment-dim)]/60">
          {STEPS[step].subtitle}
        </p>
      </div>

      {/* Step 0: Scent Family */}
      {step === 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {SCENT_FAMILIES.map(f => (
            <button
              key={f.id}
              onClick={() => update('scentFamily', toggleArrayItem(formData.scentFamily, f.id))}
              className={`rounded-sm border p-4 text-left transition-all duration-300 ${
                formData.scentFamily.includes(f.id)
                  ? 'border-[var(--color-amber)]/50 bg-[var(--color-amber)]/10'
                  : 'border-[var(--color-amber)]/10 bg-[var(--color-ember)]/40 hover:border-[var(--color-amber)]/30'
              }`}
            >
              <span className="font-[family-name:var(--font-display)] text-sm text-[var(--color-parchment)]">
                {f.label}
              </span>
              <span className="mt-1 block font-[family-name:var(--font-body)] text-xs text-[var(--color-parchment-dim)]/50">
                {f.desc}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Step 1: Occasion & Season */}
      {step === 1 && (
        <div className="space-y-8">
          <div>
            <h4 className="mb-3 font-[family-name:var(--font-display)] text-sm tracking-[0.1em] uppercase text-[var(--color-parchment)]">
              Occasion
            </h4>
            <div className="flex flex-wrap gap-2">
              {OCCASIONS.map(o => (
                <button
                  key={o.id}
                  onClick={() => update('occasion', toggleArrayItem(formData.occasion, o.id))}
                  className={`rounded-full border px-4 py-2 font-[family-name:var(--font-body)] text-xs transition-all duration-300 ${
                    formData.occasion.includes(o.id)
                      ? 'border-[var(--color-amber)]/50 bg-[var(--color-amber)]/10 text-[var(--color-amber)]'
                      : 'border-[var(--color-amber)]/10 bg-transparent text-[var(--color-parchment-dim)] hover:border-[var(--color-amber)]/30'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="mb-3 font-[family-name:var(--font-display)] text-sm tracking-[0.1em] uppercase text-[var(--color-parchment)]">
              Season
            </h4>
            <div className="flex flex-wrap gap-2">
              {SEASONS.map(s => (
                <button
                  key={s.id}
                  onClick={() => update('season', toggleArrayItem(formData.season, s.id))}
                  className={`rounded-full border px-4 py-2 font-[family-name:var(--font-body)] text-xs transition-all duration-300 ${
                    formData.season.includes(s.id)
                      ? 'border-[var(--color-amber)]/50 bg-[var(--color-amber)]/10 text-[var(--color-amber)]'
                      : 'border-[var(--color-amber)]/10 bg-transparent text-[var(--color-parchment-dim)] hover:border-[var(--color-amber)]/30'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Intensity */}
      {step === 2 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {INTENSITIES.map(i => (
            <button
              key={i.id}
              onClick={() => update('intensity', i.id)}
              className={`rounded-sm border p-4 text-left transition-all duration-300 ${
                formData.intensity === i.id
                  ? 'border-[var(--color-amber)]/50 bg-[var(--color-amber)]/10'
                  : 'border-[var(--color-amber)]/10 bg-[var(--color-ember)]/40 hover:border-[var(--color-amber)]/30'
              }`}
            >
              <span className="font-[family-name:var(--font-display)] text-sm text-[var(--color-parchment)]">
                {i.label}
              </span>
              <span className="mt-1 block font-[family-name:var(--font-body)] text-xs text-[var(--color-parchment-dim)]/50">
                {i.desc}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Step 3: Ingredient Curiosity */}
      {step === 3 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {INGREDIENT_CURIOSITIES.map(c => (
            <button
              key={c.id}
              onClick={() => update('ingredientCuriosity', toggleArrayItem(formData.ingredientCuriosity, c.id))}
              className={`rounded-sm border p-4 text-left transition-all duration-300 ${
                formData.ingredientCuriosity.includes(c.id)
                  ? 'border-[var(--color-amber)]/50 bg-[var(--color-amber)]/10'
                  : 'border-[var(--color-amber)]/10 bg-[var(--color-ember)]/40 hover:border-[var(--color-amber)]/30'
              }`}
            >
              <span className="font-[family-name:var(--font-display)] text-sm text-[var(--color-parchment)]">
                {c.label}
              </span>
              <span className="mt-1 block font-[family-name:var(--font-body)] text-xs text-[var(--color-parchment-dim)]/50">
                {c.desc}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Step 4: Contact Details */}
      {step === 4 && (
        <div className="space-y-5">
          <div>
            <label className="mb-1.5 block font-[family-name:var(--font-display)] text-xs tracking-[0.1em] uppercase text-[var(--color-parchment-dim)]">
              Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => update('name', e.target.value)}
              placeholder="Your full name"
              className="w-full rounded-sm border border-[var(--color-amber)]/20 bg-[var(--color-charcoal)] px-4 py-3 font-[family-name:var(--font-body)] text-sm text-[var(--color-parchment)] placeholder:text-[var(--color-parchment-dim)]/30 focus:border-[var(--color-amber)]/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block font-[family-name:var(--font-display)] text-xs tracking-[0.1em] uppercase text-[var(--color-parchment-dim)]">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={e => update('email', e.target.value)}
              placeholder="your@email.com"
              className="w-full rounded-sm border border-[var(--color-amber)]/20 bg-[var(--color-charcoal)] px-4 py-3 font-[family-name:var(--font-body)] text-sm text-[var(--color-parchment)] placeholder:text-[var(--color-parchment-dim)]/30 focus:border-[var(--color-amber)]/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block font-[family-name:var(--font-display)] text-xs tracking-[0.1em] uppercase text-[var(--color-parchment-dim)]">
              Anything else?
            </label>
            <textarea
              value={formData.message}
              onChange={e => update('message', e.target.value)}
              rows={3}
              placeholder="Allergies, preferences, memories you want a scent to evoke..."
              className="w-full rounded-sm border border-[var(--color-amber)]/20 bg-[var(--color-charcoal)] px-4 py-3 font-[family-name:var(--font-body)] text-sm text-[var(--color-parchment)] placeholder:text-[var(--color-parchment-dim)]/30 focus:border-[var(--color-amber)]/50 focus:outline-none resize-none"
            />
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-4 rounded-sm border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs text-red-400">
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          className={`font-[family-name:var(--font-display)] text-xs tracking-[0.12em] uppercase transition-colors ${
            step === 0
              ? 'text-[var(--color-parchment-dim)]/20 cursor-not-allowed'
              : 'text-[var(--color-parchment-dim)] hover:text-[var(--color-amber)]'
          }`}
          disabled={step === 0}
        >
          ← Back
        </button>

        {step < 4 ? (
          <button
            onClick={() => setStep(s => Math.min(4, s + 1))}
            disabled={!canProceed()}
            className={`inline-flex items-center gap-2 rounded-sm border px-6 py-3 font-[family-name:var(--font-display)] text-xs tracking-[0.12em] uppercase transition-all duration-500 ${
              canProceed()
                ? 'border-[var(--color-amber)]/40 bg-[var(--color-amber)]/10 text-[var(--color-parchment)] hover:bg-[var(--color-amber)]/20 hover:border-[var(--color-amber)]/60 hover:shadow-[0_0_30px_4px_rgba(201,169,110,0.15)] cursor-pointer'
                : 'border-[var(--color-amber)]/10 bg-transparent text-[var(--color-parchment-dim)]/30 cursor-not-allowed'
            }`}
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canProceed() || submitting}
            className={`inline-flex items-center gap-2 rounded-sm border px-8 py-3 font-[family-name:var(--font-display)] text-xs tracking-[0.12em] uppercase transition-all duration-500 ${
              canProceed() && !submitting
                ? 'border-[var(--color-amber)]/40 bg-[var(--color-amber)]/10 text-[var(--color-parchment)] hover:bg-[var(--color-amber)]/20 hover:border-[var(--color-amber)]/60 hover:shadow-[0_0_30px_4px_rgba(201,169,110,0.15)] cursor-pointer'
                : 'border-[var(--color-amber)]/10 bg-transparent text-[var(--color-parchment-dim)]/30 cursor-not-allowed'
            }`}
          >
            {submitting ? 'Sending...' : 'Send to Varun'}
          </button>
        )}
      </div>
    </div>
  );
}
