import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'


export function NoProduct() {
  return (
    <div className='min-h-screen text-3xl flex flex-col items-center justify-center gap-3'>
    <h1 className='font-semibold'>You have no products</h1>
    <span className='text-sm'>Get started with PPP discounts by creating a product</span>
    <Button asChild>
        <Link href='/dashboard/products/new'>Add Product</Link>
    </Button>
    </div>
  )
}
