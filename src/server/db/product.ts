import { CountryGroupDiscountTable, ProductViewTable } from './../../drizzle/schema';
import { db } from "@/drizzle/db";
import { ProductCustomizationTable, ProductTable } from "@/drizzle/schema";
import { CACHE_TAGS, dbCache, getGlobalTag, getIdTag, getUserTag, revalidateDbCache } from "@/lib/cache";
import { removeTrailingSlash } from '@/lib/utils';
import { and, count, eq, gte, inArray, sql } from "drizzle-orm";
import { BatchItem } from 'drizzle-orm/batch';


export async function getProducts(userId:string, {limit}:{limit?:number}={}){
    
    const cacheFn = dbCache(getProductsInternal, {tags: [getUserTag(userId, CACHE_TAGS.products)]})
    return cacheFn(userId, {limit})
}
export async function getProductsInternal(userId:string, {limit}:{limit?:number}){
    
    return await db.query.ProductTable.findMany({
        where: (({clerkUserId}, {eq})=>eq(clerkUserId, userId)),
        limit
    })
}
export async function getProductCount(userId:string){
    const cacheFn = dbCache(getProductCountInternal, {tags: [getUserTag(userId, CACHE_TAGS.products)]})
    return cacheFn(userId)
}

export async function getProductCountInternal(userId:string){
    return await db.$count(ProductTable, eq(ProductTable.clerkUserId, userId))
}

export async function getProductView(userId:string, startDate:Date){
    const cacheFn = dbCache(getProductViewInternal, {
        tags: [getUserTag(userId, CACHE_TAGS.productViews)]
    })
    return cacheFn(userId, startDate)
}
async function getProductViewInternal(userId:string, startDate:Date){
    const counts =  await db.select({productCount: count()}).from(ProductTable)
    .where(and(eq(ProductTable.clerkUserId, userId), gte(ProductTable.createdAt, startDate))).innerJoin(ProductViewTable, eq(ProductTable.id, ProductViewTable.productId))
    return counts[0]?.productCount ?? 0

}

export async function getProduct({id, userId}:{id:string; userId:string}){
    const cacheFnc = dbCache(getProductInternal, {tags: [getUserTag(userId, CACHE_TAGS.products), getIdTag(id, CACHE_TAGS.products)]})
    return cacheFnc({userId, id})
}

export async function getProductInternal({id, userId}:{id:string; userId:string}){
    return await db.query.ProductTable.findFirst({
        where: ({ clerkUserId, id: idCol }, { eq, and }) =>
            and(eq(clerkUserId, userId), eq(idCol, id)),
    })
}

export async function getProductCountryDiscount({productId, userId}: {productId:string, userId:string}){
    const cacheFn = dbCache(getProductCountryDiscountInternal, {
        tags: [getGlobalTag(CACHE_TAGS.countries),getGlobalTag(CACHE_TAGS.countryGroups), getIdTag(productId, CACHE_TAGS.products)]
    })
    return cacheFn({productId, userId})
}

async function getProductCountryDiscountInternal({productId, userId}: {productId:string, userId:string}){
    const product = await getProduct({id:productId, userId})
    if(product == null){
        return []
    }
    const result = await db.query.CountryGroupTable.findMany({
        with:{
            country:{
                columns:{
                    code: true,
                    name: true,
                }
            },
            countryGroupDiscount:{
                columns:{
                    coupon: true,
                    discountPercentage: true
                },
                where:({productId:id}, {eq})=> eq(id, productId),
                limit: 1
            }
        }
    })
    const countryGroup = result.map((group)=>{ 
        return {
            id: group.id,
            name: group.name,
            recommendedDiscountPercentage: group.recommendedDiscountPercentage,
            discount:group.countryGroupDiscount.at(0),
            countries: group.country
        }
    })
    return countryGroup
}

export async function getProductDiscount({productId, code, returningUrl}: {productId:string, code: string, returningUrl:string}){
    const cacheFn = dbCache(getProductDiscountInternal, {
        tags: [getIdTag(productId, CACHE_TAGS.products), getGlobalTag(CACHE_TAGS.countryGroups), getGlobalTag(CACHE_TAGS.countries)]
    })
    return cacheFn({productId, code, returningUrl})
}

async function getProductDiscountInternal({productId, code, returningUrl}: {productId:string, code: string, returningUrl:string}){
    console.log(code, returningUrl)
    const result = await db.query.ProductTable.findFirst({
        where:({url, id},{eq,and})=>and(eq(id, productId), eq(url, removeTrailingSlash(returningUrl) )),
        columns:{
            id: true,
            clerkUserId: true
        },
        with:{
            productCustomization: true,
            countryGroupdiscount:{
                columns:{
                    coupon: true,
                    discountPercentage: true
                },
                with:{
                    countryGroup:{
                        columns:{},
                        with:{
                            country:{
                                columns:{
                                    name: true,
                                    id: true
                                },
                                limit: 1,
                                where:({code:countryCode},{eq})=>eq(countryCode, code)
                            }
                        }
                    }
                }
            }
        }
    })
    const discount = result?.countryGroupdiscount.find(disc=> disc.countryGroup.country.length > 0)
    const country = discount?.countryGroup.country[0]
    console.log("country", country)
    const product = result == null || result.productCustomization == null ? undefined : {
        id: result.id,
        clerkUserId: result.clerkUserId,
        customization: result.productCustomization
    }
    return {
        product,
        country,
        discount: discount == null ? undefined : {
            coupon: discount.coupon,
            percentage: discount.discountPercentage
        }
    }
}
export async function getProductCustomization({productId, userId}: {productId:string, userId:string}){
    const caceFn = dbCache(getProductCustomizationInternal, {
        tags: [getIdTag(productId, CACHE_TAGS.products)]
    })
    return caceFn({productId, userId})
}

async function getProductCustomizationInternal({productId, userId}: {productId:string, userId:string}) {
    const data = await db.query.ProductTable.findFirst({
        where: ({id, clerkUserId}, {eq, and})=> and(eq(id, productId), eq(clerkUserId, userId)),
        with:{
            productCustomization: true
        }
    })
    return data?.productCustomization
    
}

export async function createProduct(values: typeof ProductTable.$inferInsert){
    const [newProduct] = await db.insert(ProductTable).values(values).returning({
        id: ProductTable.id,
        userId: ProductTable.clerkUserId
        
    })
    try {
        await db.insert(ProductCustomizationTable).values({
            productId: newProduct.id
        }).onConflictDoNothing({
            target: ProductCustomizationTable.productId
        })
    } catch (e) {
        console.log(e);
        await db.delete(ProductTable).where(eq(ProductTable.id, newProduct.id))
        
    }
    if(newProduct != null){
        revalidateDbCache({
            tag: CACHE_TAGS.products,
            id: newProduct.id,
            userId: newProduct.userId
        })
    }
    return newProduct
}



export async function deleteProduct(id:string, userId:string){
    const {rowCount} = await db.delete(ProductTable).where(and(eq(ProductTable.id, id), eq(ProductTable.clerkUserId, userId)))
    if(rowCount > 0){
        revalidateDbCache({
            tag: CACHE_TAGS.products,
            id,
            userId
        })
    }
    return rowCount > 0
    
}

export async function updateProduct(values:Partial<typeof ProductTable.$inferInsert>, {id, userId}: {id:string, userId:string}){
    const {rowCount} = await db.update(ProductTable).set(values).where(and(eq(ProductTable.id, id), eq(ProductTable.clerkUserId, userId)))
    if(rowCount > 0){
        revalidateDbCache({
            tag: CACHE_TAGS.products,
            id,
            userId
        })
    }
    return rowCount > 0
}

export async function updateProductCustomization(values: Partial<typeof ProductCustomizationTable.$inferInsert>,{productId, userId}: {productId: string; userId:string}){
    const {rowCount} = await db.update(ProductCustomizationTable).set(values).where(eq(ProductCustomizationTable.productId, productId))
    if(rowCount > 0){
        revalidateDbCache({
            tag: CACHE_TAGS.products,
            id: productId,
            userId
        })
    }
    return rowCount
}

export async function updateProductCountryDiscount(
    insertData: (typeof CountryGroupDiscountTable.$inferInsert)[], 
    deletIds: {countryGroupId: string}[], 
    {productId, userId}:{productId:string, userId:string}){
    const product = await getProduct({id:productId, userId})
    if(product == null){
        return []
    }
        
    const statement: BatchItem<"pg">[] = []

    if(deletIds.length > 0){
        statement.push(
        db.delete(CountryGroupDiscountTable)
            .where(and(eq(CountryGroupDiscountTable.productId, productId),
            inArray(CountryGroupDiscountTable.countryGroupId, deletIds.map(group=> group.countryGroupId))))
        )
    }
    if(insertData.length > 0){
        statement.push(
            db.insert(CountryGroupDiscountTable).values(insertData).onConflictDoUpdate({
                target:[
                    CountryGroupDiscountTable.productId,
                    CountryGroupDiscountTable.countryGroupId
                ],
                set:{
                    coupon:sql.raw(
                        `excluded.${CountryGroupDiscountTable.coupon.name}`
                      ),
                    discountPercentage: sql.raw(
                        `excluded.${CountryGroupDiscountTable.discountPercentage.name}`
                      ),
                }
            })
        )
    }
    if(statement.length > 0){
     await db.batch(statement as [BatchItem<"pg">])
    }
    revalidateDbCache({
        tag: CACHE_TAGS.products,
        userId,
        id: productId
    })

}