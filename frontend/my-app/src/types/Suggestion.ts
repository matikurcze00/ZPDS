import { Component } from './Component';

export interface SuggestionRequest {
    components: Component[];
    price: number;
    purposes: string[];
}

export interface ComponentModel {
    name: string;
    link: string;
    price: number;
    description: string;
}

export interface Component {
    name: string;
    models: ComponentModel[];
}

export interface Suggestion {
    name: string;
    description: string;
    price: number;
    category: 'gaming' | 'office';
    components: Component[];
    comment: string;
} 