export type ProductType = {
    "_id" : string,
    "name" : string,
    "description" : string,
    "price" : number,
    "thumbnail" : string,
    "stock" : number,
    "category" : string
}


export type customError = {
  message: string;
  status?: number;
}