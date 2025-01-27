import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import React from 'react'
import { AddToSiteModal } from './AddToSiteModal';
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DeleteProductAlertModal } from './DeleteProductAlertModal';

export function ProductGrid({products}:{
 products:{ id:string; 
  name: string; 
  url:string; 
  description?:string | null
}[]}){
  return(
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {products.map(product=>(
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  )
}

function ProductCard({id, name, url, description}: {id:string; name: string; url:string; description?:string | null}) {
  return (
    <Card>
        <CardHeader>
            <div className='flex items-center justify-between'>
            <CardTitle>{name}</CardTitle>
            <Dialog>
              <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <DotsHorizontalIcon/>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-56 shadow-md p-2 text-sm flex flex-col'>
                <DropdownMenuItem asChild >
                  <Link href={`/dashboard/products/${id}/edit`}>Edit</Link>
                </DropdownMenuItem>
                  <DialogTrigger asChild >
                  <DropdownMenuItem>
                    Add To Site
                  </DropdownMenuItem>
                  </DialogTrigger>
                  <DropdownMenuSeparator />
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem>
                      Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <DeleteProductAlertModal id={id} />
            </AlertDialog>
              <AddToSiteModal id={id}/>
            </Dialog>
            </div>
            <CardDescription>{url}</CardDescription>
        </CardHeader>
        { description && <CardContent>
          {description}
        </CardContent>}
    </Card>
  )
}

