import { Asterisk } from 'lucide-react'
import React from 'react'

export  function Required() {
  return (
    <span className='inline-block align-top text-red-600'>
        <Asterisk className='size-3' />
    </span>
  )
}
