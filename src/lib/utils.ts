import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function removeTrailingSlash(path: string) {
  return path.replace(/\/$/, "")
}

export function createUrl(href:string, oldSearchParams:Record<string, string>, newSearchParams:Record<string, string | undefined>){

  const params = new URLSearchParams(oldSearchParams)
  Object.entries(newSearchParams).forEach(([key, value])=>{
    if(value == undefined){
      params.delete(key)
    }else{
      params.set(key, value)
    }
  })
  return `${href}?${params.toString()}`
}

