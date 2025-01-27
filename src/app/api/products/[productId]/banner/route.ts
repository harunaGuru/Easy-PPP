import { Banner } from "@/app/dashboard/_components/Banner";
import { serverEnv } from "@/data/env/server";
import { canCustomizeBanner, canRemoveBranding } from "@/server/db/permission";
import { getProductDiscount } from "@/server/db/product";
import { createProductView } from "@/server/db/productView";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { NextRequest } from "next/server";
import { createElement } from "react";

// export const runtime = "edge"

function getCountryCode(req: NextRequest) {
    console.log(req)
    let code;
    if(process.env.NODE_ENV==='development'){
        code = serverEnv.TEST_COUNTRY
    }
    return code
}

export async function GET(req: NextRequest, {params}: {params:{productId:string}}){
    const {productId} = await params
    const headersList = await headers()
    const returningUrl = headersList.get("referer") ?? headersList.get('origin')
    if(returningUrl == null ) return notFound()
    const code = getCountryCode(req)
    if(code == null ) return notFound()
    const {product, country, discount} = await getProductDiscount({productId, code, returningUrl})
    // console.log(product)
    // console.log(country)
    // console.log(discount)
    if(product == null || discount == null || country == null ) return notFound()
    const customizeBanner = await canCustomizeBanner(product.clerkUserId)
    if(!customizeBanner) return notFound()
    await createProductView({productId:product.id, countryId: country?.id, userId: product.clerkUserId})
    return new Response(await getJavascript(product, country, discount, await canRemoveBranding(product.clerkUserId)), {headers: { "content-type": "text/javascript" }})
}

async function getJavascript (
    product: {
    customization: {
        backgroundColor: string;
        classPrefix: string | null;
        locationMessage: string;
        fontSize: string;
        bannerContainer: string;
        textColor: string;
        isSticky: boolean;
    }
}, country: {
    name: string;
}, discount: {
    coupon: string;
    percentage: number;
}, canRemoveBranding:boolean | undefined) {
    const {renderToStaticMarkup} = await import('react-dom/server')
    return`
        const banner = document.createElement("div");
        banner.innerHTML = '${renderToStaticMarkup(createElement(Banner, {
        canRemoveBranding,
        message: product.customization.locationMessage,
        mappings: {
            coupon: discount.coupon,
            country: country.name,
            discount: (discount.percentage * 100).toString(),
        },
        customization: {
            backgroundColor: product.customization.backgroundColor,
            classPrefix: product.customization.classPrefix,
            locationMessage: product.customization.locationMessage,
            fontSize: product.customization.fontSize,
            textColor:product.customization.textColor,
            isSticky: product.customization.isSticky,
        }
    }))}';
    document.querySelector("${product.customization.bannerContainer}").prepend(...banner.children);
    `.replace(/(\r\n|\n|\r)/g, "")
}