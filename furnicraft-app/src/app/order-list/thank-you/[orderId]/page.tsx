'use client';

import { useParams } from 'next/navigation'
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function ThankYouPage() {
  const params = useParams<{ orderId: string }>()

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-neutral-content p-4">
        <div className="max-w-2xl w-full rounded-box p-8 bg-base-100 text-center">

          <h1 className="text-4xl font-bold mb-4">THANK YOU!</h1>

          <p className="mb-4 text-base">
            We are getting started on your order right away, and you will receive an order confirmation email.
          </p>

          <div className="mb-4">
            <Link href={`/order-list`}>
              <button className="btn btn-neutral btn-outline">
                VIEW ORDER CONFIRMATION
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
