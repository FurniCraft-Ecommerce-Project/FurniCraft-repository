export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const filters = (await searchParams).filters
}

// // "use client";
// import ModelViewer from '@/components/ModelViewer';
// import { useSearchParams } from 'next/navigation'

// export default function ModelDetail() {
//     const searchParams = useSearchParams()

//     const taskId = searchParams.get('taskId');

//     console.log('taskId:', taskId);

//     return (
//         <>
//             <div className="min-h-screen bg-gray-100 text-gray-900 p-8">
//                 <h1 className="text-3xl font-bold mb-4">3D Model Viewer</h1>
//                 <p className="mb-6">Model Name: </p>
//                 <div className="flex justify-center">
//                     <ModelViewer imageUrl={imageUrl}/>
//                 </div>
//             </div>
//         </>
//     );
// }

