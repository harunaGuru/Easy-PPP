import React from 'react'
import { CaretLeftIcon } from "@radix-ui/react-icons"
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function PageGrid({children, title, href}:{children:React.ReactNode, title: string, href: string}) {
  return (
    <div className='grid container grid-cols-[auto_1fr] gap-x-2 gap-y-4 '>
        <Button size="icon" asChild variant='outline' className='rounded-full'>
            <Link href={href}>
            <CaretLeftIcon className='size-8'/>
            </Link>
        </Button>
        <span className='font-semibold text-xl self-center'>{title}</span>
        <div className='col-start-2 mt-2'>
            {children}
        </div>
    </div>
  )
}
