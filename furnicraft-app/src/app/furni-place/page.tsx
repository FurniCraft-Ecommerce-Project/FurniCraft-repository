'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReactMarkdown from "react-markdown";
import formatRupiah from '@/helpers/formatRupiah';
import Link from 'next/link';
import ButtonAddToWishlist from '@/components/ButtonAddToWishlist';
import ButtonAddToCart from '@/components/ButtonAddToCart';
import { IoMdInfinite } from '@react-icons/all-files/io/IoMdInfinite';

interface UploadResponse {
  success: boolean;
  url?: string;
  public_id?: string;
  width?: number;
  height?: number;
  error?: string;
  base64 : {dataUri : string}
}

export default function ImageUploadPage() {
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadResponse[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dragActive, setDragActive] = useState(false);

  //! new for data products
  const [products, setProducts] = useState<{_id:string, sim:number, name : string, thumbnail : string, price : number, description : string, stock:number, category : string, image3dUrl:string}[]>([])
  const [textResOpenAi, setTextResOpenAi] = useState("")
  const [resCombineImg,setResCombineImg] = useState("")
  const [loadCombine, setLoadCombine] = useState(false)

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    Array.from(files).forEach(file => {
      uploadImage(file); // Pass base64Mode parameter
    });
  };

  const uploadImage = async (file: File) => {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Tambahkan parameter base64 jika diperlukan
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/upload/image?base64=true`

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      const result: UploadResponse = await response.json();

      if (result.success) {
        setUploadedImages(prev => [...prev, result]);

        //! TO GET EMBEDDING
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/ai/embedding`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ base64Image: result.base64.dataUri }),
          // body: JSON.stringify({ imageUrl: result.url }),
        });

        const {arrProductsRec, textOpenAi } = await response.json()
        
        setProducts(arrProductsRec)
        setTextResOpenAi(textOpenAi)
        
      } else {
        alert(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };


  const deleteImage = (publicId: string) => {
    setUploadedImages([])
    setProducts([])
    setTextResOpenAi("")
    setResCombineImg("")
  };

  const handleOnClickCombine = async (roomImageUrl: string) => {
    setLoadCombine(true)
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/ai/combine-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        urlImageFurniture: uploadedImages[0].url,
        urlImageRoom : roomImageUrl
      }),
    });
    const resAiCombineImage = await response.json()
    setResCombineImg(resAiCombineImage)
    setLoadCombine(false)
  }

  return (
    <>
      <Navbar/>

      <section className="py-20 px-10 text-center">
        <h2 className="text-3xl font-bold mb-6">Smart Furniture Recommendations with AI</h2>
        <p className="text-gray-700 max-w-xl mx-auto mb-12">Upload a photo of your room and let FurniPlace do the rest. Our AI-powered recommendation engine analyzes your space and suggests the perfect furniture pieces to match — directly from our catalog.</p>
      </section>
      <div className="px-10 text-center">
        {/* Upload Area */}
        {
          uploadedImages.length === 0 && (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="space-y-4">
                <div className="text-gray-600">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                
                <div>
                  <p className="text-lg font-medium text-gray-900">Drop files here or click to browse</p>
                  <p className="text-sm text-gray-500">PNG, JPG, WebP, GIF up to 5MB</p>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {uploading ? 'Uploading...' : 'Select Files'}
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                />
              </div>
            </div>
          )
        }

        {/* Loading Progress */}
        {uploading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <div className="flex flex-col items-center space-y-4 p-6 bg-white shadow-xl rounded-xl">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
              <p className="text-gray-700 text-lg font-medium">Uploading Image and Get Your Recommendation...</p>
            </div>
          </div>
        )}
        {loadCombine && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <div className="flex flex-col items-center space-y-4 p-6 bg-white shadow-xl rounded-xl">
              <span className="loading loading-infinity loading-xl"></span>
              <p className="text-gray-700 text-lg font-medium">Combine Room and Product</p>
            </div>
          </div>
        )}

        {/* Uploaded Images */}
        {uploadedImages.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Uploaded Images</h2>
            <div className="">
              {uploadedImages.map((image, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <Image
                      src={image.url!}
                      alt={`Uploaded image ${index + 1}`}
                      width={800}         // or any desired max size
                      height={400}
                      className="rounded-lg object-contain w-full h-auto max-w-[600px] mx-auto shadow-md overflow-hidden"
                    />
                  
                  <div className="p-4 space-y-2">
                    <div className="text-sm text-gray-600">
                      {image.width} × {image.height}px
                    </div>
                    
                    <div className="text-xs text-gray-500 break-all">
                      {image.url}
                    </div>

                    <button
                        onClick={() => deleteImage(image.public_id!)}
                        className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                      >
                        Change Photo
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <section className="py-10 px-10 text-center">
              <h2 className="text-3xl font-bold mb-6">Your Recommendation</h2>
              <p className="text-gray-700 max-w-xl mx-auto mb-12">Based on your room photo, we've selected furniture pieces that suit your space and style. Explore the recommendations, customize your picks, and make your room truly yours.</p>
              <button className="btn m-9" onClick={()=>{const modal = document.getElementById('my_modal_5') as HTMLDialogElement | null;
                if (modal) {
                  modal.showModal();
                }}}>
                  Room Analysis
              </button>
              <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                  <h3 className="font-bold text-lg">Hello!</h3>
                  <div className="prose text-left ">
                    <ReactMarkdown>{textResOpenAi}</ReactMarkdown>
                  </div>
                  <div className="modal-action">
                    <form method="dialog">
                      <button className="btn">Close</button>
                    </form>
                  </div>
                </div>
              </dialog>
            </section>

            {
              resCombineImg && (
                <div className="mb-10">
                  <div className="p-4 bg-white rounded-lg shadow-md overflow-hidden">
                    <h2 className="text-2xl font-semibold mb-4">Combined Images</h2>
                      <Image
                        src={resCombineImg}
                        alt={`Combine Image`}
                        width={800}         // or any desired max size
                        height={400}
                        className="rounded-lg object-contain w-full h-auto max-w-[600px] mx-auto shadow-md overflow-hidden"
                      />
                    <div className="p-4 space-y-2">
                      <div className="text-xs text-gray-500 break-all">
                        {resCombineImg}
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              { 
                (products &&
                  products?.map((el,idx) => {
                    return (
                      <div key={idx} className="bg-white rounded-xl shadow p-4 text-left">
                        <div className="text-right space-x-2">
                          <button className="cursor-pointer" onClick={() => handleOnClickCombine(el.thumbnail)}>
                              <IoMdInfinite  className="h-7 w-7" />
                          </button>
                          <ButtonAddToWishlist product={el} />
                          <ButtonAddToCart product={el} page={"products"} />
                        </div>
                        <Link
                          href={`/products/${el.name+'-'+el._id}`}
                        >
                          <img src={el.thumbnail} alt={el.name} className="w-full h-40 object-contain mb-4" />
                        </Link>
                        <h3 className="text-lg font-semibold mb-1">{el.name}</h3>
                        <p className="text-gray-800 font-medium mb-2">{formatRupiah(el.price)}</p>
                        <span className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded-full">{el.description}</span>
                        {/* <div className="text-right space-x-2">
                          <button className="cursor-pointer" onClick={() => handleOnClickCombine(el.thumbnail)}>
                              <IoMdInfinite  className="h-7 w-7" />
                          </button>
                          <ButtonAddToWishlist product={el} />
                          <ButtonAddToCart product={el} page={"products"} />
                        </div> */}
                      </div>
                    )
                  })
                ) 
              }
            </div>
          </div>
        )}
      </div>

      <Footer/>
    </>
  );
}