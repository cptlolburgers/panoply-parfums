import { useState } from 'react';

// Shared style objects (Tailwind not reliably scanned in .tsx)
const s = {
  // Colors
  parchment: 'var(--color-parchment)',
  parchmentDim: 'var(--color-parchment-dim)',
  amber: 'var(--color-amber)',
  charcoal: 'var(--color-charcoal)',
  ember: 'var(--color-ember)',
  abyss: 'var(--color-abyss)',
  // Fonts
  display: 'var(--font-display)',
  body: 'var(--font-body)',
};

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

const btnBase: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: '0.5rem', borderRadius: '2px',
  fontFamily: s.display, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase',
  transition: 'all 0.5s', cursor: 'pointer', border: '1px solid',
};

const btnActive: React.CSSProperties = {
  ...btnBase, padding: '0.75rem 2rem',
  borderColor: 'color-mix(in oklab, var(--color-amber) 40%, transparent)',
  backgroundColor: 'color-mix(in oklab, var(--color-amber) 10%, transparent)',
  color: s.parchment,
};

const btnDisabled: React.CSSProperties = {
  ...btnBase, padding: '0.75rem 2rem',
  borderColor: 'color-mix(in oklab, var(--color-amber) 10%, transparent)',
  backgroundColor: 'transparent', color: 'color-mix(in oklab, var(--color-parchment-dim) 30%, transparent)',
  cursor: 'not-allowed',
};

const inputStyle: React.CSSProperties = {
  width: '100%', borderRadius: '2px',
  border: '1px solid color-mix(in oklab, var(--color-amber) 20%, transparent)',
  backgroundColor: s.charcoal, padding: '0.75rem 1rem',
  fontFamily: s.body, fontSize: '0.875rem', color: s.parchment,
};

const labelStyle: React.CSSProperties = {
  display: 'block', marginBottom: '0.375rem',
  fontFamily: s.display, fontSize: '0.75rem', letterSpacing: '0.1em',
  textTransform: 'uppercase', color: s.parchmentDim,
};

const cardBase: React.CSSProperties = {
  borderRadius: '2px', border: '1px solid color-mix(in oklab, var(--color-amber) 10%, transparent)',
  backgroundColor: 'color-mix(in oklab, var(--color-ember) 40%, transparent)',
  padding: '1rem', textAlign: 'left', transition: 'all 0.3s', cursor: 'pointer',
  width: '100%',
};

const cardActive: React.CSSProperties = {
  ...cardBase,
  borderColor: 'color-mix(in oklab, var(--color-amber) 50%, transparent)',
  backgroundColor: 'color-mix(in oklab, var(--color-amber) 10%, transparent)',
};

const pillBase: React.CSSProperties = {
  borderRadius: '9999px', border: '1px solid color-mix(in oklab, var(--color-amber) 10%, transparent)',
  background: 'transparent', padding: '0.5rem 1rem', fontFamily: s.body, fontSize: '0.75rem',
  color: s.parchmentDim, transition: 'all 0.3s', cursor: 'pointer',
};

const pillActive: React.CSSProperties = {
  ...pillBase,
  borderColor: 'color-mix(in oklab, var(--color-amber) 50%, transparent)',
  backgroundColor: 'color-mix(in oklab, var(--color-amber) 10%, transparent)',
  color: s.amber,
};

const stepDotBase: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: '2rem', height: '2rem', borderRadius: '9999px',
  border: '1px solid', fontFamily: s.display, fontSize: '0.75rem', transition: 'all 0.3s',
};

export default function ConsultationQuestionnaire() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    scentFamily: [], occasion: [], season: [], intensity: '',
    ingredientCuriosity: [], name: '', email: '', message: '',
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
      case 3: return true;
      case 4: return formData.name.trim() !== '' && formData.email.trim() !== '';
      default: return true;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true); setError('');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Scent Consultation from ${formData.name}`,
          from_name: 'Panoply Parfums Consultation',
          name: formData.name, email: formData.email,
          message: `SCENT CONSULTATION REQUEST\n==========================\n\nName: ${formData.name}\nEmail: ${formData.email}\n\nScent Families: ${formData.scentFamily.join(', ') || 'None'}\nOccasions: ${formData.occasion.join(', ') || 'None'}\nSeasons: ${formData.season.join(', ') || 'None'}\nIntensity: ${formData.intensity || 'Not specified'}\nIngredient Curiosities: ${formData.ingredientCuriosity.join(', ') || 'None'}\n\nAdditional Notes: ${formData.message || 'None'}`.trim(),
        }),
      });
      if (res.ok) setSubmitted(true);
      else setError('Something went wrong. Please try again or email varun@panoplyparfums.com.');
    } catch { setError('Network error. Please try again or email varun@panoplyparfums.com.'); }
    finally { setSubmitting(false); }
  };

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
        <span style={{ fontSize: '2.5rem' }}>⚗️</span>
        <h2 style={{ marginTop: '1.5rem', fontFamily: s.display, fontSize: '1.875rem', color: s.parchment }}>Your Raven Has Been Sent</h2>
        <p style={{ marginTop: '1rem', maxWidth: '28rem', marginLeft: 'auto', marginRight: 'auto', fontSize: '0.875rem', lineHeight: 1.625, color: s.parchmentDim }}>
          Thank you, {formData.name}. I'll review your preferences and send a personalized recommendation to {formData.email} within 48 hours.
        </p>
        <p style={{ marginTop: '1.5rem', fontFamily: s.body, fontSize: '0.75rem', fontStyle: 'italic', color: 'color-mix(in oklab, var(--color-parchment-dim) 50%, transparent)' }}>— Varun, Panoply Parfums</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '42rem', margin: '0 auto' }}>
      {/* Step dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2.5rem' }}>
        {STEPS.map((st, i) => (
          <button key={i} onClick={() => i < step && setStep(i)}
            style={{
              ...stepDotBase,
              borderColor: i === step ? s.amber : i < step ? 'color-mix(in oklab, var(--color-amber) 40%, transparent)' : 'color-mix(in oklab, var(--color-amber) 15%, transparent)',
              backgroundColor: i === step ? 'color-mix(in oklab, var(--color-amber) 10%, transparent)' : i < step ? 'color-mix(in oklab, var(--color-amber) 5%, transparent)' : 'transparent',
              color: i === step ? s.amber : i < step ? 'color-mix(in oklab, var(--color-amber) 60%, transparent)' : 'color-mix(in oklab, var(--color-parchment-dim) 30%, transparent)',
              cursor: i < step ? 'pointer' : 'default',
            }}
            aria-label={`Step ${i + 1}: ${st.title}`}
          >{i < step ? '✓' : i + 1}</button>
        ))}
      </div>

      {/* Step title */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <span style={{ fontFamily: s.display, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'color-mix(in oklab, var(--color-amber) 60%, transparent)' }}>
          Step {step + 1} of {STEPS.length}
        </span>
        <h3 style={{ marginTop: '0.5rem', fontFamily: s.display, fontSize: '1.5rem', color: s.parchment }}>{STEPS[step].title}</h3>
        <p style={{ marginTop: '0.25rem', fontFamily: s.body, fontSize: '0.875rem', fontStyle: 'italic', color: 'color-mix(in oklab, var(--color-parchment-dim) 60%, transparent)' }}>{STEPS[step].subtitle}</p>
      </div>

      {/* Step 0: Scent Family */}
      {step === 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
          {SCENT_FAMILIES.map(f => (
            <button key={f.id} onClick={() => update('scentFamily', toggleArrayItem(formData.scentFamily, f.id))}
              style={formData.scentFamily.includes(f.id) ? cardActive : cardBase}>
              <span style={{ fontFamily: s.display, fontSize: '0.875rem', color: s.parchment }}>{f.label}</span>
              <span style={{ display: 'block', marginTop: '0.25rem', fontFamily: s.body, fontSize: '0.75rem', color: 'color-mix(in oklab, var(--color-parchment-dim) 50%, transparent)' }}>{f.desc}</span>
            </button>
          ))}
        </div>
      )}

      {/* Step 1: Occasion & Season */}
      {step === 1 && (
        <div>
          <h4 style={{ marginBottom: '0.75rem', fontFamily: s.display, fontSize: '0.875rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: s.parchment }}>Occasion</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {OCCASIONS.map(o => (
              <button key={o.id} onClick={() => update('occasion', toggleArrayItem(formData.occasion, o.id))}
                style={formData.occasion.includes(o.id) ? pillActive : pillBase}>{o.label}</button>
            ))}
          </div>
          <h4 style={{ marginBottom: '0.75rem', fontFamily: s.display, fontSize: '0.875rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: s.parchment }}>Season</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {SEASONS.map(se => (
              <button key={se.id} onClick={() => update('season', toggleArrayItem(formData.season, se.id))}
                style={formData.season.includes(se.id) ? pillActive : pillBase}>{se.label}</button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Intensity */}
      {step === 2 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
          {INTENSITIES.map(i => (
            <button key={i.id} onClick={() => update('intensity', i.id)}
              style={formData.intensity === i.id ? cardActive : cardBase}>
              <span style={{ fontFamily: s.display, fontSize: '0.875rem', color: s.parchment }}>{i.label}</span>
              <span style={{ display: 'block', marginTop: '0.25rem', fontFamily: s.body, fontSize: '0.75rem', color: 'color-mix(in oklab, var(--color-parchment-dim) 50%, transparent)' }}>{i.desc}</span>
            </button>
          ))}
        </div>
      )}

      {/* Step 3: Ingredient Curiosity */}
      {step === 3 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
          {INGREDIENT_CURIOSITIES.map(c => (
            <button key={c.id} onClick={() => update('ingredientCuriosity', toggleArrayItem(formData.ingredientCuriosity, c.id))}
              style={formData.ingredientCuriosity.includes(c.id) ? cardActive : cardBase}>
              <span style={{ fontFamily: s.display, fontSize: '0.875rem', color: s.parchment }}>{c.label}</span>
              <span style={{ display: 'block', marginTop: '0.25rem', fontFamily: s.body, fontSize: '0.75rem', color: 'color-mix(in oklab, var(--color-parchment-dim) 50%, transparent)' }}>{c.desc}</span>
            </button>
          ))}
        </div>
      )}

      {/* Step 4: Contact */}
      {step === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={labelStyle}>Name *</label>
            <input type="text" required value={formData.name} onChange={e => update('name', e.target.value)} placeholder="Your full name" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Email *</label>
            <input type="email" required value={formData.email} onChange={e => update('email', e.target.value)} placeholder="your@email.com" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Anything else?</label>
            <textarea value={formData.message} onChange={e => update('message', e.target.value)} rows={3}
              placeholder="Allergies, preferences, memories you want a scent to evoke..."
              style={{ ...inputStyle, resize: 'none' }} />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ marginTop: '1rem', borderRadius: '2px', border: '1px solid rgba(251,44,54,0.2)', backgroundColor: 'rgba(251,44,54,0.05)', padding: '0.75rem 1rem', fontSize: '0.75rem', color: '#fb2c36' }}>{error}</div>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
          style={{ fontFamily: s.display, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: step === 0 ? 'not-allowed' : 'pointer', color: step === 0 ? 'color-mix(in oklab, var(--color-parchment-dim) 20%, transparent)' : s.parchmentDim }}>
          ← Back
        </button>
        {step < 4 ? (
          <button onClick={() => setStep(s => Math.min(4, s + 1))} disabled={!canProceed()} style={canProceed() ? btnActive : btnDisabled}>Next</button>
        ) : (
          <button onClick={handleSubmit} disabled={!canProceed() || submitting} style={canProceed() && !submitting ? btnActive : btnDisabled}>
            {submitting ? 'Sending...' : 'Send to Varun'}
          </button>
        )}
      </div>
    </div>
  );
}
