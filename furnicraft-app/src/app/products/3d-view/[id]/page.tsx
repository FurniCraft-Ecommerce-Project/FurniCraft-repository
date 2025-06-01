import ModelViewer from '@/components/ModelViewer';


export default async function ModelDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <>
            <div className="min-h-screen bg-gray-100 text-gray-900 p-8">
                <h1 className="text-3xl font-bold mb-4">3D Model Viewer</h1>
                <p className="mb-6">Model Name: </p>
                <div className="flex justify-center">
                    <ModelViewer/>
                </div>
            </div>
        </>
    );
}