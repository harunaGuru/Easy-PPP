import React from 'react'
import { Navbar } from './_components/Navbar'



export default function DahsboardLayout({children}:{children:React.ReactNode}) {
  return (
    <div>
        <Navbar />
        {children}
    </div>
  )
}
