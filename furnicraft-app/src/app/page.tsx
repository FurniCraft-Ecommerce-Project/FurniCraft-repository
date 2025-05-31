import Card from '@/components/Card';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { ProductType } from '@/type';
import React from 'react';

export default async function HomePage() {

  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`);
  const products: ProductType[] = await response.json()

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-center items-center text-center bg-cover bg-center px-4" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.4), rgba(0, 0, 0, 0.14)), url('https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=2892&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
        <div className="relative z-10 text-white max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">Find The Perfect Furniture To Complete Your Home</h1>
          <p className="mt-4 text-lg md:text-xl">We specialize in buying and selling high-quality, marketable furniture, each piece reflecting our unique aesthetic.</p>
          <button className="mt-8 px-6 py-3 bg-white text-black rounded-full shadow hover:bg-gray-200 transition">Shop Now</button>
        </div>
      </section>

      {/* Collections Section */}
      <section className="py-20 px-10 text-center">
        <h2 className="text-3xl font-bold mb-6">Our New Collections</h2>
        <p className="text-gray-700 max-w-xl mx-auto mb-12">These products are crafted using wood sourced responsibly and with sustainability in mind, perfect for modern homes with a natural touch.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((el, idx) => (
            <Card key={idx} product={el} />
          ))}
        </div>
      </section>

      {/* footer */}
      <Footer />
    </div>
  );
}
