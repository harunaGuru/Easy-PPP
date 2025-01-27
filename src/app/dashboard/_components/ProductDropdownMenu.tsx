import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { createUrl } from '@/lib/utils'
import {  getProducts } from '@/server/db/product'
import { DropdownMenuContent, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import {  ChevronDownIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export async function ProductDropdownMenu({userId, searchParams, selectedProductId}:{userId:string; searchParams:Record<string, string>, selectedProductId?: string | undefined}) {
    const products = await getProducts(userId) 
   
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="outline">
                {products.find(p=> p.id === selectedProductId)?.name ?? "All Products"}
                <ChevronDownIcon className='size-4 ml-2' />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuItem asChild>
                <Link href={createUrl("/dashboard/analytics", searchParams, {productId: undefined})}>All Product</Link>
            </DropdownMenuItem>
            {products.map(product=>(
                <DropdownMenuItem asChild key={product.id}>
                    <Link href={createUrl("/dashboard/analytics", searchParams, {productId: product.id})}>{product.name}</Link>
                </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
    </DropdownMenu>
  )
}
