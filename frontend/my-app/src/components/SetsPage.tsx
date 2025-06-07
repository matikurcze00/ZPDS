import React, { useState, useEffect } from 'react';
import { Suggestion } from '../types/Suggestion';
import { SetsService } from '../services/SetsService';
import SuggestionResultPage from './SuggestionResultPage';
import './SetsPage.css';

const SetsPage: React.FC = () => {
    const [sets, setSets] = useState<Suggestion[]>([]);
    const [selectedSet, setSelectedSet] = useState<Suggestion | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSets = async () => {
            try {
                const data = await SetsService.getSets();
                setSets(data);
                setIsLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                setIsLoading(false);
            }
        };

        fetchSets();
    }, []);

    const handleBack = () => {
        setSelectedSet(null);
    };

    if (isLoading) {
        return <div className="sets-loading">Ładowanie zestawów...</div>;
    }

    if (error) {
        return <div className="sets-error">Błąd: {error}</div>;
    }

    if (selectedSet) {
        return <SuggestionResultPage suggestion={selectedSet} onBack={handleBack} />;
    }

    return (
        <div className="sets-page">
            <h2>Gotowe zestawy komputerowe</h2>
            <div className="sets-grid">
                {sets.map((set, index) => (
                    <div 
                        key={index} 
                        className="set-card"
                        onClick={() => setSelectedSet(set)}
                    >
                        <div className="set-header">
                            <h3>{set.name}</h3>
                            <span className="set-price">{set.price} PLN</span>
                        </div>
                        <p className="set-description">{set.description}</p>
                        <div className="set-components">
                            <h4>Główne komponenty:</h4>
                            <ul>
                                {set.components.slice(0, 3).map((component, idx) => (
                                    <li key={idx}>
                                        <span className="component-name">{component.name}:</span>
                                        <span className="component-model">{component.models[0].name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <button className="view-details">
                            Zobacz szczegóły →
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SetsPage; 