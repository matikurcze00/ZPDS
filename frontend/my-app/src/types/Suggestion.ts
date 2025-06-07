import { Component } from './Component';

export interface SuggestionRequest {
    components: Component[];
    price: number;
    purposes: string[];
}

export interface Suggestion {
    name?: string;
    description?: string;
    components: Component[];
    comment: string;
    price: number;
} 