export interface Model {
    id: number;
    name: string;
    link: string;
    price: number;
    description: string;
}

export interface Component {
    type: string;
    model: string;
    description: string;
    price: number;
} 