import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import ConfigurationPage from './components/ConfigurationPage'
import SuggestionResultPage from './components/SuggestionResultPage'
import SetsPage from './components/SetsPage'
import { ComponentService } from './services/ComponentService'
import { SuggestionService } from './services/SuggestionService'

function App() {
  const [activeTab, setActiveTab] = useState('wlasne')
  const [components, setComponents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [suggestion, setSuggestion] = useState(null)
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
      const suggestionData = await SuggestionService.getSuggestions({
        components: components,
        price: formData.price,
        purposes: formData.purposes
      })
      setSuggestion(suggestionData)
      setShowSuggestion(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    setShowSuggestion(false)
    setSuggestion(null)
  }

  return (
    <div className="app">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="content">
        {activeTab === 'zestawy' ? (
          <SetsPage />
        ) : showSuggestion && suggestion ? (
          <SuggestionResultPage 
            suggestion={suggestion}
            onBack={handleBack}
          />
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
