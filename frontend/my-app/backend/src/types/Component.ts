export interface Model {
    name: string;
    link: string;
    price: number;
}

export interface Component {
    name: string;
    models: Model[];
} 