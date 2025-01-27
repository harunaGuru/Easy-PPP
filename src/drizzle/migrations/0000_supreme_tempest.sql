CREATE TYPE "public"."tier" AS ENUM('Free', 'Basic', 'Standard', 'Premium');--> statement-breakpoint
CREATE TABLE "country_group_discount" (
	"product_id" uuid NOT NULL,
	"country_group_id" uuid NOT NULL,
	"coupon" text NOT NULL,
	"discount_percentage" real NOT NULL,
	"created_At" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_At" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "country_group_discount_country_group_id_product_id_pk" PRIMARY KEY("country_group_id","product_id")
);
--> statement-breakpoint
CREATE TABLE "country_group" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"recomended_discount_percentage" real,
	"created_At" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_At" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "country" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"country_group_id" uuid NOT NULL,
	"created_At" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_At" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_customization" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"background_color" text DEFAULT 'hsl(193,82%,31%)' NOT NULL,
	"class_prefix" text,
	"location_message" text DEFAULT 'Hey!, it looks like you are from <b>{country}</b>. we support parity purchasing power, so if you need it, use code <b>{coupon}</b> to get <b>{discount}</b> off' NOT NULL,
	"font_size" text DEFAULT '1rem' NOT NULL,
	"banner_container" text DEFAULT 'body' NOT NULL,
	"text_color" text DEFAULT 'hsl(0,0%,100%)' NOT NULL,
	"is_sticky" boolean DEFAULT true NOT NULL,
	"created_At" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_At" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_customization_product_id_unique" UNIQUE("product_id")
);
--> statement-breakpoint
CREATE TABLE "product" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"created_At" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_At" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_view" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"country_id" uuid NOT NULL,
	"visited_At" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_suscription" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"stripe_customer_id" uuid,
	"stripe_subscription_id" uuid,
	"stripe_susbcription_item_id" uuid,
	"tier" "tier" NOT NULL,
	"created_At" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_At" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "country_group_discount" ADD CONSTRAINT "country_group_discount_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "country_group_discount" ADD CONSTRAINT "country_group_discount_country_group_id_country_group_id_fk" FOREIGN KEY ("country_group_id") REFERENCES "public"."country_group"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "country" ADD CONSTRAINT "country_country_group_id_country_group_id_fk" FOREIGN KEY ("country_group_id") REFERENCES "public"."country_group"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_customization" ADD CONSTRAINT "product_customization_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_view" ADD CONSTRAINT "product_view_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_view" ADD CONSTRAINT "product_view_country_id_country_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."country"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "product.clerk_user_id_index" ON "product" USING btree ("clerk_user_id");--> statement-breakpoint
CREATE INDEX "user_subscriptions.clerk_user_id_index" ON "user_suscription" USING btree ("clerk_user_id");--> statement-breakpoint
CREATE INDEX "user_subscriptions.stripe_customer_id_index" ON "user_suscription" USING btree ("stripe_customer_id");