import { Component } from '../types/Component';

// Mocked data that will be replaced with real API calls later
const mockedComponents: Component[] = [
    {
        name: "Processor",
        models: [
            {
                name: "Intel i5-12400F",
                link: "https://example.com/i5-12400f",
                price: 699,
                description: "6 rdzeni, 12 wątków, 2.5 GHz bazowego zegara, 4.4 GHz w trybie boost. Świetny procesor do gier w średnim budżecie."
            },
            {
                name: "AMD Ryzen 5 5600X",
                link: "https://example.com/ryzen-5600x",
                price: 799,
                description: "6 rdzeni, 12 wątków, 3.7 GHz bazowego zegara, 4.6 GHz w trybie boost. Doskonały stosunek ceny do wydajności."
            },
            {
                name: "Intel i7-12700K",
                link: "https://example.com/i7-12700k",
                price: 1699,
                description: "12 rdzeni (8P + 4E), 20 wątków, do 5.0 GHz w trybie boost. Wydajny procesor do gier i zadań wielowątkowych."
            },
            {
                name: "AMD Ryzen 7 5800X",
                link: "https://example.com/ryzen-5800x",
                price: 1499,
                description: "8 rdzeni, 16 wątków, 3.8 GHz bazowego zegara, 4.7 GHz w trybie boost. Świetny wybór do gier i streamowania."
            },
            {
                name: "Intel i9-12900K",
                link: "https://example.com/i9-12900k",
                price: 2499,
                description: "16 rdzeni (8P + 8E), 24 wątki, do 5.2 GHz w trybie boost. Flagowy procesor do najbardziej wymagających zastosowań."
            },
            {
                name: "Intel i5-12400E",
                link: "https://example.com/i5-12400f",
                price: 899,
                description: "6 rdzeni, 14 wątków, 2.5 GHz bazowego zegara, 4.4 GHz w trybie boost. Świetny procesor do gier w średnim budżecie."
            },
            {
                name: "AMD Ryzen 5 6100X",
                link: "https://example.com/ryzen-5600x",
                price: 999,
                description: "8 rdzeni, 14 wątków, 3.7 GHz bazowego zegara, 4.6 GHz w trybie boost. Doskonały stosunek ceny do wydajności."
            },
            {
                name: "Intel i9-12700K",
                link: "https://example.com/i7-12700k",
                price: 1999,
                description: "12 rdzeni (8P + 4E), 20 wątków, do 5.0 GHz w trybie boost. Wydajny procesor do gier i zadań wielowątkowych."
            },
            {
                name: "AMD Ryzen 9 5800X",
                link: "https://example.com/ryzen-5800x",
                price: 2099,
                description: "8 rdzeni, 16 wątków, 3.8 GHz bazowego zegara, 4.7 GHz w trybie boost. Świetny wybór do gier i streamowania."
            },
            {
                name: "Intel i9-13100K",
                link: "https://example.com/i9-12900k",
                price: 26499,
                description: "16 rdzeni (8P + 8E), 36 wątki, do 5.2 GHz w trybie boost. Flagowy procesor do najbardziej wymagających zastosowań."
            },
            {
                name: "AMD Ryzen 9 6900X",
                link: "https://example.com/ryzen-96900x",
                price: 2999,
                description: "12 rdzeni, 24 wątki, 3.2 GHz bazowego zegara, 4.2 GHz w trybie boost. Doskonały procesor do gier i zadań wielowątkowych."
            },
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
            },
            {
                name: "AMD RX 6600",
                link: "https://example.com/rx6600",
                price: 1299,
                description: "8GB GDDR6, FSR 2.0, rdzeń 2491 MHz. Wydajna karta graficzna do gier w rozdzielczości 1080p z wsparciem dla AMD FSR 2.0."
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
            },
            {
                name: "ASUS TUF GAMING B550-PLUS",
                link: "https://example.com/asus-b550",
                price: 599,
                description: "Socket AM4, DDR4 do 4400MHz, PCIe 4.0, ATX. Solidna płyta z wysokiej jakości komponentami, obsługa AMD Ryzen 5000, 4 sloty RAM, 2 sloty M.2."
            }
        ]
    },
    {
        name: "RAM",
        models: [
            {
                name: "Corsair Vengeance LPX 16GB (2x8GB) DDR4 3200",
                link: "https://example.com/corsair-16gb",
                price: 299,
                description: "DDR4 3200MHz CL16, niski profil, aluminiowy radiator. Niezawodna pamięć do codziennego użytku i gier, kompatybilna z większością płyt głównych."
            },
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
                name: "be quiet! Pure Power 11 600W 80+ Gold",
                link: "https://example.com/bequiet-600w",
                price: 399,
                description: "600W, modularne okablowanie, certyfikat 80+ Gold, aktywne PFC. Cichy i wydajny zasilacz z wysoką sprawnością energetyczną i zabezpieczeniami OCP, OVP, UVP."
            },
            {
                name: "Corsair RM750x 750W 80+ Gold",
                link: "https://example.com/corsair-750w",
                price: 549,
                description: "750W, w pełni modularne okablowanie, certyfikat 80+ Gold, japońskie kondensatory. Wysokiej jakości zasilacz do wydajnych systemów z 10-letnią gwarancją."
            }
        ]
    }
];

export const ComponentService = {
    getComponents: async (): Promise<Component[]> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockedComponents; //TODO: Change to real API call
    }
}; 