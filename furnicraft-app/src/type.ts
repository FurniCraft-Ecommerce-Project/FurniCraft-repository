export type CustomErrorType = {
  status: number;
  message: string;
};

export type CartType = {
  _id: string;
  UserId: string;
  ProductId: string;
  quantity: number;
  DetailProduct: ProductType;
};

export type ProductType = {
  _id: string;
  name: string;
  description: string;
  price: number;
  thumbnail: string;
  stock: number;
  category: string;
  image3dUrl?: string;
};

export interface OrderType {
  _id?: string;
  orderId: string;
  userId: string;
  status: string;
  paidDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  token: string;
  deliveryStatus: string;
  items: OrderDetail[];
}

export interface OrderDetail {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  thumbnail: string;
}

export type WishlistType = {
  _id: string;
  UserId: string;
  ProductId: string;
  DetailProduct: ProductType;
};

export type NewUser = {
  name: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  role: string;
};

export interface MidtransItem {
    id: string;
    price: number;
    quantity: number;
    name: string;
}

export type MidtransItems = MidtransItem[];
