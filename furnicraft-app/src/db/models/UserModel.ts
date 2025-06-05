import { NewUser } from "@/type";
import { db } from "../config/mongodb";
import { z } from "zod";
import { signBcrypt, verifyBcrypt } from "@/helpers/bcryptjs";
import { generateToken } from "@/helpers/jwt";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";

const NewUserSchema = z.object({
  username: z
    .string()
    .nonempty("Username is required")
    .min(3, "Username must be at least 3 characters long"),
  email: z
    .string()
    .nonempty("Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(5, "Password must be at least 5 characters long"),
  role: z.string().optional().default("user"),
});

const LoginSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(5, "Password must be at least 5 characters long"),
});

class UserModel {
  static collection() {
    return db.collection<{
      name: string;
      username: string;
      email: string;
      password: string;
      avatar: string;
      role: string;
    }>("Users");
  }

  static async create(user: NewUser) {
    NewUserSchema.parse(user);

    const existUser = await this.collection().findOne({
      $or: [
        { email: { $regex: user.email } },
        { username: { $regex: user.username } },
      ],
    });

    if (existUser) throw { status: 400, message: "User already exists" };

    if (!user.role) {
      user.role = "user";
    }

    user.password = signBcrypt(user.password);

    await this.collection().insertOne(user);
    return "Success register user";
  }

  static async findByEmail(email: string) {
    if (!email) throw { status: 400, message: "Email is required" };

    const user = await this.collection().findOne({
      email: { $regex: email, $options: "i" },
    });
    return user;
  }

  static async findById(id: string) {
    if (!id) throw { status: 400, message: "Id is required" };

    const user = await this.collection().findOne({ _id: new ObjectId(id) });
    return user;
  }

  static async login(user: NewUser) {
    LoginSchema.parse(user);
    const existUser = await this.collection().findOne({ email: user.email });

    if (!existUser) throw { status: 404, message: "User not found" };

    const isValid = verifyBcrypt(user.password, existUser.password);

    if (!isValid) throw { status: 401, message: "Invalid password" };

    const access_token = generateToken({
      userId: existUser._id.toString(),
      email: existUser.email,
      role : existUser.role
    });

    const cookieStore = await cookies();
    cookieStore.set("Authorization", `Bearer ${access_token}`);
    cookieStore.set("Role", existUser.role);

    return access_token;
  }

}

export default UserModel;
