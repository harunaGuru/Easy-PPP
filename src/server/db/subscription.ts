import { subscriptionTiers, subscriptionTiersInOrder } from "@/data/subscriptionTiers";
import { db } from "@/drizzle/db";
import { UserSubscriptionTable } from "@/drizzle/schema";
import { CACHE_TAGS, dbCache, getUserTag, revalidateDbCache } from "@/lib/cache";
import { SQL } from "drizzle-orm";

export async function createUserSubscription(data: typeof UserSubscriptionTable.$inferInsert){
    const [newUser] =  await db.insert(UserSubscriptionTable).values(data).onConflictDoNothing({
        target: UserSubscriptionTable.clerkUserId
    }) .returning({
        id: UserSubscriptionTable.id,
        userId: UserSubscriptionTable.clerkUserId,
      })
      if(newUser !=null){
        revalidateDbCache({
            tag: CACHE_TAGS.subscription,
            userId: newUser.userId,
            id: newUser.id
        })
      }
      return [newUser]
}

export async function updateUserSubscription(eq:SQL, values:Partial<typeof UserSubscriptionTable.$inferInsert>){
  const [userSubscription] = await db.update(UserSubscriptionTable).set(values).where(eq).returning({
    id: UserSubscriptionTable.id,
    userId: UserSubscriptionTable.clerkUserId
  })
  if(userSubscription != null){
    revalidateDbCache({
      tag:CACHE_TAGS.subscription,
      userId:userSubscription.userId,
      id: userSubscription.id
    })
  }
}

export async function getUserSubscriptionTier(userId:string){
  const subscription = await getUserSubscriptionTierInternal(userId)
  if(subscription == null) throw new Error("user do not have a subscription")
  const tier = subscriptionTiers[subscription.tier]
  return tier
}

async function getUserSubscriptionTierInternal(userId:string){
  const subcription = await db.query.UserSubscriptionTable.findFirst({
    where:({clerkUserId}, {eq})=>eq(clerkUserId, userId),
    columns:{
      tier: true
    }
  })
  return subcription
}

export async function getUserSubscription(userId:string){
  const cacheFn = dbCache(getUserSubscriptionInternal, {
    tags: [getUserTag(userId, CACHE_TAGS.subscription)]
  })
  return cacheFn(userId)
}

async function getUserSubscriptionInternal(userId:string){
  return await db.query.UserSubscriptionTable.findFirst({
    where:({clerkUserId}, {eq})=>eq(clerkUserId, userId)
  })
}
export async function getTierByPriceId(priceId:string){
  return subscriptionTiersInOrder.find(t=> t.stripePriceId === priceId)
  
}