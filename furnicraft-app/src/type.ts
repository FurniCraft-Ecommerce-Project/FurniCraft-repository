export type ProductType = {
  _id: string;
  name: string;
  description: string;
  price: number;
  thumbnail: string;
  stock: number;
  category: string;
};

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
