"use client"
import { Button } from '@/components/ui/button'
import { DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { clientEnv } from '@/data/env/client'
import { Copy, CopyCheck, CopyX } from 'lucide-react'
import React, { useState } from 'react'

type CopyText = "idle" | "copied" | "error"
export function AddToSiteModal({id}:{id:string}) {
    const [copyText, setCopyText] = useState<CopyText>("idle")
    const code = `<script src='${clientEnv.NEXT_PUBLIC_APP_URL}/api/products/${id}/banner'></script>`
    const displayText = copyText === "copied" ? "Copied" : copyText === "error" ? "Error" : "Copy"
  return (
    <DialogContent className='max-w-max'>
        <DialogHeader>
        <DialogTitle className="text-2xl">Start Earning PPP Sales!</DialogTitle>
        <DialogDescription>
          All you need to do is copy the below script into your site and your
          customers will start seeing PPP discounts!
        </DialogDescription>
        </DialogHeader>
        <pre className="mb-4 overflow-x-auto p-4 bg-secondary rounded max-w-screen-xl text-secondary-foreground">
        <code>{code}</code>
      </pre>
        <div className='flex gap-2 items-center'>
        <Button  onClick={()=>{
            try {
                navigator.clipboard.writeText(code)
                setCopyText("copied")
                setTimeout(()=>{
                    setCopyText("idle")
                },2000)
            } catch (err) {
                console.log(err)
                setCopyText("error")
                setTimeout(()=>{
                    setCopyText("idle")
                },2000)
            }

        }}><CopyIcon text={copyText} /> <span>{displayText}</span></Button>
        <DialogClose asChild>
        <Button type="button" variant="secondary">Close</Button>
        </DialogClose>
        </div>
        
       
    </DialogContent>
  )
}
function CopyIcon({text}:{text: CopyText}){
    switch(text){
        case "idle":
           return <Copy />
            
        case "copied":
           return <CopyCheck />
          
        case "error":
           return <CopyX />

    }
}