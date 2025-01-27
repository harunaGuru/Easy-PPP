import { serverEnv } from "./env/server"

export const subscriptionTiers = {
    Free : {
        name: "Free",
        priceInCent: 0,
        maxNumberOfProducts: 1,
        maxNumberOfVisits: 5000,
        canAcessAnalytics: false,
        canCustomizeBanner: false,
        canRemoveBranding: false,
        stripePriceId: null
    },
    Basic : {
        name: "Basic",
        priceInCent: 19000,
        maxNumberOfProducts: 5,
        maxNumberOfVisits: 10000,
        canAcessAnalytics: true,
        canCustomizeBanner: false,
        canRemoveBranding: true,
        stripePriceId: serverEnv.STRIPE_BASIC_PLAN_PRICE_ID
    },
    Standard : {
        name: "Standard",
        priceInCent: 49000,
        maxNumberOfProducts: 30,
        maxNumberOfVisits: 100000,
        canAcessAnalytics: true,
        canCustomizeBanner: true,
        canRemoveBranding: true,
        stripePriceId: serverEnv.STRIPE_STANDARD_PLAN_PRICE_ID
    },
    Premium : {
        name: "Premium",
        priceInCent: 99000,
        maxNumberOfProducts: 50,
        maxNumberOfVisits: 1000000,
        canAcessAnalytics: true,
        canCustomizeBanner: true,
        canRemoveBranding: true,
        stripePriceId: serverEnv.STRIPE_PREMIUM_PLAN_PRICE_ID
    },
} as const

export const subscriptionTiersInOrder = [
    subscriptionTiers.Free,
    subscriptionTiers.Basic,
    subscriptionTiers.Standard,
    subscriptionTiers.Premium
] as const

export type TiersNames = keyof typeof subscriptionTiers
export type PaidTierNames = Exclude<TiersNames, "Free">
