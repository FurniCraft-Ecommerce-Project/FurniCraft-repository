"use client";

import errorHandler from "@/helpers/errorHandler";

export default function Button3DModel({ imageUrl }: { imageUrl: string }) {
    const handleClick = async () => {
        try {
            // First call to initiate 3D model generation
            const initResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/ai/3d-model`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imageUrl: imageUrl,
                }),
            });

            if (!initResponse.ok) {
                throw new Error('Failed to initiate 3D model generation');
            }

            const initData = await initResponse.json();

            window.location.href = `/products/3d-view?taskId=${initData.result}`;

        } catch (error) {
            return errorHandler(error)
        }
    };
    return (
        <button className="btn btn-primary btn-outline" onClick={handleClick}>
            See 3D Model
        </button>
    )
}