import { BrandLogo } from '@/app/_components/BrandLogo'
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

export const Navbar = () => {
  return (
    <header className=' items-center flex py-6 bg-background/95 w-full z-10 shadow-xl fixed top-0'>
        <nav className='flex items-center gap-10 container font-semibold'>
        <Link href='/' className='mr-auto'>
        <BrandLogo />
        </Link>
        <Link href='#' className='text-lg'>Features</Link>
        <Link href='#' className='text-lg'>Pricing</Link>
        <Link href='#about' className='text-lg'>About</Link>
        <SignedIn>
        <Link href='/dashboard' className='text-lg'>Dashboard</Link>
        </SignedIn>
        <SignedOut>
          <SignInButton>Login</SignInButton>
        </SignedOut>
        </nav>
    </header>
  )
}