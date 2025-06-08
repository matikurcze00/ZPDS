import React, { useState } from 'react';
import { Component, Model } from '../types/Component';
import './ComponentPanel.css';

interface ComponentPanelProps {
    component: Component;
    selectedModels: Model[];
    onModelSelect: (model: Model) => void;
    onModelRemove: (model: Model) => void;
}

const ComponentPanel: React.FC<ComponentPanelProps> = ({
    component,
    selectedModels,
    onModelSelect,
    onModelRemove
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredModels = component.models.filter(model =>
        model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (model.description && model.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const isModelSelected = (model: Model) => {
        return selectedModels.some(selected => selected.id === model.id);
    };

    return (
        <div className="component-panel">
            <button
                className={`panel-header ${isExpanded ? 'expanded' : ''}`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <span className="component-name">{component.name}</span>
                <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
            </button>

            {isExpanded && (
                <div className="panel-content">
                    {/* Selected Models Section */}
                    {selectedModels.length > 0 && (
                        <div className="selected-models-section">
                            <h4>Wybrane komponenty:</h4>
                            {selectedModels.map(model => (
                                <div key={model.id} className="selected-model">
                                    <div className="model-info">
                                        <div className="model-name">{model.name}</div>
                                        <div className="model-price">{model.price} PLN</div>
                                        {model.description && (
                                            <div className="model-description">{model.description}</div>
                                        )}
                                    </div>
                                    <button
                                        className="remove-button"
                                        onClick={() => onModelRemove(model)}
                                    >
                                        Usuń
                                    </button>
                                </div>
                            ))}
                            <div className="section-divider"></div>
                        </div>
                    )}

                    {/* Search Bar */}
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Szukaj komponentów..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Available Models Section */}
                    <div className="available-models-section">
                        <h4>Dostępne komponenty:</h4>
                        <div className="models-list">
                            {filteredModels.map(model => (
                                <div
                                    key={model.id}
                                    className={`model-item ${isModelSelected(model) ? 'selected' : ''}`}
                                    onClick={() => !isModelSelected(model) && onModelSelect(model)}
                                >
                                    <div className="model-info">
                                        <div className="model-name">{model.name}</div>
                                        {model.description && (
                                            <div className="model-description">{model.description}</div>
                                        )}
                                    </div>
                                    <div className="model-right">
                                        <div className="model-price">{model.price} PLN</div>
                                        {isModelSelected(model) && (
                                            <div className="selected-badge">Wybrano</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComponentPanel; 