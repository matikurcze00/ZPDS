import { Component } from '../types/Component';
import { Suggestion, SuggestionRequest } from '../types/Suggestion';

const API_BASE_URL = 'http://localhost:8000';

export const SuggestionService = {
    getSuggestions: async (request: SuggestionRequest): Promise<Suggestion> => {
        try {
            const response = await fetch(`${API_BASE_URL}/getSuggestions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    components: request.components,
                    price: request.price,
                    purposes: request.purposes
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch suggestions');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            throw error;
        }
    }
}; 