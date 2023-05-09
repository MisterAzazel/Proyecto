export interface User{
    id: string;
    name: string;
    email: string;
    lastName: string;
    password: string;
    role: Role;
}

export interface Role{
    admin: boolean;
    cliente: boolean;
    final: boolean;
}

export interface Product{
    id: string;
    category: string;
    description: string;
    name: string;
    price: number;
    stock: number;
    img: string;
}

export interface News{
    title: string;
    img: string;
    description: string;
    id: string;
}