import { Suggestion } from '../types/Suggestion';

const preMadeSets: Suggestion[] = [
    {
        name: "Zestaw Gamingowy",
        description: "Idealny zestaw do gier w wysokiej jakości i streamowania",
        price: 4795,
        components: [
            {
                name: "Processor",
                models: [{
                    name: "Intel i7-12700K",
                    link: "https://example.com/i7-12700k",
                    price: 1699,
                    description: "12 rdzeni (8P + 4E), 20 wątków, do 5.0 GHz w trybie boost. Wydajny procesor do gier i zadań wielowątkowych."
                }]
            },
            {
                name: "Graphics Card",
                models: [{
                    name: "NVIDIA RTX 3060",
                    link: "https://example.com/rtx3060",
                    price: 1499,
                    description: "12GB GDDR6, ray tracing, DLSS 2.0, rdzeń 1777 MHz. Świetna karta do gier w 1080p i 1440p z obsługą ray tracingu i DLSS dla lepszej wydajności."
                }]
            },
            {
                name: "RAM",
                models: [{
                    name: "G.SKILL Ripjaws V 32GB (2x16GB) DDR4 3600",
                    link: "https://example.com/gskill-32gb",
                    price: 549,
                    description: "DDR4 3600MHz CL16, efektywne chłodzenie, XMP 2.0. Szybka pamięć do wymagających zastosowań."
                }]
            },
            {
                name: "Motherboard",
                models: [{
                    name: "MSI PRO B660M-A DDR4",
                    link: "https://example.com/msi-b660m",
                    price: 499,
                    description: "Socket LGA1700, DDR4 do 4800MHz, PCIe 4.0, mATX. Płyta główna z obsługą procesorów Intel 12-tej generacji."
                }]
            },
            {
                name: "Power Supply",
                models: [{
                    name: "Corsair RM750x 750W 80+ Gold",
                    link: "https://example.com/corsair-750w",
                    price: 549,
                    description: "750W, w pełni modularne okablowanie, certyfikat 80+ Gold. Wysokiej jakości zasilacz z 10-letnią gwarancją."
                }]
            }
        ],
        comment: "Zestaw zoptymalizowany pod kątem wydajności w grach. Procesor Intel i7-12700K w parze z RTX 3060 zapewni płynną rozgrywkę w najnowszych tytułach."
    },
    {
        name: "Zestaw Biurowy Plus",
        description: "Wydajny komputer do pracy biurowej i multimediów",
        price: 3299,
        components: [
            {
                name: "Processor",
                models: [{
                    name: "Intel i5-12400F",
                    link: "https://example.com/i5-12400f",
                    price: 699,
                    description: "6 rdzeni, 12 wątków, do 4.4 GHz w trybie boost. Świetny procesor do codziennych zadań."
                }]
            },
            {
                name: "Graphics Card",
                models: [{
                    name: "NVIDIA RTX 3050",
                    link: "https://example.com/rtx3050",
                    price: 1299,
                    description: "8GB GDDR6, podstawowe wsparcie ray tracingu. Dobra karta do pracy i okazjonalnych gier."
                }]
            },
            {
                name: "RAM",
                models: [{
                    name: "Corsair Vengeance LPX 16GB (2x8GB) DDR4 3200",
                    link: "https://example.com/corsair-16gb",
                    price: 299,
                    description: "DDR4 3200MHz CL16, niski profil. Niezawodna pamięć do codziennego użytku."
                }]
            },
            {
                name: "Motherboard",
                models: [{
                    name: "ASRock B660M Pro",
                    link: "https://example.com/asrock-b660m",
                    price: 399,
                    description: "Socket LGA1700, DDR4, PCIe 4.0. Solidna płyta główna do zestawu biurowego."
                }]
            },
            {
                name: "Power Supply",
                models: [{
                    name: "be quiet! Pure Power 11 600W",
                    link: "https://example.com/bequiet-600w",
                    price: 399,
                    description: "600W, certyfikat 80+ Gold. Cichy i wydajny zasilacz z dobrymi zabezpieczeniami."
                }]
            }
        ],
        comment: "Zestaw biurowy z możliwością rozbudowy. Świetnie sprawdzi się w codziennej pracy biurowej, przeglądaniu internetu i multimediach."
    },
    {
        name: "Zestaw Profesjonalny",
        description: "Zaawansowana stacja robocza do zadań profesjonalnych",
        price: 6999,
        components: [
            {
                name: "Processor",
                models: [{
                    name: "Intel i9-12900K",
                    link: "https://example.com/i9-12900k",
                    price: 2499,
                    description: "16 rdzeni (8P + 8E), 24 wątki, do 5.2 GHz. Najwydajniejszy procesor do zadań profesjonalnych."
                }]
            },
            {
                name: "Graphics Card",
                models: [{
                    name: "NVIDIA RTX 3070",
                    link: "https://example.com/rtx3070",
                    price: 2499,
                    description: "8GB GDDR6X, wydajny ray tracing. Świetna karta do renderowania i pracy kreatywnej."
                }]
            },
            {
                name: "RAM",
                models: [{
                    name: "G.SKILL Trident Z 64GB (2x32GB) DDR4 3600",
                    link: "https://example.com/gskill-64gb",
                    price: 899,
                    description: "DDR4 3600MHz CL16, RGB. Duża ilość szybkiej pamięci do wymagających zastosowań."
                }]
            },
            {
                name: "Motherboard",
                models: [{
                    name: "ASUS ROG STRIX Z690-F",
                    link: "https://example.com/asus-z690f",
                    price: 599,
                    description: "Socket LGA1700, DDR4, PCIe 5.0. Zaawansowana płyta z wysokiej jakości komponentami."
                }]
            },
            {
                name: "Power Supply",
                models: [{
                    name: "be quiet! Dark Power 12 850W",
                    link: "https://example.com/bequiet-850w",
                    price: 499,
                    description: "850W, certyfikat 80+ Titanium. Najwyższej klasy zasilacz do wymagających systemów."
                }]
            }
        ],
        comment: "Profesjonalna stacja robocza zaprojektowana z myślą o wymagających zastosowaniach. Świetnie sprawdzi się w renderowaniu, kompilacji i pracy z dużymi zbiorami danych."
    }
];

export const SetsService = {
    getSets: async (): Promise<Suggestion[]> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return preMadeSets; //TODO: Change to real API call
    }
}; 