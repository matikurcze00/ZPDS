import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import ConfigurationPage from './components/ConfigurationPage'
import SuggestionResultPage from './components/SuggestionResultPage'
import SetsPage from './components/SetsPage'
import { ComponentService } from './services/ComponentService'
import { SuggestionService } from './services/SuggestionService'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('wlasne')
  const [components, setComponents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [selectedSuggestion, setSelectedSuggestion] = useState(null)
  const [showSuggestion, setShowSuggestion] = useState(false)

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const data = await ComponentService.getComponents()
        setComponents(data)
        setIsLoading(false)
      } catch (err) {
        setError(err.message)
        setIsLoading(false)
      }
    }

    fetchComponents()
  }, [])

  const handleConfigurationSubmit = async (formData) => {
    try {
      setIsLoading(true)
      // Convert selected components array to object with component types as keys
      const selectedComponents = {};
      components.forEach(component => {
        if (formData.selectedModels[component.name]?.length > 0) {
          selectedComponents[component.name] = formData.selectedModels[component.name][0].id;
        }
      });

      const suggestionsData = await SuggestionService.getSuggestions({
        components: selectedComponents,
        price: formData.price,
        purposes: formData.purposes
      })
      setSuggestions(suggestionsData)
      setShowSuggestion(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionSelect = (suggestion) => {
    setSelectedSuggestion(suggestion);
  };

  const handleBack = () => {
    setSelectedSuggestion(null);
  }

  const handleBackToForm = () => {
    setSelectedSuggestion(null);
    setShowSuggestion(false);
  }

  return (
    <div className="app">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="content">
        {activeTab === 'zestawy' ? (
          <SetsPage />
        ) : showSuggestion ? (
          selectedSuggestion ? (
            <SuggestionResultPage 
              components={Object.entries(selectedSuggestion.components).map(([type, component]) => ({
                type,
                model: component.name,
                description: component.description,
                price: component.price
              }))}
              totalPrice={selectedSuggestion.price}
              description={selectedSuggestion.description}
              aiComment={selectedSuggestion.comment}
              onBack={handleBack}
            />
          ) : (
            <div className="suggestions-list">
              <div className="suggestions-header">
                <button className="back-button" onClick={handleBackToForm}>
                  ← Wróć do formularza
                </button>
                <h2>Sugerowane konfiguracje</h2>
              </div>
              <div className="suggestions-grid">
                {suggestions.map((suggestion, index) => (
                  <div 
                    key={index} 
                    className="suggestion-card"
                    onClick={() => handleSuggestionSelect(suggestion)}
                  >
                    <h3>{suggestion.name}</h3>
                    <p className="suggestion-description">{suggestion.description}</p>
                    <div className="suggestion-price">{suggestion.price} PLN</div>
                    <button className="view-details-button">
                      Zobacz szczegóły →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        ) : (
          <ConfigurationPage 
            components={components}
            isLoading={isLoading}
            error={error}
            onConfigurationSubmit={handleConfigurationSubmit}
          />
        )}
      </main>
    </div>
  )
}

export default App
