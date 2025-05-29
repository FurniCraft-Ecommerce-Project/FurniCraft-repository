import errorHandler from "@/helpers/errorHandler";
import { NewUser } from "@/type";
import UserModel from "@/db/models/UserModel";

export async function POST(request: Request) {
  try {
    const body: NewUser = await request.json();

    const result = await UserModel.create(body);

    return Response.json({ message: result }, { status: 201 });
  } catch (error) {
    return errorHandler(error);
  }
}
