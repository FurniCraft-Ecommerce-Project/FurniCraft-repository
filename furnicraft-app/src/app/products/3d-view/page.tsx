import ModelViewer from '@/components/ModelViewer';

type SearchParams = Promise<{ taskId: string }>
 
export default async function Page(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams
  const taskId = searchParams.taskId

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/ai/3d-model?taskId=${taskId}`,
    { cache: 'no-store' } 
  );

  const data = await response.json();

  if (data.error) {
    return (
      <div className="p-8 text-red-600">
        <h1 className="text-xl font-bold">Error:</h1>
        <p>{data.error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-8">
      <h1 className="text-3xl font-bold mb-4">3D Model Viewer</h1>
      {/* <p className="mb-6">Model Name: {data?.name ?? 'Unknown'}</p> */}
      <div className="flex justify-center">
        <ModelViewer imageUrl={data.model_urls.glb}/>
      </div>
    </div>
  );
}
