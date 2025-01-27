import { getProductCount } from "./product";
import { getUserSubscriptionTier } from "./subscription";

export async function canAccessAnalytics(userId:string | null){
    if(userId !=null){
        const tier = await getUserSubscriptionTier(userId)
        return tier.canAcessAnalytics
    }
}

export async function canRemoveBranding(userId:string | null) {
    if(userId != null){
        const tier = await getUserSubscriptionTier(userId)
        return tier.canRemoveBranding
    }
}

export async function canCustomizeBanner(userId:string | null){
    if(userId != null){
        const tier = await getUserSubscriptionTier(userId)
        return tier.canCustomizeBanner
    }
}


export async function cancreateProduct(userId: string | null){
    if(userId != null){
        const count = await getProductCount(userId)
        const tier = await getUserSubscriptionTier(userId)
        return tier.maxNumberOfProducts > count
    }
    return false
}