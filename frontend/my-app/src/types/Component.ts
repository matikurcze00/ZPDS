export interface Model {
    name: string;
    link: string;
    price: number;
    description: string;
}

export interface Component {
    name: string;
    models: Model[];
} 