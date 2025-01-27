import { getProducts } from '@/server/db/product'
import { auth } from '@clerk/nextjs/server'
import React from 'react'
import { NoProduct } from '../_components/NoProduct'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusIcon } from 'lucide-react'
import { ProductGrid } from '../_components/ProductCard'

export default async function ProductsPage() {
    const {userId, redirectToSignIn} = await auth()
    if (!userId) return redirectToSignIn()
    const products = await getProducts(userId)
    if(products.length ===  0) return <NoProduct />
  return (
    <div className='container'>
    <h1 className='mb-6 text-3xl font-semibold flex justify-between'>
        Products
        <Button asChild>
            <Link href='/dashboard/products/new'><PlusIcon className='size-4 mr-2'/> New Product</Link>
        </Button>
    </h1>
    <ProductGrid products={products} />
    </div>
  )
}
