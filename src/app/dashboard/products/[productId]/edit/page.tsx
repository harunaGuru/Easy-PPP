import CountryDiscountForm from '@/app/dashboard/_components/form/CountryDiscountForm'
import { ProductCustomizationForm } from '@/app/dashboard/_components/form/ProductCustomizationForm'
import { ProductForm } from '@/app/dashboard/_components/form/ProductForm'
import { PageGrid } from '@/app/dashboard/_components/PageGrid'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { canRemoveBranding as canRemove, canCustomizeBanner as canCustomize } from '@/server/db/permission'
import { getProduct, getProductCountryDiscount, getProductCustomization } from '@/server/db/product'
import { auth } from '@clerk/nextjs/server'
import { notFound } from 'next/navigation'
import React from 'react'


export default async function EditPage({params, searchParams}:{params:Promise<{productId:string}>, searchParams:Promise<{tab?:string}>}) {
    const {userId, redirectToSignIn} = await auth()
    // :{tab="details"}
    const {productId} = await params
    const {tab='details'} = await searchParams
    if (!userId) return redirectToSignIn()
    const product = await getProduct({id:productId, userId})
    if(product == null) return notFound()
    const countryGroups = await getProductCountryDiscount({productId, userId})
    const canRemoveBranding = await canRemove(userId)
    const canCustomizeBanner = await canCustomize(userId)
    const productCustomization = await getProductCustomization({productId, userId})
    if(productCustomization == null) return notFound()
 
  return (
    <div className='bg-blue-50/50'>
        <PageGrid href='/dashboard' title="Edit Product">
        <Tabs defaultValue={tab}>
            <TabsList className='bg-background/60'>
                <TabsTrigger value='details'>Details</TabsTrigger>
                <TabsTrigger value='countries'>Country</TabsTrigger>
                <TabsTrigger value='customization'>Customization</TabsTrigger>
            </TabsList>
            <TabsContent value='details'>
                <Card>
                    <CardHeader>Product Details</CardHeader>
                    <CardContent className='space-y-2'>
                        <ProductForm product={product} />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value='countries'>
                <Card>
                    <CardHeader>
                        <CardTitle>Country Discount</CardTitle>
                        <CardDescription>Leave the discount field blank if you do not want to display for any specific parity group</CardDescription>
                        </CardHeader>
                    <CardContent>
                        <CountryDiscountForm countryGroups={countryGroups} productId={productId}/>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value='customization'>
                <Card>
                    <CardHeader>
                        <CardTitle>Customization</CardTitle>
                    </CardHeader>
                    {/* <Banner /> */}
                    <CardContent>
                    <ProductCustomizationForm customization={productCustomization} canRemoveBranding={canRemoveBranding} canCustomizeBanner={canCustomizeBanner}/>
                    </CardContent>
                </Card>

            </TabsContent>
        </Tabs>
        </PageGrid>
    </div>
  )
}


