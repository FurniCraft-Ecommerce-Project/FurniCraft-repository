'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Card from '@/components/Card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReactMarkdown from "react-markdown";

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
      const url = 'http://localhost:3000/api/upload/image?base64=true'

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      const result: UploadResponse = await response.json();

      if (result.success) {
        setUploadedImages(prev => [...prev, result]);

        //! TO GET EMBEDDING
        const response = await fetch("http://localhost:3000/api/ai/embedding", {
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
    setUploadedImages(prev => 
      prev.filter(img => img.public_id !== publicId)
    );
    setProducts([])
    setTextResOpenAi("")
  };

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

        {/* Upload Progress */}
        {uploading && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-blue-700">Uploading image...</span>
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
                  <div className="aspect-square relative">
                    <Image
                      src={image.url!}
                      alt={`Uploaded image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
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

            <section className="py-20 px-10 text-center">
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              { 
                (products &&
                  products?.map((el,idx) => {
                    return <Card key={idx} product={el}/>
                  })
                ) 
              }
              {/* { 
                products.length !== 0 && (
                  products.map((el,idx) => {
                    return <Card key={idx} product={el}/>
                  })
                ) 
              } */}
            </div>
          </div>
        )}
      </div>

      <Footer/>
    </>
  );
}