'use client'
import { assets } from '@/assets/assets'
import { useAppContext } from '@/context/AppContext'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'

const OrderPlaced = () => {

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

    const timer = setTimeout(() => {
      router.push('/my-orders')
    }, 5000)

    return () => clearTimeout(timer)
  }, [searchParams, router, setCartItems])

  return (
    <div className='h-screen flex flex-col justify-center items-center gap-5'>
      <div className="flex justify-center items-center relative">
        <Image className="absolute p-5" src={assets.checkmark} alt='' />
        <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-green-300 border-gray-200"></div>
      </div>
      <div className="text-center text-2xl font-semibold">Order Placed Successfully</div>
    </div>
  )
}

export default OrderPlaced