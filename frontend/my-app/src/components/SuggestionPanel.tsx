import React from 'react';
import { Suggestion } from '../types/Suggestion';
import './SuggestionPanel.css';

interface SuggestionPanelProps {
    suggestion: Suggestion | null;
    isLoading: boolean;
    error: string | null;
}

const SuggestionPanel: React.FC<SuggestionPanelProps> = ({
    suggestion,
    isLoading,
    error
}) => {
    if (isLoading) {
        return (
            <div className="suggestion-panel loading">
                <div className="loading-spinner">Generowanie sugestii...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="suggestion-panel error">
                <div className="error-message">Błąd: {error}</div>
            </div>
        );
    }

    if (!suggestion) {
        return null;
    }

    return (
        <div className="suggestion-panel">
            <h3>Sugerowana konfiguracja</h3>
            <div className="suggestion-content">
                <div className="suggestion-header">
                    <div className="suggestion-price">
                        Szacowana cena: <span>{suggestion.price} PLN</span>
                    </div>
                </div>
                
                <div className="suggestion-comment">
                    {suggestion.comment.split('\n').map((line, index) => (
                        <p key={index}>{line}</p>
                    ))}
                </div>

                <div className="suggested-components">
                    <h4>Sugerowane podzespoły:</h4>
                    {suggestion.components.map(component => (
                        <div key={component.name} className="suggested-component">
                            <div className="component-header">
                                <h5>{component.name}</h5>
                            </div>
                            <div className="component-models">
                                {component.models.map(model => (
                                    <div key={model.name} className="suggested-model">
                                        <div className="model-info">
                                            <span className="model-name">{model.name}</span>
                                            <span className="model-description">{model.description}</span>
                                        </div>
                                        <span className="model-price">{model.price} PLN</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SuggestionPanel; 