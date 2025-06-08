import { Component as ComponentType, Model } from './Component';

export interface SuggestionRequest {
    components: { [key: string]: number }; // component type -> model id
    price: number;
    purposes: string[];
}

export interface SuggestionComponent {
    id: number;
    name: string;
    price: number;
    description: string;
    link: string;
}

export interface Suggestion {
    name: string;
    description: string;
    price: number;
    category: 'gaming' | 'office';
    components: { [key: string]: SuggestionComponent };
    comment: string;
} 