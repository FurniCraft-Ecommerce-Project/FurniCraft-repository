import { sign, verify } from "jsonwebtoken";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const generateToken = (payload: { userId: string; email: string; role:string }) => {
  return sign(payload, JWT_SECRET);
};

export const verifyToken = async (token: string) => {
  verify(token, JWT_SECRET);
};

export const verifyWithJose = async <T>(token: string) => {
  const secret = new TextEncoder().encode(JWT_SECRET);

  const { payload } = await jwtVerify<T>(token, secret);
  return payload;
};
