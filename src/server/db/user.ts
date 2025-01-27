import { db } from "@/drizzle/db";
import { ProductTable, UserSubscriptionTable } from "@/drizzle/schema";
import { CACHE_TAGS, revalidateDbCache } from "@/lib/cache";
import { eq } from "drizzle-orm";


export async function deleteUser(userId: string){
    const [userSubscriptions, products] = await db.batch([
        db.delete(UserSubscriptionTable).where(eq(UserSubscriptionTable.clerkUserId, userId)).returning({
            id: UserSubscriptionTable.id
        }),
        db.delete(ProductTable).where(eq(ProductTable.clerkUserId, userId)).returning({
            id: ProductTable.id
            
        })
       
    ])
   userSubscriptions.forEach(sub=>{
    revalidateDbCache({
        tag: CACHE_TAGS.subscription,
        id: sub.id,
        userId: userId
    })
   })
   products.forEach(prod=>{
    revalidateDbCache({
        tag: CACHE_TAGS.products,
        id: prod.id,
        userId: userId
    })
   })
    return [userSubscriptions, products]
}