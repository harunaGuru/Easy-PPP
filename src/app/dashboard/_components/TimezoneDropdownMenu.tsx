import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { createUrl } from '@/lib/utils'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import Link from 'next/link'
import React from 'react'

export function TimezoneDropdownMenu({ searchParams, timeZone}:{ searchParams:Record<string, string>, timeZone: string}) {
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant='outline'>{timeZone}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuItem>
                <Link href={createUrl("/dashboard/analytics", searchParams, {timeZone: "UTC"})}>UTC</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Link href={createUrl("/dashboard/analytics", searchParams, {timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone})}>{Intl.DateTimeFormat().resolvedOptions().timeZone}</Link>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}
