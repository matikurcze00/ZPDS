import React, { useState } from 'react';
import { Component, Model } from '../types/Component';
import ConfigurationForm from './ConfigurationForm';
import ComponentPanel from './ComponentPanel';
import './ConfigurationPage.css';

interface ConfigurationPageProps {
    components: Component[];
    isLoading: boolean;
    error: string | null;
    onConfigurationSubmit: (formData: { 
        price: number; 
        purposes: string[];
        selectedModels: { [key: string]: Model[] };
    }) => void;
}

interface SelectedModels {
    [componentName: string]: Model[];
}

const ConfigurationPage: React.FC<ConfigurationPageProps> = ({ 
    components, 
    isLoading, 
    error,
    onConfigurationSubmit 
}) => {
    const [selectedModels, setSelectedModels] = useState<SelectedModels>({});

    const handleModelSelect = (componentName: string, model: Model) => {
        setSelectedModels(prev => ({
            ...prev,
            [componentName]: [model] // Only allow one model per component
        }));
    };

    const handleModelRemove = (componentName: string, modelToRemove: Model) => {
        setSelectedModels(prev => ({
            ...prev,
            [componentName]: []
        }));
    };

    if (isLoading) {
        return <div className="loading">Loading components...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="configuration-page">
            <ConfigurationForm 
                onSubmit={onConfigurationSubmit}
                selectedModels={selectedModels}
            />
            <div className="components-section">
                <h3>Select Components</h3>
                {components.map(component => (
                    <ComponentPanel
                        key={component.name}
                        component={component}
                        selectedModels={selectedModels[component.name] || []}
                        onModelSelect={(model) => handleModelSelect(component.name, model)}
                        onModelRemove={(model) => handleModelRemove(component.name, model)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ConfigurationPage; 