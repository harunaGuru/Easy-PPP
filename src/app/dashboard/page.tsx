import { Button } from "@/components/ui/button"
import { getProducts } from "@/server/db/product";
import { auth } from "@clerk/nextjs/server";
import { ArrowRight, PlusIcon } from "lucide-react";
import Link from "next/link"
import { NoProduct } from "./_components/NoProduct";
import { ProductGrid } from "./_components/ProductCard";
import { CHART_INTERALS, getViewsByDayChartData } from "@/server/db/productView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ViewByDayChart } from "./_components/chart/ViewByDayChart";


export default async function DashboardPage() {
  const {userId, redirectToSignIn} = await auth()
  if (!userId) return redirectToSignIn()
  const interval = CHART_INTERALS.last30Days
  const timezone = new Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
  const products = await getProducts(userId, {limit: 6})
  if(products.length ===  0) return <NoProduct />
  return(
    <div className="container bg-blue-50/50 min-h-screen">
    <section>
      <div className="flex justify-between">
        <Header headerName="Products" href="/dashboard/products" />
        <Button asChild>
          <Link href="/dashboard/products/new" className="flex items-center gap-2">
          <PlusIcon className="size-4" />
          <span>New Product</span>
          </Link>
        </Button>
      </div>
      <ProductGrid products={products} />
    </section>
    <section className="mt-6">
    <Header headerName="Analytics" href="/dashboard/analytics" />
    <ViewsByDayCard  interval={interval} userId={userId} timezone={timezone} />
    </section>
    </div>
  )
}

function Header({headerName, href}:{headerName:string; href:string}){
  return(
        <Link href={href} className="font-semibold text-lg mb-6 flex gap-2 items-center group transition-transform">
        {headerName}
        <ArrowRight className="size-4 group-hover:translate-x-2"/>
        </Link>
  )
}

async function ViewsByDayCard(
  props: Parameters<typeof getViewsByDayChartData>[0]
){
  const chartData = await getViewsByDayChartData(props)
  return (
      <Card>
          <CardHeader>
              <CardTitle>Views Per Day</CardTitle>
          </CardHeader>
          <CardContent>
              <ViewByDayChart chartData={chartData} />
          </CardContent>
      </Card>
  )
}