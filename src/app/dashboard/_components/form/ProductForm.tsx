"use client"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
 } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { productDetailsSchema } from "@/data/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import {  useForm } from "react-hook-form"
import { z } from "zod"
import { useToast } from "@/hooks/use-toast"
import { createProduct, updateProduct } from "@/server/actions/product"
import { Required } from "../Required"

 


export function ProductForm({product}:{product?:{
  id:string;
  name: string;
  url: string;
  description: string | null
}}){
    const { toast } = useToast()
    const form = useForm<z.infer<typeof productDetailsSchema>>({
        resolver: zodResolver(productDetailsSchema),
        defaultValues: product ? {...product, description:product.description ?? ""} : {
            name: "",
            url: "",
            description: ""
        }
    })

    async function onSubmit(values: z.infer<typeof productDetailsSchema>) {
        const action = product == null ? createProduct : updateProduct.bind(null, product.id)
        const result = await action(values)
        toast({
            title: result.errors ? "Error" : "Success",
            description: result.message,
            variant: result.errors ? "destructive" : "default",
        })
       
      }
    
      return(
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4 bg-background shadow-xl rounded text-foreground flex flex-col">
                <h2 className="font-semibold text-lg mb-3">Product Details</h2>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name <Required /></FormLabel>
              <FormControl>
                <Input  {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter your website URL <Required /></FormLabel>
              <FormControl>
                <Input  {...field} />
              </FormControl>
              <FormDescription>
                Input the protocol(http/https) and the full path to the site page
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Description</FormLabel>
              <FormControl>
                <Textarea  {...field} className="resize-none min-h-24" />
              </FormControl>
              <FormDescription>
                An optional description to help distinguish your product from other product
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="self-end">Save</Button>
        </form>

        </Form>
      )
    
}

