import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const serverEnv = createEnv({
    emptyStringAsUndefined: true,
    server:{
        CLERK_SECRET_KEY : z.string(),
        DATABASE_URL : z.string().url(),
        SIGNING_SECRET : z.string(),
        STRIPE_SECRET_KEY: z.string(),
        STRIPE_PREMIUM_PLAN_PRICE_ID: z.string(),
        STRIPE_STANDARD_PLAN_PRICE_ID: z.string(),
        STRIPE_BASIC_PLAN_PRICE_ID: z.string(),
        STRIPE_WEBHOOK_SECRET:z.string(),
        TEST_COUNTRY: z.string()
    },
    experimental__runtimeEnv: process.env
})