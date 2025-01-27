import { auth } from '@clerk/nextjs/server';
import React from 'react'
import { NoPermissionCard } from './NoPermissionCard';

export async function HasPermission({children, renderFallBack = false, renderFallBackText, permission}:{
    permission: (userId:string | null)=>Promise<boolean | undefined>;
    renderFallBackText?: string;
    renderFallBack?: boolean;
    children: React.ReactNode
}) {
    const {userId} = await auth()
    const hasPermission = await permission(userId)
    if(hasPermission) return children
    if(renderFallBack) return <NoPermissionCard>{renderFallBackText}</NoPermissionCard>
    return null
}
