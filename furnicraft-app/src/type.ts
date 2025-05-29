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
    status : number ,
    message : string
}

export type NewUser = {
    name: string;
    username: string;
    email: string;
    password: string;
    avatar: string;
    role: string;
  };