import ButtonBack from '@/components/ButtonBack';
import ModelViewer from '@/components/ModelViewer';
import { ProductType } from '@/type';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${id}`)
  const data: ProductType = await response.json()

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-8">
      <ButtonBack/>
      <h1 className="text-3xl font-bold mb-4">3D Model Viewer</h1>
      <p className="mb-6">Product Name: {data?.name ?? 'Unknown'}</p>
      <div className="flex justify-center">
        <ModelViewer imageUrl={data.image3dUrl}/>
      </div>
    </div>
  );
}
