'use server'
export default async function initiateTask({ imageUrl }: { imageUrl: string }) {

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
        return initData; // Contains taskId for further polling
    } catch (error) {
        console.error('Error generating 3D model:', error);
        throw error;
    }
}