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

    if (isLoading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (selectedSet) {
        return <SuggestionResultPage suggestion={selectedSet} onBack={() => setSelectedSet(null)} />;
    }

    const gamingSets = sets.filter(set => set.category === 'gaming');
    const officeSets = sets.filter(set => set.category === 'office');

    const renderSetCard = (set: Suggestion) => {
        const topComponents = set.components.slice(0, 3);
        
        return (
            <div key={set.name} className="set-card" onClick={() => setSelectedSet(set)}>
                <h3>{set.name}</h3>
                <p className="set-price">{set.price} PLN</p>
                <p className="set-description">{set.description}</p>
                <div className="set-components">
                    <h4>Główne komponenty:</h4>
                    <ul>
                        {topComponents.map(component => (
                            <li key={component.name}>
                                {component.name}: {component.models[0].name}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    };

    return (
        <div className="sets-page">
            <section className="sets-category">
                <h2>Zestawy Gamingowe</h2>
                <div className="sets-row">
                    {gamingSets.map(set => renderSetCard(set))}
                </div>
            </section>
            
            <section className="sets-category">
                <h2>Zestawy Biurowe</h2>
                <div className="sets-row">
                    {officeSets.map(set => renderSetCard(set))}
                </div>
            </section>
        </div>
    );
};

export default SetsPage; 