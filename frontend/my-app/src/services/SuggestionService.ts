import { Component } from '../types/Component';
import { Suggestion, SuggestionRequest } from '../types/Suggestion';

// Fixed suggestion response
const suggestedComponents: Component[] = [
    {
        name: "Processor",
        models: [
            {
                name: "Intel i7-12700K",
                link: "https://example.com/i7-12700k",
                price: 1699,
                description: "12 rdzeni (8P + 4E), 20 wątków, do 5.0 GHz w trybie boost. Wydajny procesor do gier i zadań wielowątkowych."
            }
        ]
    },
    {
        name: "Graphics Card",
        models: [
            {
                name: "NVIDIA RTX 3060",
                link: "https://example.com/rtx3060",
                price: 1499,
                description: "12GB GDDR6, ray tracing, DLSS 2.0, rdzeń 1777 MHz. Świetna karta do gier w 1080p i 1440p z obsługą ray tracingu i DLSS dla lepszej wydajności."
            }
        ]
    },
    {
        name: "Motherboard",
        models: [
            {
                name: "MSI PRO B660M-A DDR4",
                link: "https://example.com/msi-b660m",
                price: 499,
                description: "Socket LGA1700, DDR4 do 4800MHz, PCIe 4.0, mATX. Płyta główna z obsługą procesorów Intel 12-tej generacji, 4 sloty RAM, 2 sloty M.2."
            }
        ]
    },
    {
        name: "RAM",
        models: [
            {
                name: "G.SKILL Ripjaws V 32GB (2x16GB) DDR4 3600",
                link: "https://example.com/gskill-32gb",
                price: 549,
                description: "DDR4 3600MHz CL16, efektywne chłodzenie, XMP 2.0. Szybka pamięć do wymagających zastosowań, idealna do multitaskingu i zaawansowanych aplikacji."
            }
        ]
    },
    {
        name: "Power Supply",
        models: [
            {
                name: "Corsair RM750x 750W 80+ Gold",
                link: "https://example.com/corsair-750w",
                price: 549,
                description: "750W, w pełni modularne okablowanie, certyfikat 80+ Gold, japońskie kondensatory. Wysokiej jakości zasilacz do wydajnych systemów z 10-letnią gwarancją."
            }
        ]
    }
];

export const SuggestionService = {
    getSuggestions: async (request: SuggestionRequest): Promise<Suggestion> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Calculate total price
        const totalPrice = suggestedComponents.reduce((sum, component) => {
            return sum + component.models[0].price;
        }, 0);

        return {
            components: suggestedComponents,
            price: totalPrice,
            comment: "Ta konfiguracja została dobrana pod kątem optymalnej wydajności w grach i zadaniach wielowątkowych. Procesor Intel i7-12700K w połączeniu z kartą RTX 3060 zapewni płynną rozgrywkę w najnowszych tytułach. 32GB szybkiej pamięci RAM pozwoli na komfortową pracę z wieloma aplikacjami jednocześnie."
        }; //TODO: Change to real API call
    }
}; 