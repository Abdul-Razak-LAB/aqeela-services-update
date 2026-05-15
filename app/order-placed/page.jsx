'use client'
import { assets } from '@/assets/assets'
import { useAppContext } from '@/context/AppContext'
import Image from 'next/image'
import { Suspense, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'

const OrderPlacedContent = () => {

  const { router, setCartItems } = useAppContext()
  const searchParams = useSearchParams()
  const hasConfirmed = useRef(false)

  useEffect(() => {
    const orderId = searchParams.get('orderId')
    const sessionId = searchParams.get('session_id')

    const confirmPayment = async () => {
      if (!orderId || !sessionId) return
      if (hasConfirmed.current) return
      hasConfirmed.current = true

      const response = await fetch('/api/orders/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, sessionId }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        toast.error(data.message || 'Payment confirmation failed.')
        return
      }

      setCartItems({})
      toast.success('Payment confirmed. Order placed successfully.')
    }

    confirmPayment()

  }, [searchParams, router, setCartItems])

  return (
    <div className='h-screen flex flex-col justify-center items-center gap-5'>
      <div className="flex justify-center items-center relative">
        <Image className="absolute p-5" src={assets.checkmark} alt='' />
        <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-green-300 border-gray-200"></div>
      </div>
      <div className="text-center text-2xl font-semibold">Order Placed Successfully</div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/all-products')}
          className="px-6 py-2.5 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition"
        >
          Go to Shop
        </button>
        <button
          onClick={() => router.push('/my-orders')}
          className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
        >
          View My Orders
        </button>
      </div>
    </div>
  )
}

const OrderPlaced = () => {
  return (
    <Suspense
      fallback={
        <div className='h-screen flex flex-col justify-center items-center gap-5'>
          <div className="flex justify-center items-center relative">
            <Image className="absolute p-5" src={assets.checkmark} alt='' />
            <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-green-300 border-gray-200"></div>
          </div>
          <div className="text-center text-2xl font-semibold">Processing your order...</div>
          <div className="flex items-center gap-3">
            <a
              href="/all-products"
              className="px-6 py-2.5 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition"
            >
              Go to Shop
            </a>
            <a
              href="/my-orders"
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
            >
              View My Orders
            </a>
          </div>
        </div>
      }
    >
      <OrderPlacedContent />
    </Suspense>
  )
}

export default OrderPlaced