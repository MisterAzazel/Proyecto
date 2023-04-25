export interface User{
    id: string;
    name: string;
    email: string;
    lastName: string;
    password: string;
    role: string;
}

export interface Product{
    category: string;
    description: string;
    name: string;
    price: number;
    stick: number;
    img: string;
}