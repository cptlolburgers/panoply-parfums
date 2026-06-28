import { useState } from 'react';

// Direct color values — no color-mix(), no Tailwind scanning needed
const C = { parchment: '#e8dcc8', parchmentDim: '#c4b89a', amber: '#c9a96e', charcoal: '#1a1410', ember: '#2a1f16' };
const fade = (hex: string, a: number) => { const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16); return `rgba(${r},${g},${b},${a})`; };
const F = { display: 'var(--font-display)', body: 'var(--font-body)' };

interface FormData { scentFamily: string[]; occasion: string[]; season: string[]; intensity: string; ingredientCuriosity: string[]; name: string; email: string; message: string; }

const STEPS = [{ title: 'Scent Family', sub: 'What calls to you?' },{ title: 'Occasion & Season', sub: 'When will you wear it?' },{ title: 'Intensity', sub: 'How bold do you go?' },{ title: 'Curiosities', sub: 'What intrigues you?' },{ title: 'About You', sub: 'How can I reach you?' }];
const SCENT_FAMILIES = [{ id: 'woody', l: 'Woody', d: 'Cedar, sandalwood, oud' },{ id: 'floral', l: 'Floral', d: 'Jasmine, rose, tuberose' },{ id: 'oriental', l: 'Oriental', d: 'Amber, spices, resins' },{ id: 'fresh', l: 'Fresh', d: 'Citrus, green, aquatic' },{ id: 'animalic', l: 'Animalic', d: 'Musk, leather, ambergris' },{ id: 'gourmand', l: 'Gourmand', d: 'Vanilla, honey, tonka' }];
const OCCASIONS = [{ id: 'daily', l: 'Daily Wear' },{ id: 'special', l: 'Special Events' },{ id: 'evening', l: 'Evening / Romance' },{ id: 'professional', l: 'Professional' },{ id: 'ceremonial', l: 'Ceremonial / Ritual' },{ id: 'signature', l: 'Signature Scent Hunt' }];
const SEASONS = [{ id: 'spring', l: 'Spring' },{ id: 'summer', l: 'Summer' },{ id: 'autumn', l: 'Autumn' },{ id: 'winter', l: 'Winter' },{ id: 'all-year', l: 'All Year' }];
const INTENSITIES = [{ id: 'subtle', l: 'Subtle', d: 'Close to skin, intimate' },{ id: 'moderate', l: 'Moderate', d: 'Noticeable, not overwhelming' },{ id: 'bold', l: 'Bold', d: 'Commanding, leaves an impression' },{ id: 'beast', l: 'Beast Mode', d: 'Unforgettable, fills the room' }];
const INGREDIENT_CURIOSITIES = [{ id: 'deer-musk', l: 'Deer Musk', d: 'Warm, animalic, sensual' },{ id: 'oud', l: 'Oud', d: 'Smoky, balsamic, transcendent' },{ id: 'ambergris', l: 'Ambergris', d: 'Salty, ethereal, marine' },{ id: 'florals', l: 'Delicate Florals', d: 'Jasmine, rose, tuberose' },{ id: 'spices', l: 'Exotic Spices', d: 'Saffron, cardamom, cinnamon' },{ id: 'woods', l: 'Rare Woods', d: 'Sandalwood, cedar, cypress' }];

const WEB3FORMS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY';

// Shared style factories
const cardStyle = (active: boolean): React.CSSProperties => ({
  borderRadius: '2px', border: `1px solid ${active ? fade(C.amber,0.5) : fade(C.amber,0.1)}`,
  backgroundColor: active ? fade(C.amber,0.1) : fade(C.ember,0.4),
  padding: '1rem', textAlign: 'left', transition: 'all 0.3s', cursor: 'pointer', width: '100%',
});
const pillStyle = (active: boolean): React.CSSProperties => ({
  borderRadius: '9999px', border: `1px solid ${active ? fade(C.amber,0.5) : fade(C.amber,0.1)}`,
  background: active ? fade(C.amber,0.1) : 'transparent', padding: '0.5rem 1rem',
  fontFamily: F.body, fontSize: '0.75rem', color: active ? C.amber : C.parchmentDim,
  transition: 'all 0.3s', cursor: 'pointer',
});
const inputS: React.CSSProperties = { width: '100%', borderRadius: '2px', border: `1px solid ${fade(C.amber,0.2)}`, backgroundColor: C.charcoal, padding: '0.75rem 1rem', fontFamily: F.body, fontSize: '0.875rem', color: C.parchment, boxSizing: 'border-box' };
const labelS: React.CSSProperties = { display: 'block', marginBottom: '0.375rem', fontFamily: F.display, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.parchmentDim };
const btnBase: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', borderRadius: '2px', fontFamily: F.display, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', transition: 'all 0.5s', cursor: 'pointer', border: '1px solid', padding: '0.75rem 2rem' };

export default function ConsultationQuestionnaire() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({ scentFamily: [], occasion: [], season: [], intensity: '', ingredientCuriosity: [], name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const toggle = (arr: string[], item: string) => arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];
  const update = (field: keyof FormData, value: string | string[]) => setFormData(p => ({ ...p, [field]: value }));
  const canProceed = () => {
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
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ access_key: WEB3FORMS_KEY, subject: `Scent Consultation from ${formData.name}`, from_name: 'Panoply Parfums Consultation', name: formData.name, email: formData.email, message: `SCENT CONSULTATION\n\nName: ${formData.name}\nEmail: ${formData.email}\n\nScent Families: ${formData.scentFamily.join(', ') || 'None'}\nOccasions: ${formData.occasion.join(', ') || 'None'}\nSeasons: ${formData.season.join(', ') || 'None'}\nIntensity: ${formData.intensity || 'Not specified'}\nIngredient Curiosities: ${formData.ingredientCuriosity.join(', ') || 'None'}\n\nAdditional Notes: ${formData.message || 'None'}` }) });
      if (res.ok) setSubmitted(true); else setError('Something went wrong. Email varun@panoplyparfums.com directly.');
    } catch { setError('Network error. Email varun@panoplyparfums.com directly.'); }
    finally { setSubmitting(false); }
  };

  const stepDotStyle = (i: number): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', justifyContent: 'center', width: '2rem', height: '2rem', borderRadius: '9999px',
    border: `1px solid ${i === step ? C.amber : i < step ? fade(C.amber,0.4) : fade(C.amber,0.15)}`,
    backgroundColor: i === step ? fade(C.amber,0.1) : i < step ? fade(C.amber,0.05) : 'transparent',
    color: i === step ? C.amber : i < step ? fade(C.amber,0.6) : fade(C.parchmentDim,0.3),
    fontFamily: F.display, fontSize: '0.75rem', transition: 'all 0.3s',
    cursor: i < step ? 'pointer' : 'default',
  });

  if (submitted) return (
    <div style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
      <span style={{ fontSize: '2.5rem' }}>⚗️</span>
      <h2 style={{ marginTop: '1.5rem', fontFamily: F.display, fontSize: '1.875rem', color: C.parchment }}>Your Raven Has Been Sent</h2>
      <p style={{ marginTop: '1rem', maxWidth: '28rem', marginInline: 'auto', fontSize: '0.875rem', lineHeight: 1.625, color: C.parchmentDim }}>Thank you, {formData.name}. I'll review your preferences and send a personalized recommendation to {formData.email} within 48 hours.</p>
      <p style={{ marginTop: '1.5rem', fontFamily: F.body, fontSize: '0.75rem', fontStyle: 'italic', color: fade(C.parchmentDim,0.5) }}>— Varun, Panoply Parfums</p>
    </div>
  );

  return (
    <div style={{ maxWidth: '42rem', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2.5rem' }}>
        {STEPS.map((st, i) => (
          <button key={i} onClick={() => i < step && setStep(i)} style={stepDotStyle(i)} aria-label={`Step ${i+1}: ${st.title}`}>{i < step ? '✓' : i+1}</button>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <span style={{ fontFamily: F.display, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: fade(C.amber,0.6) }}>Step {step+1} of {STEPS.length}</span>
        <h3 style={{ marginTop: '0.5rem', fontFamily: F.display, fontSize: '1.5rem', color: C.parchment }}>{STEPS[step].title}</h3>
        <p style={{ marginTop: '0.25rem', fontFamily: F.body, fontSize: '0.875rem', fontStyle: 'italic', color: fade(C.parchmentDim,0.6) }}>{STEPS[step].sub}</p>
      </div>

      {step === 0 && <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
        {SCENT_FAMILIES.map(f => <button key={f.id} onClick={() => update('scentFamily', toggle(formData.scentFamily, f.id))} style={cardStyle(formData.scentFamily.includes(f.id))}>
          <span style={{ fontFamily: F.display, fontSize: '0.875rem', color: C.parchment }}>{f.l}</span>
          <span style={{ display: 'block', marginTop: '0.25rem', fontFamily: F.body, fontSize: '0.75rem', color: fade(C.parchmentDim,0.5) }}>{f.d}</span>
        </button>)}
      </div>}

      {step === 1 && <div>
        <h4 style={{ marginBottom: '0.75rem', fontFamily: F.display, fontSize: '0.875rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.parchment }}>Occasion</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {OCCASIONS.map(o => <button key={o.id} onClick={() => update('occasion', toggle(formData.occasion, o.id))} style={pillStyle(formData.occasion.includes(o.id))}>{o.l}</button>)}
        </div>
        <h4 style={{ marginBottom: '0.75rem', fontFamily: F.display, fontSize: '0.875rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.parchment }}>Season</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {SEASONS.map(se => <button key={se.id} onClick={() => update('season', toggle(formData.season, se.id))} style={pillStyle(formData.season.includes(se.id))}>{se.l}</button>)}
        </div>
      </div>}

      {step === 2 && <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
        {INTENSITIES.map(i => <button key={i.id} onClick={() => update('intensity', i.id)} style={cardStyle(formData.intensity === i.id)}>
          <span style={{ fontFamily: F.display, fontSize: '0.875rem', color: C.parchment }}>{i.l}</span>
          <span style={{ display: 'block', marginTop: '0.25rem', fontFamily: F.body, fontSize: '0.75rem', color: fade(C.parchmentDim,0.5) }}>{i.d}</span>
        </button>)}
      </div>}

      {step === 3 && <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
        {INGREDIENT_CURIOSITIES.map(c => <button key={c.id} onClick={() => update('ingredientCuriosity', toggle(formData.ingredientCuriosity, c.id))} style={cardStyle(formData.ingredientCuriosity.includes(c.id))}>
          <span style={{ fontFamily: F.display, fontSize: '0.875rem', color: C.parchment }}>{c.l}</span>
          <span style={{ display: 'block', marginTop: '0.25rem', fontFamily: F.body, fontSize: '0.75rem', color: fade(C.parchmentDim,0.5) }}>{c.d}</span>
        </button>)}
      </div>}

      {step === 4 && <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div><label style={labelS}>Name *</label><input type="text" required value={formData.name} onChange={e => update('name', e.target.value)} placeholder="Your full name" style={inputS} /></div>
        <div><label style={labelS}>Email *</label><input type="email" required value={formData.email} onChange={e => update('email', e.target.value)} placeholder="your@email.com" style={inputS} /></div>
        <div><label style={labelS}>Anything else?</label><textarea value={formData.message} onChange={e => update('message', e.target.value)} rows={3} placeholder="Allergies, preferences, memories..." style={{ ...inputS, resize: 'none' }} /></div>
      </div>}

      {error && <div style={{ marginTop: '1rem', borderRadius: '2px', border: '1px solid rgba(251,44,54,0.2)', backgroundColor: 'rgba(251,44,54,0.05)', padding: '0.75rem 1rem', fontSize: '0.75rem', color: '#fb2c36' }}>{error}</div>}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
          style={{ fontFamily: F.display, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: step === 0 ? 'not-allowed' : 'pointer', color: step === 0 ? fade(C.parchmentDim,0.2) : C.parchmentDim }}>
          ← Back
        </button>
        {step < 4 ? (
          <button onClick={() => setStep(s => Math.min(4, s + 1))} disabled={!canProceed()}
            style={canProceed() ? { ...btnBase, borderColor: fade(C.amber,0.4), backgroundColor: fade(C.amber,0.1), color: C.parchment } : { ...btnBase, borderColor: fade(C.amber,0.1), backgroundColor: 'transparent', color: fade(C.parchmentDim,0.3), cursor: 'not-allowed' }}>
            Next
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={!canProceed() || submitting}
            style={canProceed() && !submitting ? { ...btnBase, borderColor: fade(C.amber,0.4), backgroundColor: fade(C.amber,0.1), color: C.parchment } : { ...btnBase, borderColor: fade(C.amber,0.1), backgroundColor: 'transparent', color: fade(C.parchmentDim,0.3), cursor: 'not-allowed' }}>
            {submitting ? 'Sending...' : 'Send to Varun'}
          </button>
        )}
      </div>
    </div>
  );
}
