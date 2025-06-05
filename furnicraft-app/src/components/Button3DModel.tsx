"use client";

import errorHandler from "@/helpers/errorHandler";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Button3DModel({
  imageUrl,
  id,
  text,
}: {
  imageUrl: string;
  id: string;
  text: string;
}) {
  const router = useRouter();
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handleClick = async () => {
    try {
      // return alert('this feature is work, remove this line code to use the feature') // comment this line to enable the feature

      setButtonDisabled(true);
      const product = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${id}`
      );

      if (!product.ok) {
        const errorData = await product.json();
        throw new Error(errorData.message || "Product not found");
      }

      const productData = await product.json();

      if (!productData.image3dUrl) {
        const initResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/ai/3d-model`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ imageUrl }),
          }
        );

        if (!initResponse.ok) {
          const errorData = await initResponse.json();
          throw new Error(
            errorData.message || "Failed to initiate 3D model generation"
          );
        }

        const initData = await initResponse.json();

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/ai/3d-model?taskId=${initData.result}`
        );
        const data = await response.json();

        const glbUrl = data.model_urls?.glb;
        if (!glbUrl) {
          throw new Error("Failed to generate 3D model");
        }

        const response2 = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/cloudinary/3d-model`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              productId: id,
              glbUrl,
            }),
          }
        );

        if (!response2.ok) {
          const errorData = await response2.json();
          throw new Error(errorData.message || "Failed to upload 3D model");
        }

        const response2Data = await response2.json();

        const update = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/products`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id,
              image3dUrl: response2Data.deliveryUrl,
            }),
          }
        );

        if (!update.ok) {
          const errorData = await update.json();
          throw new Error(
            errorData.message || "Failed to update product with 3D model"
          );
        }

        await update.json();
      }
      router.push(`/products/3d-view/${id}`);
    } catch (error) {
      return errorHandler(error);
    }
  };

  return (
    <button
      className="btn text-blue-600 hover:text-white bg-blue-100 hover:bg-blue-600 rounded-md px-3 py-1 text-sm font-medium"
      style={{ cursor: "pointer" }}
      disabled={buttonDisabled}
      onClick={() =>
        toast.promise(handleClick(), {
          loading:
            "Generating your 3D model...\nThis process usually takes 2 to 3 minutes. Thank you for your patience!",
          success: <b>3D Model ready!</b>,
          error: <b>Sorry, this product doesnt have 3D model yet!</b>,
        })
      }
    >
      {text} 3D Model
    </button>
  );
}
