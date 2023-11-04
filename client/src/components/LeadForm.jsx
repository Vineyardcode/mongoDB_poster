import React, { useState } from 'react';

const LeadForm = () => {
  const [formData, setFormData] = useState({
    estateType: '',
    fullname: '',
    phone: '',
    email: '',
    region: '',
    district: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/lead ', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.status === 201) {
        alert('Data byla uložena.');
      } else {
        alert('Chyba při ukládání dat.');
      }
    } catch (error) {
      console.error('Chyba:', error);
    }
  };

  return (
    <div>
      <h2>Formulář</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Typ nemovitosti:
          <input
            type="text"
            name="estateType"
            value={formData.estateType}
            onChange={handleChange}
          />
        </label>
        <label>
          Celé jméno:
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
          />
        </label>
        <label>
          Telefon:
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </label>
        <label>
          Email:
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        <label>
          Kraj:
          <input
            type="text"
            name="region"
            value={formData.region}
            onChange={handleChange}
          />
        </label>
        <label>
          Okres:
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Odeslat</button>
      </form>
    </div>
  );
};

export default LeadForm;

