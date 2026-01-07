import { useState } from 'react';
import { pass } from 'three/tsl';
import { z } from 'zod';

const BrugerSchema = z.object({
  brugernavn: z.string().min(2, "Navn skal være mindst 2 tegn"),
  email: z.string().email("Indtast en gyldig e-mail"),
  password: z.string().min(8, "Adgangskode skal være mindst 8 tegn").optional(),

});

function App() {
  const [formData, setFormData] = useState({ brugernavn: '', email: '' });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const resultat = BrugerSchema.safeParse(formData);

    if (!resultat.success) {
      
      const formateredeFejl = resultat.error.format();
      setErrors(formateredeFejl);
      console.log("Validering fejlede:", formateredeFejl);
    } else {
      setErrors({});
      alert("Succes! Data er sendt.");
      console.log("Valid data:", resultat.data);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Zod + React Demo</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
        <input 
          placeholder="Brugernavn"
          onChange={(e) => setFormData({...formData, brugernavn: e.target.value})}
        />
        {/* Vis fejlbesked hvis den findes */}
        {errors.brugernavn && <span style={{color: 'red'}}>{errors.brugernavn._errors[0]}</span>}

        <input 
          placeholder="E-mail"
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        {errors.email && <span style={{color: 'red'}}>{errors.email._errors[0]}</span>}

        <button type="submit">Send formular</button>
      </form>
    </div>
  );
}

export default App;