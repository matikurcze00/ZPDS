import React from 'react';
import { Component } from '../types/Component';
import './SuggestionResultPage.css';

interface SuggestionResultPageProps {
    components: Component[];
    totalPrice: number;
    description: string;
    aiComment: string;
    onBack: () => void;
}

const SuggestionResultPage: React.FC<SuggestionResultPageProps> = ({
    components,
    totalPrice,
    description,
    aiComment,
    onBack
}) => {
    return (
        <div className="suggestion-result-page">
            <div className="suggestion-header">
                <button className="back-button" onClick={onBack}>
                    ← Wstecz
                </button>
                <h2>Konfiguracja Zbalansowana</h2>
            </div>

            <div className="suggestion-content">
                <div className="suggestion-info">
                    <div className="price-section">
                        <h3>Całkowita cena:</h3>
                        <span className="total-price">{totalPrice} PLN</span>
                    </div>
                    <div className="description-section">
                        <h3>Opis:</h3>
                        <p className="description">{description}</p>
                    </div>
                    <div className="comment-section">
                        <h3>Komentarz AI:</h3>
                        <p className="comment">{aiComment}</p>
                    </div>
                </div>

                <div className="components-section">
                    <h3>Komponenty:</h3>
                    <div className="components-grid">
                        {components.map((component, index) => (
                            <div key={index} className="component-card">
                                <div className="component-header">
                                    <h4>{component.type}</h4>
                                </div>
                                <div className="component-details">
                                    <h5>{component.model}</h5>
                                    <p className="component-description">{component.description}</p>
                                    <div className="component-footer">
                                        <span className="component-price">{component.price} PLN</span>
                                        <a href="#" className="component-link">Zobacz szczegóły →</a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuggestionResultPage; 