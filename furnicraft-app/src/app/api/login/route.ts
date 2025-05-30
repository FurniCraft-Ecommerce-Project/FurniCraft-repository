import { NewUser } from "@/type";
import UserModel from "@/db/models/UserModel";
import errorHandler from "@/helpers/errorHandler";

export async function POST(request: Request) {
  try {
    const user: NewUser = await request.json();
    const access_token = await UserModel.login(user);

    return Response.json(access_token);
  } catch (error) {
    return errorHandler(error);
  }
}
