'use server'
import { auth } from '@clerk/nextjs/server'
import {createProduct as createProductDb, deleteProduct as deleteProductDb, updateProduct as updateProductDb, updateProductCountryDiscount as updateProductCountryDiscountDb, updateProductCustomization as updateProductCustomizationDb} from '../db/product'
import { CountryDiscountSchema, ProductCustomizationSchema, productDetailsSchema } from "@/data/schema"
import { redirect } from 'next/navigation'
import { z } from "zod"


export async function createProduct(unsafedData: z.infer<typeof productDetailsSchema>):Promise<{errors: boolean; message: string}>{
 
    const {userId} = await auth()  
    const {data, success} = productDetailsSchema.safeParse({...unsafedData})
    if(!success || userId == null){
        return {
            errors: true,
            message: 'There was an error creating your Product'
          }
    }
   
    //mutate data
    const {id} = await createProductDb({...data, clerkUserId:userId })
    redirect(`/dashboard/products/${id}/edit?tab=countries`)

}

export async function updateProductCustomization(unsafedData: z.infer<typeof ProductCustomizationSchema>, productId: string){
    const {userId} = await auth()  
    const {data, success} = ProductCustomizationSchema.safeParse({...unsafedData})
    const errMessage = 'There was an error creating your Product customization'
    if(!success || userId == null){
        return {
            errors: true,
            message: errMessage
          }
    }
    const isSuccess = await updateProductCustomizationDb(data, {productId, userId})
    return {
        errors: !isSuccess,
        message: isSuccess ? "successfully updated product customization" : errMessage
    }
}

export async function updateProduct(id:string, unsafedData:z.infer<typeof productDetailsSchema>){
    const {userId} = await auth()  
    const {data, success} = productDetailsSchema.safeParse({...unsafedData})
    const errMessage = 'There was an error updating this Product'
    if(!success || userId == null){
        return {
            errors: true,
            message: errMessage
          }
    }
    const isSuccess = await updateProductDb(data, {userId, id})
    return {
        errors: !isSuccess,
        message: isSuccess ? "successfully updated the product" : errMessage
    }
}

export async function updateProductCountryDiscount(productId:string, unsafedData:z.infer<typeof CountryDiscountSchema>){
    const {userId} = await auth()  
    const {data, success} = CountryDiscountSchema.safeParse({...unsafedData})
    const errMessage = 'There was an error updating this Product Discounts'
    if(!success || userId == null || productId == null){
        return {
            errors: true,
            message: errMessage
          }
    }
    const insertData:{
        countryGroupId: string;
        productId: string;
        coupon: string;
        discountPercentage: number;
    }[] = []
    const deletIds: { countryGroupId: string}[] = []
    data.groups.map(group=>{
        if(group.coupon != null && group.coupon.length > 0 && group.discountPercentage != null && group.discountPercentage > 0){
            insertData.push({
                countryGroupId: group.countryGroupId,
                coupon: group.coupon,
                discountPercentage: group.discountPercentage /100,
                productId: productId
            })
        } else{
            deletIds.push({countryGroupId: group.countryGroupId})
        }
    })
    await updateProductCountryDiscountDb(insertData, deletIds, {productId, userId})
    return{errors: false, message: "Country discounts saved"}

}
export async function deleteProduct(id:string){
    const {userId} = await auth()
    const errMessage = 'There was an error deleting this Product'
    if(userId == null){
        return {
            errors: true,
            message: errMessage
        }
    }
    const isSuccess = await deleteProductDb(id, userId)
    return {
        errors: !isSuccess,
        message: isSuccess ? "successfully deleted the product" : errMessage
    }
}