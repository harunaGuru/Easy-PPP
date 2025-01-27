import { removeTrailingSlash } from "@/lib/utils"
import { z } from "zod"

export const productDetailsSchema = z.object({
  name: z.string().min(2, {
    message: "Product Name must be at least 2 characters.",
  }),
  url: z.string().url().transform(n=> removeTrailingSlash(n)),
  description: z.string().optional()
})

export const CountryDiscountSchema = z.object({
  groups: z.array(
    z.object({
      discountPercentage: z.number().min(1).max(100).or(z.nan()).transform(n=>(isNaN(n) ? undefined : n)).optional(),
      coupon: z.string().optional(),
      countryGroupId: z.string().min(1, "Required")
    }).refine((val)=>{
      const hasCoupon = val.coupon != null && val.coupon.length > 0
      const hasDiscount = val.discountPercentage != null
      return !(hasCoupon && !hasDiscount)
    }, {
      message: "A discount is required if a coupon code is provided",
      path: ["root"]
    })
  )
  
})

export const ProductCustomizationSchema = z.object({
        backgroundColor: z.string().min(1, "Required"),
        classPrefix: z.string().optional(),
        locationMessage: z.string().min(1, "Required"),
        fontSize: z.string().min(1, "Required"),
        bannerContainer: z.string().min(1, "Required"),
        textColor: z.string().min(1, "Required"),
        isSticky: z.boolean()
})