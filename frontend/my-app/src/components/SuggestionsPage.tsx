import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Suggestion } from '../types/Suggestion';
import { Component } from '../types/Component';
import SuggestionResultPage from './SuggestionResultPage';
import './SuggestionsPage.css';

interface SuggestionsPageProps {
    suggestions: Suggestion[];
}

const SuggestionsPage: React.FC<SuggestionsPageProps> = ({ suggestions }) => {
    const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
    const navigate = useNavigate();

    const handleSuggestionClick = (suggestion: Suggestion) => {
        setSelectedSuggestion(suggestion);
    };

    if (selectedSuggestion) {
        // Convert components object to array
        const componentsArray: Component[] = Object.entries(selectedSuggestion.components).map(([type, component]) => ({
            type,
            model: component.name,
            description: component.description,
            price: component.price
        }));

        return (
            <SuggestionResultPage
                components={componentsArray}
                totalPrice={selectedSuggestion.price}
                description={selectedSuggestion.description}
                aiComment={selectedSuggestion.comment}
            />
        );
    }

    return (
        <div className="suggestions-page">
            <h2>Zestawy wariantowe</h2>
            <div className="suggestions-grid">
                {suggestions.map((suggestion, index) => (
                    <div
                        key={index}
                        className="suggestion-card"
                        onClick={() => handleSuggestionClick(suggestion)}
                    >
                        <h3>{suggestion.name}</h3>
                        <p className="suggestion-description">{suggestion.description}</p>
                        <div className="suggestion-price">{suggestion.price} PLN</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SuggestionsPage; 