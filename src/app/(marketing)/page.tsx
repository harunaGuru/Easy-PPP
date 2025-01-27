import { Button } from "@/components/ui/button"
import { subscriptionTiersInOrder } from "@/data/subscriptionTiers"
import { formatCompactNumber } from "@/lib/formatter"
import { cn } from "@/lib/utils"
import { ArrowRight, CheckIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { BrandLogo } from "../_components/BrandLogo"
import { SignUpButton } from "@clerk/nextjs"

export default function HomePage() {
  return(
    <>
    <section className="min-h-screen flex flex-col justify-center text-center items-center text-balance bg-[radial-gradient(rgb(247,218,232),hsl(var(--background))_50%)]">
      <h1 className="text-7xl font-bold mb-6 tracking-wider ">Price Smarter, Sell Bigger!</h1>
      <h2 className="flex flex-col text-xl tracking-widest leading-8 mt-4">
      <span>Optimise your product pricing accross countries to maximize sales.</span>  
      <span>Capture 80% of the untapped market with location-based dynamic pricing</span>
      </h2>
      <SignUpButton>
        <Button asChild className="mt-3 flex gap-2 rounded-lg p-6 text-lg">
          <span>
          Get started for free
          <ArrowRight />
          </span>
        </Button>
      </SignUpButton>
    </section>
    <section className="py-14 container bg-[hsl(220,26%,14%)] text-primary-foreground flex flex-col gap-10 px-8">
      <span className=" text-center text-balance text-3xl font-semibold">Trusted by the top modern companies</span>
      <PatnerLogo />
    </section>
    <section id="price" className="flex flex-col pt-3 bg-blue-50/50 pb-10">
    <h2 className="font-semibold text-center text-3xl">Pricing software which pays for itself 20x over</h2>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 container mt-5 ">
      {subscriptionTiersInOrder.map(tier=>(
        <PricingCard key={tier.name} {...tier} />
      ))}

    </div>
    </section>
    <footer className="bg-primary text-primary-foreground  rounded-t-[3rem] py-10 px-8">
      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-4 lg:gap-16">
        <div className="flex flex-col gap-3 items-start">
          <BrandLogo />
          <span className="text-xs text-blue-100/90">©2024, ParityDeals | All Rights Reserved.</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3">
            {footerlinks.map(footer=>(
                <FooterGrid key={footer.title} subs={footer.subs} />
            ))}
        </div>
      </div>

    </footer>
    </>

  
  )
}

const footerlinks = [
  {
    title: "1a",
    subs: [
      {
        title: 'Help',
        links: ['PPP discounts', 'Holiday discounts', 'Time based discounts', 'Discount API', 'Add banner to site', 'Contact']
      },
      {
        title: 'Solutions',
        links:['Newsletter','SaaS business','Online courses', 'Info products']
      }
    ]
  },
  {
    title: '2bc',
    subs:[
      {
        title: 'Features',
        links:['Holiday discounts', 'PPP discounts', 'Time based discounts', 'Benefits of geographical', 'pricing?']
      },
      {
        title: 'Tools',
        links: ['Salary converter', 'Coupon generator', 'Stripe app', 'SaaS pricing calculator', 'Buying power calculator']
      },
      {
        title: 'Company',
        links: ['Affiliate', 'Twitter', 'Terms of service', 'Privacy']
      }
    ]
  },
  {
    title: '3vd',
    subs: [
      {
        title: 'Integrations',
        links: ['Lemon Squeezy', 'Gumroad', 'Stripe', 'Chargebee', 'Whop', 'Paddle', 'Polar']
      },
      {
        title: 'Tutorials',
        links: ['Any website', 'kajabi', 'Podia', 'Circle.so', 'Beehiiv', 'Framer', 'Substack']
      }
    ]
  }
]

function FooterGrid({subs}: { subs: {title: string, links:string[]}[]}){
  return (
    <div className="flex flex-col gap-4">
      {subs.map(sub=>(
        <div key={sub.title}>
        <h3  className="font-semibold text-lg">{sub.title}</h3>
       <div className="flex flex-col gap-2">
        {sub.links.map((link, index)=>(
          <Link className="text-sm text-blue-100/90" key={`${index}-${link}`} href='#'>{link}</Link>
        ))}
       </div>
        </div>

      ))}
      
    </div>
  )
}

function PricingCard({name, priceInCent,maxNumberOfProducts,maxNumberOfVisits, canAcessAnalytics, canCustomizeBanner, canRemoveBranding}:(typeof subscriptionTiersInOrder)[number]){
  const isPopular = name === "Standard";
  return (
    <div className={cn('bg-background text-foreground rounded-lg relative py-4 shadow-lg px-3 overflow-hidden', isPopular ? "border-blue-200 border-2": "")}>
      {isPopular && <div className="absolute top-24 text-center py-1 px-10 -right-8 origin-top-right bg-blue-50/50 text-blue-300 rotate-45 ">Most Popular</div>}
      <h2 className="text-accent capitalize text-sm mb-6">{name}</h2>
      <div className="flex flex-col leading-6">
      <h3 className="font-bold">${priceInCent / 1000}/mo</h3>
      <span className="text-xs opacity-45" >{formatCompactNumber(maxNumberOfVisits)} pricing page visits/mo</span>
      </div>
      <SignUpButton>
      <Button variant={isPopular ? "accent" : "default"}  className="w-full my-4">
        Get started
      </Button>
      </SignUpButton>
      <div className="flex flex-col gap-4">
        <Feature className="font-bold">{maxNumberOfProducts} {maxNumberOfProducts > 1 ? "products" : 'product'}</Feature>
        <Feature>PPP discounts</Feature>
        {canCustomizeBanner && <Feature>Banner Customization</Feature>}
        {canAcessAnalytics && <Feature>Advanced analytics</Feature>}
        {canRemoveBranding && <Feature>Remove Easy PPP branding</Feature>}

      </div>
    </div>
  )
}
function Feature({className, children}: {className?:string, children:React.ReactNode}){
  return(
    <div className={cn('flex items-center gap-2', className)}>
      <CheckIcon className="bg-blue-200 stroke-blue-400 size-4 rounded-full p-0.5" />
      <span className="text-xs">{children}</span>
    </div>
  )
}
function PatnerLogo(){
  return<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <Link href='https://www.paritydeals.com/integrations/lemon-squeezy/' ><Squezy /></Link>
    <Link href='https://www.paritydeals.com/integrations/stripe/' ><Stripe /></Link>
    <Link href='https://www.paritydeals.com/integrations/lemon-squeezy/' ><Squezy /></Link>
    <Link href='https://www.paritydeals.com/integrations/stripe/' ><Stripe /></Link>
    <Link href='https://www.paritydeals.com/integrations/lemon-squeezy/' ><Squezy /></Link>
    <Link href='https://www.paritydeals.com/integrations/stripe/' ><Stripe /></Link>
    <Link href='https://www.paritydeals.com/integrations/lemon-squeezy/' ><Squezy /></Link>
    <Link href='https://www.paritydeals.com/integrations/stripe/' ><Stripe /></Link>
    <Link href='https://www.paritydeals.com/integrations/lemon-squeezy/' ><Squezy /></Link>
    <Link href='https://www.paritydeals.com/integrations/stripe/' ><Stripe /></Link>
  

  </div>
}

function Squezy(){
  return(
    <div className="flex gap-2 text-primary-foreground items-center">
   <Image src='/squezy.svg' alt="clerk logo" width={60} height={60} />
   <span className="font-semibold text-3xl">Squezy</span>
    </div>
  )
}
function Stripe(){
  return(
    <div className="flex gap-2 text-primary-foreground items-center">
   <Image src='/stripe-logo.svg' alt="clerk logo" width={60} height={60} />
   <span className="font-semibold text-3xl">Stripe</span>
    </div>
  )
}