import { useState } from 'react';
import { z } from 'zod';

// --- ZOD SCHEMA ---
const BrugerSchema = z.object({
  fornavn: z.string().min(1, "Fornavn er påkrævet"),
  efternavn: z.string().min(1, "Efternavn er påkrævet"),
  brugernavn: z.string()
    .regex(/^[a-zA-Z0-9_]+$/, "Kun bogstaver, tal og underscore")
    .min(3, "Mindst 3 tegn"),
  email: z.string().email("Indtast en gyldig e-mail"),
  password: z.string()
    .min(8, "Mindst 8 tegn")
    .regex(/[A-Z]/, "Skal indeholde mindst ét stort bogstav")
    .regex(/[a-z]/, "Skal indeholde mindst ét lille bogstav")
    .regex(/[0-9]/, "Skal indeholde mindst ét tal")
    .regex(/[!@#$%^&*]/, "Skal indeholde mindst ét specialtegn (!@#$%^&*)"),
  gentagPassword: z.string(),
  fodselsdato: z.string().refine((dato) => {
    const idag = new Date();
    const fodselsdag = new Date(dato);
    let alder = idag.getFullYear() - fodselsdag.getFullYear();
    const m = idag.getMonth() - fodselsdag.getMonth();
    if (m < 0 || (m === 0 && idag.getDate() < fodselsdag.getDate())) {
      alder--;
    }
    return alder >= 18;
  }, "Du skal være mindst 18 år gammel"),
  telefon: z.string().regex(/^[0-9]{8}$/, "Skal være 8 cifre").optional().or(z.literal('')),
  postnummer: z.string().regex(/^[0-9]{4}$/, "Skal være præcis 4 cifre")
})
.refine((data) => data.password === data.gentagPassword, {
  message: "Passwords er ikke ens",
  path: ["gentagPassword"], 
});

// --- COMPONENT ---
function App() {
  const [formData, setFormData] = useState({
    fornavn: '', efternavn: '', brugernavn: '', email: '',
    password: '', gentagPassword: '', fodselsdato: '', telefon: '', postnummer: ''
  });
  
  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState(null);

  // Live validering funktion
  const validate = (data) => {
    const resultat = BrugerSchema.safeParse(data);
    if (!resultat.success) {
      setErrors(resultat.error.format());
      return false;
    } else {
      setErrors({});
      return resultat.data;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    validate(newData); // Opdaterer fejl "live"
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validData = validate(formData);
    
    if (validData) {
      setSubmittedData(validData);
    }
  };

  if (submittedData) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Tak for din registrering!</h2>
        <p>Her er dine data:</p>
        <ul>
          <li>Navn: {submittedData.fornavn} {submittedData.efternavn}</li>
          <li>Email: {submittedData.email}</li>
          <li>Brugernavn: {submittedData.brugernavn}</li>
          <li>Fødselsdato: {submittedData.fodselsdato}</li>
        </ul>
        <button onClick={() => setSubmittedData(null)}>Tilmeld en anden</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '400px' }}>
      <h1>Zod demo - Profil Oprettelse</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <Field label="Fornavn" name="fornavn" type="text" value={formData.fornavn} onChange={handleChange} error={errors.fornavn} />
        <Field label="Efternavn" name="efternavn" type="text" value={formData.efternavn} onChange={handleChange} error={errors.efternavn} />
        <Field label="Brugernavn" name="brugernavn" type="text" value={formData.brugernavn} onChange={handleChange} error={errors.brugernavn} />
        <Field label="E-mail" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} />
        <Field label="Fødselsdato" name="fodselsdato" type="date" value={formData.fodselsdato} onChange={handleChange} error={errors.fodselsdato} />
        <Field label="Postnummer" name="postnummer" type="text" value={formData.postnummer} onChange={handleChange} error={errors.postnummer} />
        <Field label="Telefon (valgfri)" name="telefon" type="tel" value={formData.telefon} onChange={handleChange} error={errors.telefon} />
        <Field label="Password" name="password" type="password" value={formData.password} onChange={handleChange} error={errors.password} />
        <Field label="Gentag Password" name="gentagPassword" type="password" value={formData.gentagPassword} onChange={handleChange} error={errors.gentagPassword} />

        <button type="submit" style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
          Registrer
        </button>
      </form>
    </div>
  );
}

// Hjælpe-komponent til inputfelter for at holde koden ren
const Field = ({ label, name, type, value, onChange, error }) => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <label style={{ fontWeight: 'bold', fontSize: '14px' }}>{label}</label>
    <input name={name} type={type} value={value} onChange={onChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
    {error && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{error._errors[0]}</span>}
  </div>
);

export default App;