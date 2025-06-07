import { Suggestion } from '../types/Suggestion';

const preMadeSets: Suggestion[] = [
    // Gaming Setups
    {
        name: "Zestaw Gamingowy - Basic",
        description: "Podstawowy zestaw do gier w 1080p",
        price: 3299,
        category: "gaming",
        components: [
            {
                name: "Processor",
                models: [{
                    name: "Intel i5-12400F",
                    link: "https://example.com/i5-12400f",
                    price: 699,
                    description: "6 rdzeni, 12 wątków, do 4.4 GHz. Świetny procesor do gier w przystępnej cenie."
                }]
            },
            {
                name: "Graphics Card",
                models: [{
                    name: "NVIDIA RTX 3050",
                    link: "https://example.com/rtx3050",
                    price: 1299,
                    description: "8GB GDDR6, ray tracing. Dobra karta do gier w 1080p."
                }]
            },
            {
                name: "RAM",
                models: [{
                    name: "Corsair Vengeance LPX 16GB (2x8GB) DDR4 3200",
                    link: "https://example.com/corsair-16gb",
                    price: 299,
                    description: "DDR4 3200MHz CL16. Wystarczająca ilość pamięci do większości gier."
                }]
            },
            {
                name: "Motherboard",
                models: [{
                    name: "MSI PRO B660M-A DDR4",
                    link: "https://example.com/msi-b660m",
                    price: 499,
                    description: "Socket LGA1700, DDR4, PCIe 4.0. Solidna płyta do zestawu gamingowego."
                }]
            },
            {
                name: "Power Supply",
                models: [{
                    name: "be quiet! Pure Power 11 600W",
                    link: "https://example.com/bequiet-600w",
                    price: 399,
                    description: "600W, certyfikat 80+ Gold. Niezawodny zasilacz z dobrymi zabezpieczeniami."
                }]
            }
        ],
        comment: "Ekonomiczny zestaw gamingowy, który poradzi sobie z większością współczesnych gier w rozdzielczości 1080p."
    },
    {
        name: "Zestaw Gamingowy - Advanced",
        description: "Wydajny zestaw do gier w 1440p i streamowania",
        price: 5499,
        category: "gaming",
        components: [
            {
                name: "Processor",
                models: [{
                    name: "Intel i7-12700K",
                    link: "https://example.com/i7-12700k",
                    price: 1699,
                    description: "12 rdzeni (8P + 4E), 20 wątków, do 5.0 GHz. Wydajny procesor do gier i streamowania."
                }]
            },
            {
                name: "Graphics Card",
                models: [{
                    name: "NVIDIA RTX 3070",
                    link: "https://example.com/rtx3070",
                    price: 2299,
                    description: "8GB GDDR6X, ray tracing. Świetna karta do gier w 1440p z ray tracingiem."
                }]
            },
            {
                name: "RAM",
                models: [{
                    name: "G.SKILL Ripjaws V 32GB (2x16GB) DDR4 3600",
                    link: "https://example.com/gskill-32gb",
                    price: 549,
                    description: "DDR4 3600MHz CL16. Szybka pamięć do gier i multitaskingu."
                }]
            },
            {
                name: "Motherboard",
                models: [{
                    name: "MSI MAG Z690 TOMAHAWK",
                    link: "https://example.com/msi-z690",
                    price: 499,
                    description: "Socket LGA1700, DDR4, PCIe 5.0. Zaawansowana płyta z możliwością OC."
                }]
            },
            {
                name: "Power Supply",
                models: [{
                    name: "Corsair RM750x 750W",
                    link: "https://example.com/corsair-750w",
                    price: 449,
                    description: "750W, certyfikat 80+ Gold. Wysokiej jakości zasilacz z 10-letnią gwarancją."
                }]
            }
        ],
        comment: "Zestaw zoptymalizowany pod kątem wydajności w grach 1440p. Świetnie sprawdzi się również w streamowaniu."
    },
    {
        name: "Zestaw Gamingowy - Ultimate",
        description: "Najwyższej klasy zestaw do gier 4K i tworzenia contentu",
        price: 8999,
        category: "gaming",
        components: [
            {
                name: "Processor",
                models: [{
                    name: "Intel i9-12900K",
                    link: "https://example.com/i9-12900k",
                    price: 2499,
                    description: "16 rdzeni (8P + 8E), 24 wątki, do 5.2 GHz. Flagowy procesor do najbardziej wymagających zastosowań."
                }]
            },
            {
                name: "Graphics Card",
                models: [{
                    name: "NVIDIA RTX 3080 Ti",
                    link: "https://example.com/rtx3080ti",
                    price: 4199,
                    description: "12GB GDDR6X, ray tracing. Topowa karta graficzna do gier 4K i renderowania."
                }]
            },
            {
                name: "RAM",
                models: [{
                    name: "G.SKILL Trident Z RGB 32GB (2x16GB) DDR4 4000",
                    link: "https://example.com/gskill-rgb-32gb",
                    price: 799,
                    description: "DDR4 4000MHz CL16, RGB. Ekstremalna wydajność i efektowny wygląd."
                }]
            },
            {
                name: "Motherboard",
                models: [{
                    name: "ASUS ROG MAXIMUS Z690 HERO",
                    link: "https://example.com/asus-maximus",
                    price: 899,
                    description: "Socket LGA1700, DDR5, PCIe 5.0. Topowa płyta z zaawansowanymi funkcjami OC."
                }]
            },
            {
                name: "Power Supply",
                models: [{
                    name: "be quiet! Dark Power 12 1000W",
                    link: "https://example.com/bequiet-1000w",
                    price: 599,
                    description: "1000W, certyfikat 80+ Titanium. Najwyższej klasy zasilacz do wymagających systemów."
                }]
            }
        ],
        comment: "Bezkompromisowy zestaw dla najbardziej wymagających graczy. Pozwala na grę w 4K z maksymalnymi detalami i ray tracingiem."
    },
    // Office Setups
    {
        name: "Zestaw Biurowy - Basic",
        description: "Ekonomiczny zestaw do pracy biurowej",
        price: 2799,
        category: "office",
        components: [
            {
                name: "Processor",
                models: [{
                    name: "Intel i3-12100",
                    link: "https://example.com/i3-12100",
                    price: 499,
                    description: "4 rdzenie, 8 wątków. Wydajny procesor do podstawowych zadań."
                }]
            },
            {
                name: "Graphics Card",
                models: [{
                    name: "Intel UHD Graphics 730",
                    link: "https://example.com/uhd730",
                    price: 0,
                    description: "Zintegrowana karta graficzna. Wystarcza do zadań biurowych."
                }]
            },
            {
                name: "RAM",
                models: [{
                    name: "Crucial 16GB (2x8GB) DDR4 3200",
                    link: "https://example.com/crucial-16gb",
                    price: 259,
                    description: "DDR4 3200MHz. Niezawodna pamięć do codziennej pracy."
                }]
            },
            {
                name: "Motherboard",
                models: [{
                    name: "ASRock B660M-HDV",
                    link: "https://example.com/asrock-b660m",
                    price: 399,
                    description: "Socket LGA1700, DDR4. Podstawowa płyta do zestawu biurowego."
                }]
            },
            {
                name: "Power Supply",
                models: [{
                    name: "be quiet! System Power 9 500W",
                    link: "https://example.com/bequiet-500w",
                    price: 249,
                    description: "500W, certyfikat 80+ Bronze. Ekonomiczny i niezawodny zasilacz."
                }]
            }
        ],
        comment: "Ekonomiczny zestaw biurowy idealny do podstawowych zadań biurowych i multimediów."
    },
    {
        name: "Zestaw Biurowy - Professional",
        description: "Wydajny komputer do zaawansowanej pracy biurowej",
        price: 4799,
        category: "office",
        components: [
            {
                name: "Processor",
                models: [{
                    name: "Intel i5-12600K",
                    link: "https://example.com/i5-12600k",
                    price: 1299,
                    description: "10 rdzeni (6P + 4E), 16 wątków. Wydajny procesor do multitaskingu."
                }]
            },
            {
                name: "Graphics Card",
                models: [{
                    name: "NVIDIA RTX 3050",
                    link: "https://example.com/rtx3050",
                    price: 1299,
                    description: "8GB GDDR6. Przyspiesza aplikacje biurowe wspierające CUDA."
                }]
            },
            {
                name: "RAM",
                models: [{
                    name: "Kingston Fury 32GB (2x16GB) DDR4 3600",
                    link: "https://example.com/kingston-32gb",
                    price: 599,
                    description: "DDR4 3600MHz. Duża ilość szybkiej pamięci do wymagających aplikacji."
                }]
            },
            {
                name: "Motherboard",
                models: [{
                    name: "ASUS TUF GAMING B660M-PLUS",
                    link: "https://example.com/asus-b660m",
                    price: 599,
                    description: "Socket LGA1700, DDR4, PCIe 4.0. Solidna płyta z dobrym wyposażeniem."
                }]
            },
            {
                name: "Power Supply",
                models: [{
                    name: "Corsair RM650x 650W",
                    link: "https://example.com/corsair-650w",
                    price: 399,
                    description: "650W, certyfikat 80+ Gold. Wysokiej jakości zasilacz z cichą pracą."
                }]
            }
        ],
        comment: "Profesjonalny zestaw biurowy do wymagającej pracy z wieloma aplikacjami jednocześnie."
    },
    {
        name: "Zestaw Biurowy - Enterprise",
        description: "Zaawansowana stacja robocza do zadań biznesowych",
        price: 7499,
        category: "office",
        components: [
            {
                name: "Processor",
                models: [{
                    name: "Intel i9-12900",
                    link: "https://example.com/i9-12900",
                    price: 2299,
                    description: "16 rdzeni (8P + 8E), 24 wątki. Najwyższa wydajność w zastosowaniach biznesowych."
                }]
            },
            {
                name: "Graphics Card",
                models: [{
                    name: "NVIDIA RTX A2000",
                    link: "https://example.com/rtxa2000",
                    price: 2499,
                    description: "6GB GDDR6. Profesjonalna karta do zastosowań biznesowych."
                }]
            },
            {
                name: "RAM",
                models: [{
                    name: "Corsair Vengeance 64GB (2x32GB) DDR4 3600",
                    link: "https://example.com/corsair-64gb",
                    price: 999,
                    description: "DDR4 3600MHz. Ogromna ilość pamięci do najbardziej wymagających zadań."
                }]
            },
            {
                name: "Motherboard",
                models: [{
                    name: "ASUS ProArt Z690-CREATOR",
                    link: "https://example.com/asus-proart",
                    price: 999,
                    description: "Socket LGA1700, DDR4, Thunderbolt 4. Profesjonalna płyta z zaawansowanymi funkcjami."
                }]
            },
            {
                name: "Power Supply",
                models: [{
                    name: "Seasonic PRIME TX-850",
                    link: "https://example.com/seasonic-850w",
                    price: 699,
                    description: "850W, certyfikat 80+ Titanium. Najwyższej klasy zasilacz do stacji roboczych."
                }]
            }
        ],
        comment: "Zaawansowana stacja robocza dla profesjonalistów, idealna do wymagających zadań biznesowych i pracy z dużymi zbiorami danych."
    }
];

export const SetsService = {
    getSets: async (): Promise<Suggestion[]> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return preMadeSets;
    }
}; 