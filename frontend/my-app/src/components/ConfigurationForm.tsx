import React, { useState } from 'react';
import './ConfigurationForm.css';

interface ConfigurationFormProps {
  onSubmit: (formData: { price: number; purposes: string[] }) => void;
}

type Purposes = {
  'Gry': boolean;
  'Praca biurowa': boolean;
  'Tworzenie treści / edycja wideo': boolean;
  'Programowanie': boolean;
  'Przeglądanie internetu / multimedia': boolean;
}

const ConfigurationForm: React.FC<ConfigurationFormProps> = ({ onSubmit }) => {
  const [priceRange, setPriceRange] = useState(4500);
  const [purposes, setPurposes] = useState<Purposes>({
    'Gry': false,
    'Praca biurowa': false,
    'Tworzenie treści / edycja wideo': false,
    'Programowanie': false,
    'Przeglądanie internetu / multimedia': false
  });

  const handlePurposeChange = (purpose: keyof Purposes) => {
    setPurposes(prev => ({
      ...prev,
      [purpose]: !prev[purpose]
    }));
  };

  const handleSubmit = () => {
    const selectedPurposes = Object.entries(purposes)
      .filter(([_, isSelected]) => isSelected)
      .map(([purpose]) => purpose);

    onSubmit({
      price: priceRange,
      purposes: selectedPurposes
    });
  };

  return (
    <div className="configuration-form">
      <h2>Zacznij od określenia swoich potrzeb</h2>
      <p className="subtitle">Ustaw kilka prostych filtrów, abyśmy mogli lepiej dopasować zestawy komputerowe do Twoich oczekiwań</p>
      
      <div className="form-content">
        <div className="form-section price-section">
          <h3>Zakres cenowy</h3>
          <div className="price-slider-container">
            <input
              type="range"
              min="1000"
              max="10000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="price-slider"
            />
            <div className="price-labels">
              <span>1000</span>
              <span className="current-price">{priceRange}</span>
              <span>10000</span>
            </div>
          </div>
        </div>

        <div className="form-section purposes-section">
          <h3>Przeznaczenie komputera</h3>
          <div className="purposes-grid">
            {(Object.keys(purposes) as Array<keyof Purposes>).map(purpose => (
              <label key={purpose} className="purpose-checkbox">
                <input
                  type="checkbox"
                  checked={purposes[purpose]}
                  onChange={() => handlePurposeChange(purpose)}
                />
                {purpose}
              </label>
            ))}
          </div>
        </div>

        <div className="form-section button-section">
          <button 
            className="submit-button"
            onClick={handleSubmit}
          >
            Dopasuj
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationForm; 