import { CustomErrorType } from "@/type";
import toast from "react-hot-toast";
import { ZodError } from "zod";

export default function errorHandler(payload: unknown) {
  const error = payload as CustomErrorType;
  let message = error.message || "Internal Server Error";
  let status = error.status || 500;

  if (payload instanceof ZodError) {
    message = payload.issues[0].message;
    status = 400;
  }

  // toast.error(message)
  return Response.json({ message: message }, { status: status });
}
