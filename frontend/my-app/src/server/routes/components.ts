import express, { Request, Response } from 'express';
import { Component } from '../../types/Component';

const router = express.Router();

// Sample data - in a real application, this would come from a database
const components: Component[] = [
    {
        name: "Processor",
        models: [
            {
                name: "Intel i5-12400F",
                link: "https://example.com/i5-12400f",
                price: 699
            },
            {
                name: "AMD Ryzen 5 5600X",
                link: "https://example.com/ryzen-5600x",
                price: 799
            }
        ]
    },
    {
        name: "Graphics Card",
        models: [
            {
                name: "NVIDIA RTX 3060",
                link: "https://example.com/rtx3060",
                price: 1499
            },
            {
                name: "AMD RX 6600",
                link: "https://example.com/rx6600",
                price: 1299
            }
        ]
    },
    {
        name: "Motherboard",
        models: [
            {
                name: "MSI PRO B660M-A DDR4",
                link: "https://example.com/msi-b660m",
                price: 499
            },
            {
                name: "ASUS TUF GAMING B550-PLUS",
                link: "https://example.com/asus-b550",
                price: 599
            }
        ]
    },
    {
        name: "RAM",
        models: [
            {
                name: "Corsair Vengeance LPX 16GB (2x8GB) DDR4 3200",
                link: "https://example.com/corsair-16gb",
                price: 299
            },
            {
                name: "G.SKILL Ripjaws V 32GB (2x16GB) DDR4 3600",
                link: "https://example.com/gskill-32gb",
                price: 549
            }
        ]
    },
    {
        name: "Power Supply",
        models: [
            {
                name: "be quiet! Pure Power 11 600W 80+ Gold",
                link: "https://example.com/bequiet-600w",
                price: 399
            },
            {
                name: "Corsair RM750x 750W 80+ Gold",
                link: "https://example.com/corsair-750w",
                price: 549
            }
        ]
    }
];

// GET /getComponents
router.get('/getComponents', (req: Request, res: Response) => {
    try {
        res.json(components);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch components' });
    }
});

export default router; 