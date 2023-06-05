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
    img: string | null;
    destacado: boolean;
    imageUrl: string | null; // Agrega la propiedad imageUrl de tipo string
}

export interface News{
    title: string;
    img: string;
    description: string;
    id: string;
}

export interface registroContacto{
    id: string,
    email: string,
    name: string,
    lastName: string,
    message: string,
    phone: number,
    state: boolean,
}