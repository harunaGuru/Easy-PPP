import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import Link from 'next/link'

export function NoPermissionCard({children = "You donot have permission to perform this action. Try upgrading your account to access this feature"}:{children?: React.ReactNode}) {
  return (
    <Card>
        <CardHeader>
            <CardTitle className='text-3xl'>Permission Denied</CardTitle>
        </CardHeader>
        <CardContent>
            <CardDescription>{children}</CardDescription>
        </CardContent>
        <CardFooter>
            <Button asChild>
                <Link href='dashboard/subscription'>Upgrade Account</Link>
            </Button>
        </CardFooter>
    </Card>
  )
}
