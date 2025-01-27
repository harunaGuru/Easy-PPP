import { db } from "@/drizzle/db";
import { CountryGroupTable, CountryTable, ProductTable, ProductViewTable } from "@/drizzle/schema";
import { CACHE_TAGS, dbCache, getGlobalTag, getIdTag, getUserTag, revalidateDbCache } from "@/lib/cache";
import { startOfDay, subDays } from "date-fns";
import { tz } from "@date-fns/tz"
import { and, count, desc, eq, gte, SQL, sql } from "drizzle-orm";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'short',
    timeZone: 'UTC'
})
const monthFormatter = new Intl.DateTimeFormat(undefined,{
    year: "2-digit",
    month: 'short',
    timeZone: "UTC"
})

export const CHART_INTERALS ={
    last7Days:{
        startDate: subDays(new Date(), 7),
        label: "last 7 Days",
        sql: sql `GENERATE_SERIES(current_date - 7, current_date, '1 day':: interval) as series`,
        dateGrouper: (col:SQL | SQL.Aliased)=> sql<string>`DATE(${col})`.inlineParams(),
        dateFormatter: (date:Date)=> dateFormatter.format(date)
    },
    last30Days:{
        startDate: subDays(new Date(), 30),
        label: "last 30 Days",
        sql: sql`GENERATE_SERIES(current_date - 30, current_date, '1 day':: interval) as series`,
        dateGrouper: (col:SQL | SQL.Aliased)=> sql<string>`DATE(${col})`.inlineParams(),
        dateFormatter: (date:Date)=> dateFormatter.format(date)
    },
    last365Days:{
        startDate: subDays(new Date(), 365),
        label: "last 365 Days",
        sql: sql`GENERATE_SERIES(date_trunc('month', current_date - 365), date_trunc('month', current_date), '1 month':: interval) as series`,
        dateGrouper: (col:SQL | SQL.Aliased)=> sql<string>`date_trunc('month', ${col})`.inlineParams(),
        dateFormatter: (date:Date)=> monthFormatter.format(date)
    },
} as const

export async function createProductView({productId, countryId, userId}: {productId:string, countryId: string, userId:string }){
   const [newRow] = await db.insert(ProductViewTable).values({
    productId, countryId, visitedAt: new Date()
   }).returning({
    id: ProductViewTable.id
   })
   if(newRow != null) {
    revalidateDbCache({
        tag: CACHE_TAGS.productViews,
        id: newRow.id,
        userId
    })
   }
}

export async function getViewsByCountryChartData({
    interval, timezone, productId, userId
}:{
    interval: (typeof CHART_INTERALS)[keyof typeof CHART_INTERALS];
    userId: string;
    productId?: string;
    timezone: string;
}){
    const cacheFn = dbCache(getViewsByCountryChartDataInternal, {
        tags: [getUserTag(userId, CACHE_TAGS.productViews), getGlobalTag(CACHE_TAGS.countries), productId == null ? getUserTag(userId, CACHE_TAGS.products) : getIdTag(productId, CACHE_TAGS.products)]
    })
    return cacheFn({interval, timezone, productId, userId})
}

async function getViewsByCountryChartDataInternal({
    interval, timezone, productId, userId
}:{
    interval: (typeof CHART_INTERALS)[keyof typeof CHART_INTERALS];
    userId: string;
    productId?: string;
    timezone: string;
}){
   const startDate = startOfDay(interval.startDate, {in: tz(timezone)})
   const productSq =  productSubquery(userId, productId)
   return await db.with(productSq).select({
    countryName: CountryTable.name,
    countryCode: CountryTable.code,
    views: count(ProductViewTable.visitedAt)
   }).from(ProductViewTable)
   .innerJoin(productSq, eq(ProductViewTable.productId, productSq.id))
   .innerJoin(CountryTable, eq(ProductViewTable.countryId, CountryTable.id))
   .where(gte(sql`${ProductViewTable.visitedAt} AT TIME ZONE ${timezone}`.inlineParams(), startDate ))
   .groupBy(({countryCode,countryName})=>[countryCode, countryName])
   .orderBy(({views})=> desc(views))
   .limit(25)
}


function productSubquery(userId:string, productId?:string){
   return db.$with("sq").as(
        db.select().from(ProductTable).where(and(eq(ProductTable.clerkUserId, userId), productId == null ? undefined : eq(ProductTable.id, productId)))
        
    )
}

export async function getViewsByPPPChartData({
    interval, timezone, productId, userId
}:{
    interval: (typeof CHART_INTERALS)[keyof typeof CHART_INTERALS];
    userId: string;
    productId?: string;
    timezone: string;
}){
    const cacheFn = dbCache(getViewsByPPPChartDataInternal, {
        tags: [getUserTag(userId, CACHE_TAGS.productViews), getGlobalTag(CACHE_TAGS.countries), productId == null ? getUserTag(userId, CACHE_TAGS.products) : getIdTag(productId, CACHE_TAGS.products), getGlobalTag(CACHE_TAGS.countryGroups)]
    })
    return cacheFn({interval, timezone, productId, userId})

}

async function getViewsByPPPChartDataInternal({
    interval, timezone, productId, userId
}:{
    interval: (typeof CHART_INTERALS)[keyof typeof CHART_INTERALS];
    userId: string;
    productId?: string;
    timezone: string;
}){
    const countryViewSq = countryViewSubquery({userId, productId, interval, timezone})
    return await db.with(countryViewSq).select({
        views: count(countryViewSq.visitedAt),
        PPPName: CountryGroupTable.name,
    }).from(CountryGroupTable)
    .leftJoin(countryViewSq, eq(CountryGroupTable.id, countryViewSq.countryGroupId))
    .groupBy(({PPPName})=>[PPPName])
    .orderBy(({PPPName})=> desc(PPPName))
}

function countryViewSubquery({
    interval, timezone, productId, userId
}:{
    interval: (typeof CHART_INTERALS)[keyof typeof CHART_INTERALS];
    userId: string;
    productId?: string;
    timezone: string;
}){
    const prdouctSq = productSubquery(userId, productId)
   const startDate = startOfDay(interval.startDate, {in: tz(timezone)})

    return db.$with("productviews").as(
        db.with(prdouctSq).select({
            countryGroupId: CountryTable.countryGroupId,
            visitedAt: sql`${ProductViewTable.visitedAt} AT TIME ZONE ${timezone}`.inlineParams().as("visitedAt")
        }).from(ProductViewTable)
        .innerJoin(prdouctSq, eq(ProductViewTable.productId, prdouctSq.id))
        .innerJoin(CountryTable, eq(ProductViewTable.countryId, CountryTable.id))
        .where(({visitedAt})=>gte(visitedAt, startDate))

    )
}

export async function getViewsByDayChartData({
    interval, timezone, productId, userId
}:{
    interval: (typeof CHART_INTERALS)[keyof typeof CHART_INTERALS];
    userId: string;
    productId?: string;
    timezone: string;
}){
    const cacheFn = dbCache(getViewsByDayChartDataInternal, {
        tags: [getUserTag(userId, CACHE_TAGS.productViews), productId == null ? getUserTag(userId, CACHE_TAGS.products) : getIdTag(productId, CACHE_TAGS.products)]
    })
    return cacheFn({interval, timezone, productId, userId})
}

async function getViewsByDayChartDataInternal({
    interval, timezone, productId, userId
}:{
    interval: (typeof CHART_INTERALS)[keyof typeof CHART_INTERALS];
    userId: string;
    productId?: string;
    timezone: string;
}){
    const prdouctSq = productSubquery(userId, productId)
    const productViewSq = db.$with("productviews").as(
        db.with(prdouctSq).select({
            visitedAt: sql`${ProductViewTable.visitedAt} AT TIME ZONE ${timezone}`.inlineParams().as("visitedAt"),
            productId: prdouctSq.id
        }).from(ProductViewTable)
        .innerJoin(prdouctSq, eq(ProductViewTable.productId, prdouctSq.id))
    )

    return await db.with(productViewSq).select({
        date: interval.dateGrouper(sql.raw("series")).mapWith(datestring=> interval.dateFormatter(new Date(datestring))),
        views: count(productViewSq.visitedAt)
    }).from(interval.sql)
    .leftJoin(productViewSq, ({date})=>eq(interval.dateGrouper(productViewSq.visitedAt), date))
    .groupBy(({date})=>[date])
    .orderBy(({date})=>date)
}