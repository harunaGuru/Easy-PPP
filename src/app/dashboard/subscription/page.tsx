import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { getProductCount, getProductView } from '@/server/db/product'
import { getUserSubscription, getUserSubscriptionTier } from '@/server/db/subscription'
import { auth, currentUser } from '@clerk/nextjs/server'
import React from 'react'
import { startOfMonth } from 'date-fns'
import { formatCompactNumber } from '@/lib/formatter'
import { Progress } from '@/components/ui/progress'
import { subscriptionTiers, subscriptionTiersInOrder, TiersNames } from '@/data/subscriptionTiers'
import { Button } from '@/components/ui/button'
import { CheckIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createCancelSession, createCheckoutSession, createCustomerPortalSession } from '@/server/actions/stripe'

export default async function SubscriptionPage() {
    const {userId, redirectToSignIn} = await auth()
    const user = await currentUser()
    if(user == null) return
    const subscription = await getUserSubscription(user.id)
    console.log("subscription", subscription)
    if (!userId) return redirectToSignIn()
    const tier = await getUserSubscriptionTier(userId)
    const count = await getProductCount(userId)
    const maxProduct = tier.maxNumberOfProducts
    const formatedMaxProduct = formatCompactNumber(maxProduct)
    const maxVisit = tier.maxNumberOfVisits
    const formatMaxVisit = formatCompactNumber(maxVisit)
    const date = new Date()
    const startOfMonths = startOfMonth(date)
    const productsView = await getProductView(userId, startOfMonths)
  return (
    <div className="container bg-blue-50/50">
        <h1 className='text-3xl font-semibold mb-4'>Your Subscription</h1>
        <div className='flex flex-col gap-8 mb-8'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <Card className='shadow-none overflow-hidden rounded-3xl'>
            <CardHeader>
                <CardTitle>Monthly Usage</CardTitle>
                <CardDescription>{`${productsView}/${formatMaxVisit} pricing visit this month`}</CardDescription>
            </CardHeader>
            <CardContent>
                <Progress value={(productsView/maxVisit) * 100} />
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Number of Products</CardTitle>
                <CardDescription>{`${count}/${formatedMaxProduct} products created`}</CardDescription>
            </CardHeader>
            <CardContent>
                <Progress value={(count / maxProduct) * 100} />
            </CardContent>
        </Card>
        </div>
        {tier !== subscriptionTiers.Free && (
            <Card>
                <CardHeader>
                    <CardTitle>{`You are currently on the ${tier.name} plan`}</CardTitle>
                    <CardDescription>If you will like to upgrade, cancel or change your payment method use the button below</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={createCustomerPortalSession}>
                       <Button size='lg' className='text-lg rounded-lg'>Manage Subscription</Button>
                    </form>
                </CardContent>
            </Card>
        )}
        </div>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-screen-xl mx-auto mb-4'>
            {subscriptionTiersInOrder.map(subscription=>(
                <PricingCard key={subscription.name} {...subscription} currentTier={tier.name} />
            ))}
        </div>
    </div>
  )
}

function PricingCard({name, priceInCent, maxNumberOfProducts, maxNumberOfVisits, canAcessAnalytics, canCustomizeBanner, canRemoveBranding, currentTier}:(typeof subscriptionTiersInOrder)[number] & {currentTier: TiersNames}){
  const isCurrent = currentTier === name
  return (
    <Card>
        <CardHeader>
            <div className='mb-8 font-semibold text-blue-400'>{name}</div>
            <CardTitle className='font-bold text-xl'>${priceInCent / 1000}/mo</CardTitle>
            <CardDescription>{formatCompactNumber(maxNumberOfVisits)} pricing page visits/mo</CardDescription>
        </CardHeader>
        <CardContent>
            <form action={
                name === "Free" ? 
                createCancelSession : 
                createCheckoutSession.bind(null, name)
                }>
                <Button disabled={isCurrent} className='text-lg w-full rounded-lg'>{isCurrent ? "Current" : "Swap"}</Button>
            </form>
        </CardContent>
        <CardFooter className='flex flex-col gap-4 items-start'>
        <Feature className="font-bold">{maxNumberOfProducts} {maxNumberOfProducts > 1 ? "products" : 'product'}</Feature>
        <Feature>PPP discounts</Feature>
        {canCustomizeBanner && <Feature>Banner Customization</Feature>}
        {canAcessAnalytics && <Feature>Advanced analytics</Feature>}
        {canRemoveBranding && <Feature>Remove Easy PPP branding</Feature>}
        </CardFooter>
    </Card>
  )

}

function Feature({className, children}: {className?:string, children:React.ReactNode}){
    return(
      <div className={cn('flex items-center gap-2', className)}>
        <CheckIcon className="bg-blue-200 stroke-blue-400 size-4 rounded-full p-0.5" />
        <span className="text-xs">{children}</span>
      </div>
    )
  }