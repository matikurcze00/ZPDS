import { Component } from '../types/Component';

const API_BASE_URL = 'http://localhost:8000';

export const ComponentService = {
    getComponents: async (): Promise<Component[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/getComponents`);
            if (!response.ok) {
                throw new Error('Failed to fetch components');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching components:', error);
            throw error;
        }
    }
}; 