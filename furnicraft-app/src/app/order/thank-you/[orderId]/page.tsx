'use client';

import { useParams } from 'next/navigation'
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function ThankYouPage() {
  const params = useParams<{ orderId: string }>()

  const email = ''
  const orderId = params.orderId || '';
    
  return (
    <>
    <Navbar/>
    <div className="min-h-screen flex items-center justify-center bg-neutral-content p-4">
      <div className="max-w-2xl w-full rounded-box p-8 bg-base-100 text-center">
        {/* <p className="text-sm mb-2 text-gray-500">HM.com / CHECKOUT</p> */}

        <h1 className="text-4xl font-bold mb-4">THANK YOU!</h1>

        <p className="mb-4 text-base">
          We are getting started on your order right away, and you will receive an order confirmation email shortly to <strong>{email}</strong>. In the meantime, explore the latest fashion and get inspired by new trends, just head over to{' '}
          <a href={process.env.NEXT_PUBLIC_BASE_URL} className="link link-primary">
            H&M Magazine
          </a>.
        </p>

        <div className="mb-4">
          <Link href={`/orders/${orderId}`}>
            <button className="btn btn-neutral w-full sm:w-auto px-8">
              VIEW ORDER CONFIRMATION
            </button>
          </Link>
        </div>

        <div>
          <a href="/return-policy" className="link link-hover text-sm underline">
            Read about our return policy
          </a>
        </div>
      </div>
    </div>
    </>
  );
}
