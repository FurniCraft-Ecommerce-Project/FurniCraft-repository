'use client'
import Link from "next/link";
import { IoMdHeartEmpty } from "@react-icons/all-files/io/IoMdHeartEmpty";
import { IoCartOutline } from "@react-icons/all-files/io5/IoCartOutline";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { getRole, handleOnClickLogout } from "@/actions";


export default function Navbar() {

  const [role,setRole] = useState("")


  useEffect(() => {
    const runHead = async () => {
      const userRole = await getRole()
      setRole(userRole)
    }
    runHead()
  },[])

  return (
    <>
      {/* Navbar */}
      <header className="flex justify-between items-center px-10 py-6 shadow-md bg-white">
        <div className="text-xl font-bold">
          <Link href="/">FurniCraft</Link>
        </div>
        <nav className="space-x-6 hidden md:flex">
          {
            role==='admin' && (
              <Link href="/admin" className="hover:text-gray-700">
                Admin
              </Link>
            )
          }
          <Link href="/" className="hover:text-gray-700">
            Home
          </Link>
          <Link href="/products" className="hover:text-gray-700">
            Products
          </Link>
          <Link href="/furni-place" className="hover:text-gray-700">
            FurniPlace
          </Link>
          <Link href={"/order-list"}>Order</Link>
        </nav>
        <div className="flex space-x-4 items-center">
          
          <Link href={"/wishlist"}>
            <IoMdHeartEmpty className="h-5 w-5" />
          </Link>
          <Link href={"/cart"}>
            <IoCartOutline className="h-5 w-5" />
          </Link>
          {
            !role ? (
              <Link href={"/login"}>Login</Link>
            ) : (
              <button className="cursor-pointer" onClick={handleOnClickLogout}>Logout</button>
            )
          }
        </div>
      </header>
      <Toaster position="top-center" />
    </>
  );
}
