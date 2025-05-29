export type ProductType = {
    "_id" : string,
    "name" : string,
    "description" : string,
    "price" : number,
    "thumbnail" : string,
    "stock" : number,
    "category" : string
}

export type CustomErrorType = {
    status : number ,
    message : string
}