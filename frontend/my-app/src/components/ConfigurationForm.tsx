import React, { useState } from 'react';
import './ConfigurationForm.css';

type Purposes = {
  [key: string]: boolean;
};

interface ConfigurationFormProps {
  onSubmit: (formData: {
    price: number;
    purposes: string[];
    selectedModels: { [key: string]: any[] };
  }) => void;
  selectedModels: { [key: string]: any[] };
}

const ConfigurationForm: React.FC<ConfigurationFormProps> = ({ onSubmit, selectedModels }) => {
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
      purposes: selectedPurposes,
      selectedModels: selectedModels
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
              min="2000"
              max="15000"
              step="100"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="price-slider"
            />
            <div className="price-labels">
              <span>2000</span>
              <span className="current-price">{priceRange}</span>
              <span>15000</span>
            </div>
          </div>
        </div>

        <div className="form-section purposes-section">
          <h3>Przeznaczenie komputera</h3>
          <div className="purposes-grid">
            {Object.entries(purposes).map(([purpose, isSelected]) => (
              <label key={purpose} className="purpose-checkbox">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handlePurposeChange(purpose)}
                />
                {purpose}
              </label>
            ))}
          </div>
        </div>

        <div className="form-section button-section">
          <button 
            className="match-button"
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