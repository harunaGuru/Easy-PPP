import { Globe2Icon } from 'lucide-react'

import React from 'react'

export const BrandLogo = () => {
  return (
    <span className='flex shrink-0 gap-2 items-center text-lg font-semibold'>
        <Globe2Icon className='size-8'/>
        <span>Easy PPP</span>
    </span>
  )
}
