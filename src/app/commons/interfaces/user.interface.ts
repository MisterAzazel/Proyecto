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

export interface Productos{
    id: string;
    category: string;
    description: string;
    nombre_producto: string;
    price: number;
    compra: number;
    stock: number;
    img: string | null;
    destacado: boolean;
    imageUrl: string | null; // Agrega la propiedad imageUrl de tipo string
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

export interface Compras {
    orden_compra: string;
    token: string;
    email_comprador: string;
    nombre_comprador: string;
    apellido_comprador: string;
    productos: Productos[];
    precio_total: number;
    fecha: string;
    estado: string;
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