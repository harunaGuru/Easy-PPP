"use client"
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'
import { deleteProduct } from '@/server/actions/product'
import React, { useTransition } from 'react'

export function DeleteProductAlertModal({id}:{id:string}) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  return (
    <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your product.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} className='bg-destructive text-destructive-foreground' onClick={()=>{
            startTransition( async ()=>{
             const result =  await deleteProduct(id)
             toast({
              title: result.errors ? "Error" : "Success",
              description: result.message
          })
            })
          }}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
  )
}
