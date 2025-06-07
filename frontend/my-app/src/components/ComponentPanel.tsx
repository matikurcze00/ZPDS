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
        model.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isModelSelected = (model: Model) => {
        return selectedModels.some(selected => selected.name === model.name);
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
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Wyszukaj po nazwie lub opisie..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="models-list">
                        {filteredModels.map(model => {
                            const selected = isModelSelected(model);
                            return (
                                <div 
                                    key={model.name} 
                                    className={`model-item ${selected ? 'selected' : ''}`}
                                    onClick={() => !selected && onModelSelect(model)}
                                    title={model.description}
                                >
                                    <div className="model-info">
                                        <span className="model-name">{model.name}</span>
                                        <span className="model-description">{model.description}</span>
                                    </div>
                                    <div className="model-right">
                                        <span className="model-price">{model.price} PLN</span>
                                        {selected && <span className="selected-badge">Wybrano</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {selectedModels.length > 0 && (
                        <div className="selected-models">
                            <h4>Wybrane modele:</h4>
                            {selectedModels.map(model => (
                                <div key={model.name} className="selected-model" title={model.description}>
                                    <div className="model-info">
                                        <span>{model.name}</span>
                                        <span className="model-description">{model.description}</span>
                                    </div>
                                    <button 
                                        className="remove-button"
                                        onClick={() => onModelRemove(model)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ComponentPanel; 