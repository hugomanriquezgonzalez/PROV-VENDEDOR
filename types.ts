
export enum OrderStatus {
  PENDING = 'Pendiente',
  PREPARING = 'En Preparación',
  SHIPPED = 'Enviado',
  DELIVERED = 'Entregado',
  CANCELLED = 'Cancelado'
}

export enum UserRole {
  ADMIN = 'Administrador',
  BODEGA = 'Bodega',
  JEFE_VENTAS = 'Jefe Ventas',
  VENDEDOR = 'Vendedor'
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  status: 'Activo' | 'Inactivo';
  lastLogin?: string;
}

export interface CompanyInfo {
  name: string;
  rut: string;
  giro: string;
  address: string;
  phone: string;
  email: string;
  logoUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  sku: string;
  price: number;
  stock: number;
  minOrder: number;
  image: string;
  description: string;
  weight?: number;
  length?: number;
  width?: number;
  brand?: string;
}

export interface PriceList {
  id: string;
  name: string;
  discountPercentage: number;
  color: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  rut: string;        // Nuevo campo
  giro: string;       // Nuevo campo
  address: string;    // Nuevo campo
  email: string;
  phone: string;
  totalSpent: number;
  lastOrderDate: string;
  status: 'Activo' | 'Inactivo' | 'VIP' | 'Nuevo';
  avatar: string;
  priceListId?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  originalQuantity: number;
  pricePerUnit: number;
  image: string;
}

export interface Order {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: number;
  lineItems?: OrderItem[];
  sellerId: string; // ID del vendedor que realizó la venta
}

export interface SalesData {
  month: string;
  sales: number;
  orders: number;
}
