import React, { useState } from 'react';
import { Component, Model } from '../types/Component';
import ConfigurationForm from './ConfigurationForm';
import ComponentPanel from './ComponentPanel';
import './ConfigurationPage.css';

interface ConfigurationPageProps {
    components: Component[];
    isLoading: boolean;
    error: string | null;
    onConfigurationSubmit: (formData: { price: number; purposes: string[] }) => void;
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
            [componentName]: [...(prev[componentName] || []), model]
        }));
    };

    const handleModelRemove = (componentName: string, modelToRemove: Model) => {
        setSelectedModels(prev => ({
            ...prev,
            [componentName]: prev[componentName].filter(model => model.name !== modelToRemove.name)
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
            <ConfigurationForm onSubmit={onConfigurationSubmit} />
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