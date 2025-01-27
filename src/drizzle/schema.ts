import { subscriptionTiers, TiersNames } from "@/data/subscriptionTiers";
import { relations } from "drizzle-orm";
import { index, pgTable, primaryKey, real, text, timestamp, uuid, boolean, pgEnum } from "drizzle-orm/pg-core";

const createdAt = timestamp("created_At", {withTimezone: true}).notNull().defaultNow()
const updateAt = timestamp("updated_At", {withTimezone: true}).notNull().defaultNow().$onUpdate(()=> new Date())
export const TierEnum = pgEnum("tier", Object.keys(subscriptionTiers) as [TiersNames])

export const ProductTable = pgTable("product", {
    id: uuid('id').primaryKey().defaultRandom(),
    clerkUserId: text("clerk_user_id").notNull(),
    name: text("name").notNull(),
    url: text("url").notNull(),
    description: text("description"),
    createdAt,
    updateAt
}, table=>({
    clerkUserIdIndex: index("product.clerk_user_id_index").on(table.clerkUserId)
}))

export const productRelation = relations(ProductTable, (({one, many})=>({
    productCustomization: one(ProductCustomizationTable),
    productView: many(ProductViewTable),
    countryGroupdiscount: many(CountryGroupDiscountTable)
})))

export const ProductCustomizationTable = pgTable("product_customization", {
    id: uuid('id').primaryKey().defaultRandom(),
    productId: uuid("product_id").notNull().references(()=> ProductTable.id, {onDelete: 'cascade'}).unique(),
    backgroundColor: text("background_color").notNull().default('hsl(193,82%,31%)'),
    classPrefix: text("class_prefix"),
    locationMessage: text("location_message").notNull().default("Hey!, it looks like you are from <b>{country}</b>. we support parity purchasing power, so if you need it, use code  <b>“{coupon}”</b> to get <b>{discount}%</b> off"),
    fontSize: text("font_size").notNull().default("1rem"),
    bannerContainer: text("banner_container").notNull().default("body"),
    textColor: text("text_color").notNull().default("hsl(0,0%,100%)"),
    isSticky: boolean("is_sticky").notNull().default(true),
    createdAt,
    updateAt
}) 

export const productCustomizationRelation = relations(ProductCustomizationTable, (({one})=>({
    product: one(ProductTable, {
        fields: [ProductCustomizationTable.productId],
        references: [ProductTable.id]
    })
})))
export const ProductViewTable = pgTable("product_view", {
    id: uuid('id').primaryKey().defaultRandom(),
    productId: uuid("product_id").notNull().references(()=> ProductTable.id, {onDelete: 'cascade'}),
    countryId: uuid("country_id").notNull().references(()=> CountryTable.id, {onDelete: 'cascade'}),
    visitedAt: timestamp("visited_At", {withTimezone: true}).notNull().defaultNow()
})

export const productViewRelation = relations(ProductViewTable, (({one})=>({
    product: one(ProductTable, {
        fields: [ProductViewTable.productId],
        references: [ProductTable.id]
    }),
    country: one(CountryTable, {
        fields: [ProductViewTable.countryId],
        references: [CountryTable.id]
    })
})))

export const CountryTable = pgTable("country", {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    code: text("code").notNull().unique(),
    countryGroupId: uuid("country_group_id").notNull().references(()=> CountryGroupTable.id, {onDelete: 'cascade'}),
    createdAt,
    updateAt
})
export const countryRelation = relations(CountryTable, (({one, many})=>({
    countryGroup: one(CountryGroupTable, {
        fields: [CountryTable.countryGroupId],
        references: [CountryGroupTable.id]
    }),
    productView: many(ProductViewTable)
})))

export const CountryGroupTable = pgTable("country_group",{
    id: uuid('id').primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    recommendedDiscountPercentage: real("recomended_discount_percentage"),
    createdAt,
    updateAt,
})

export const countryGroupRelation = relations (CountryGroupTable, (({ many})=>({
    country: many(CountryTable),
    countryGroupDiscount: many(CountryGroupDiscountTable)
})))

export const CountryGroupDiscountTable = pgTable("country_group_discount",{
    productId: uuid("product_id").notNull().references(()=> ProductTable.id, {onDelete: 'cascade'}),
    countryGroupId: uuid("country_group_id").notNull().references(()=> CountryGroupTable.id, {onDelete: 'cascade'}),
    coupon: text("coupon").notNull(),
    discountPercentage: real("discount_percentage").notNull(),
    createdAt,
    updateAt
}, table=>({
    pk: primaryKey({
        columns: [table.countryGroupId, table.productId]
    })
}))

export const countryGroupDiscountRelation = relations(CountryGroupDiscountTable, (({one})=>({
    product: one(ProductTable, {
        fields: [CountryGroupDiscountTable.productId],
        references: [ProductTable.id]
    }),
     countryGroup: one(CountryGroupTable, {
        fields: [CountryGroupDiscountTable.countryGroupId],
        references: [CountryGroupTable.id]
     })
})))

export const UserSubscriptionTable = pgTable("user_suscription", {
    id: uuid('id').primaryKey().defaultRandom(),
    clerkUserId: text("clerk_user_id").notNull().unique(),
    stripeCustomerId: text("stripe_customer_id"),
    stripeSubscriptionId: text("stripe_subscription_id"),
    stripeSubscriptionItemId: text("stripe_susbcription_item_id"),
    tier: TierEnum("tier").notNull(),
    createdAt,
    updateAt,
},table=>({
    clerkUserIdIndex: index("user_subscriptions.clerk_user_id_index").on(table.clerkUserId),
    stripeCustomerIdIndex: index("user_subscriptions.stripe_customer_id_index").on(table.stripeCustomerId)
}))

