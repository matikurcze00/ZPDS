import React from 'react';
import { Suggestion } from '../types/Suggestion';
import './SuggestionResultPage.css';

interface SuggestionResultPageProps {
    suggestion: Suggestion;
    onBack: () => void;
}

const SuggestionResultPage: React.FC<SuggestionResultPageProps> = ({
    suggestion,
    onBack
}) => {
    return (
        <div className="suggestion-result-page">
            <div className="suggestion-header">
                <button className="back-button" onClick={onBack}>
                    ← Wstecz
                </button>
                <h2>Sugerowana konfiguracja</h2>
            </div>

            <div className="suggestion-content">
                <div className="price-section">
                    <h3>Całkowita cena:</h3>
                    <div className="total-price">{suggestion.price} PLN</div>
                </div>

                <div className="comment-section">
                    <h3>Komentarz AI:</h3>
                    <div className="comment">{suggestion.comment}</div>
                </div>

                <div className="components-section">
                    <h3>Sugerowane komponenty:</h3>
                    {suggestion.components.map(component => (
                        <div key={component.name} className="component-card">
                            <div className="component-header">
                                <h4>{component.name}</h4>
                            </div>
                            {component.models.map(model => (
                                <div key={model.name} className="model-details">
                                    <div className="model-main-info">
                                        <h5>{model.name}</h5>
                                        <span className="model-price">{model.price} PLN</span>
                                    </div>
                                    <div className="model-info">
                                        <p className="model-description">{model.description}</p>
                                    </div>
                                    <a href={model.link} target="_blank" rel="noopener noreferrer" className="model-link">
                                        Zobacz szczegóły →
                                    </a>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SuggestionResultPage; 