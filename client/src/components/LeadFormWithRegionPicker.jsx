import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import regionsGeoJSON from '../assets/kraje.json'; 
import districtsGeoJSON from '../assets/okresy.json'; 

const LeadFormWithRegionPicker = () => {
  const [formData, setFormData] = useState({
    estateType: '',
    fullname: '',
    phone: '',
    email: '',
    region: null,
    district: null, 
  });

  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const handleRegionSelect = (clickedRegion, clickedDistrict) => {
    if (clickedDistrict) {
      setSelectedDistrict(clickedDistrict);
      setSelectedRegion(clickedRegion);
    } else {
      setSelectedRegion(clickedRegion);
      setSelectedDistrict(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const clearRegionSelection = () => {
    setSelectedDistrict(null);
    setSelectedRegion(null);
    setFormData({
      ...formData,
      region: null,
      district: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const phonePattern = /^(\+420)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/;
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!phonePattern.test(formData.phone) || !emailPattern.test(formData.email)) {
      setSubmissionStatus('Prosím, zadejte správný formát');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.status === 201) {
        setSubmissionStatus('Data byla uložena.');
      } else {
        setSubmissionStatus('Chyba při ukládání dat.');
      }
    } catch (error) {
      console.error('Chyba:', error);
    }
  };
  
  console.log(districtsGeoJSON);
  console.log(regionsGeoJSON);
  useEffect(() => {
    setFormData({
      ...formData,
      region: selectedRegion,
      district: selectedDistrict,
    });
  }, [selectedRegion, selectedDistrict]);

  return (
    <div>
      <h2>Formulář</h2>
      {submissionStatus && <p>{submissionStatus}</p>}
      <form onSubmit={handleSubmit}>
        <div className="labels">
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
        </div>
        <div>
          <MapContainer center={[49.76, 15.58]} zoom={7} style={{ width: '100%', height: '500px', margin: '0.5rem' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <GeoJSON
              data={regionsGeoJSON}
              onEachFeature={(feature, layer) => {
                layer.on({
                  click: (e) => {
                    handleRegionSelect(e.target.feature.name);
                  },
                });
              }}
            />
            {selectedRegion && (
              <GeoJSON
                data={districtsGeoJSON}
                
                onEachFeature={(feature, layer) => {
                  layer.on({
                    click: (e) => {
                      handleRegionSelect(selectedRegion, e.target.feature.name);
                    },
                  });
                }}
                
              />
            )}
          </MapContainer>
        </div>
        <p>Kraj: {selectedRegion}</p>
        <p>Okres: {selectedDistrict}</p>
        {selectedRegion && (
            <button type="button" onClick={clearRegionSelection}>
              Vymazat výběr
            </button>
            )}
        <button type="submit">Odeslat</button>
      </form>
    </div>
  );
};

export default LeadFormWithRegionPicker;
