import { HasPermission } from '@/components/HasPermission'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { canAccessAnalytics } from '@/server/db/permission'
import { CHART_INTERALS, getViewsByCountryChartData, getViewsByDayChartData, getViewsByPPPChartData } from '@/server/db/productView'
import { auth } from '@clerk/nextjs/server'
import React from 'react'
import { ViewByCountryChart } from '../_components/chart/ViewByCountryChart'
import { ViewByPPPChart } from '../_components/chart/ViewByPPPChart'
import { ViewByDayChart } from '../_components/chart/ViewByDayChart'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { createUrl } from '@/lib/utils'
import { ProductDropdownMenu } from '../_components/ProductDropdownMenu'
import { ChevronDownIcon } from 'lucide-react'
import { TimezoneDropdownMenu } from '../_components/TimezoneDropdownMenu'

export default async function AnalyticPage(props:{
    searchParams:{
        interval?: string;
        timezone?:string;
        productId?:string
    }
}) {
    const searchParams = await props.searchParams; 
    console.log("searchParams", searchParams)
    const interval =  CHART_INTERALS[ searchParams.interval as keyof typeof CHART_INTERALS]  ?? CHART_INTERALS.last7Days
    const {userId, redirectToSignIn} = await auth() 
    if(userId == null){
        return redirectToSignIn()
    }
    const timezone = searchParams.timezone || "UTC"
    const productId = searchParams.productId 
  return (
    <div className='container'>
        <div className='flex justify-between items-baseline mb-6'>
            <h1 className='text-3xl font-semibold'>Analytics</h1>
            <HasPermission permission={canAccessAnalytics}>
                <div className='flex gap-2 items-center'>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                {interval.label}
                                <ChevronDownIcon className='size-4 ml-2'/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {Object.entries(CHART_INTERALS).map(([key, value])=>(
                                <DropdownMenuItem asChild key={key}>
                                    <Link href={createUrl("/dashboard/analytics", searchParams, {interval: key})}>{value.label}</Link>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                        <ProductDropdownMenu userId={userId} searchParams={searchParams} selectedProductId={productId} />
                        <TimezoneDropdownMenu searchParams={searchParams} timeZone={timezone} />
                    </DropdownMenu>
                </div>
            </HasPermission>
        </div>
    <HasPermission permission={canAccessAnalytics} renderFallBack>
        <div className='flex flex-col gap-8'>
        <ViewsByDayCard productId={ searchParams.productId} interval={interval} userId={userId} timezone={timezone} />
        <ViewsByPPPCard productId={ searchParams.productId} interval={interval} userId={userId} timezone={timezone} />
        <ViewsByCountryCard productId={ searchParams.productId} interval={interval} userId={userId} timezone={timezone} />
        </div>
    </HasPermission>
    </div>
  )
}

async function ViewsByDayCard(
    props: Parameters<typeof getViewsByDayChartData>[0]
){
    const chartData = await getViewsByDayChartData(props)
    return (
        <Card>
            <CardHeader>
                <CardTitle>Visitors Per Day</CardTitle>
            </CardHeader>
            <CardContent>
                <ViewByDayChart chartData={chartData} />
            </CardContent>
        </Card>
    )
}
async function ViewsByPPPCard(
    props: Parameters<typeof getViewsByPPPChartData>[0]
){
    const chartData = await getViewsByPPPChartData(props)
    return (
        <Card>
            <CardHeader>
                <CardTitle>Visitors Per PPP Group</CardTitle>
            </CardHeader>
            <CardContent>
                <ViewByPPPChart chartData={chartData} />
            </CardContent>
        </Card>
    )
}
async function ViewsByCountryCard(
    props: Parameters<typeof getViewsByCountryChartData>[0]
){
    const chartData = await getViewsByCountryChartData(props)
    return (
        <Card>
            <CardHeader>
                <CardTitle>Visitors Per Country</CardTitle>
            </CardHeader>
            <CardContent>
                <ViewByCountryChart chartData={chartData} />
            </CardContent>
        </Card>
    )
}