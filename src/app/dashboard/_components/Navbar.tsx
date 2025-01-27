'use client'
import { BrandLogo } from '@/app/_components/BrandLogo'
import { UserButton } from '@clerk/clerk-react'
import Link from 'next/link'
import React from 'react'

export const Navbar = () => {
  return (
    <header className='items-center flex py-4 bg-background/95 w-full z-10 shadow-xl mb-4'>
        <nav className='flex items-center gap-10 container font-semibold'>
        <Link href='/' className='mr-auto'>
        <BrandLogo />
        </Link>
        <Link href='/dashboard/products' className='text-lg'>Products</Link>
        <Link href='/dashboard/analytics' className='text-lg'>Analytics</Link>
        <Link href='/dashboard/subscription' className='text-lg'>Subscription</Link>
       <UserButton/>
        </nav>
    </header>
  )
}