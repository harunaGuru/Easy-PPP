"use client"
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ProductCustomizationSchema } from '@/data/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Required } from '../Required';
import { Banner } from '../Banner';
import { updateProductCustomization } from '@/server/actions/product';
import { useToast } from '@/hooks/use-toast';
import { NoPermissionCard } from '@/components/NoPermissionCard';

export function ProductCustomizationForm({customization, canCustomizeBanner, canRemoveBranding}:{
    customization:{
        productId: string;
        id: string;
        backgroundColor: string;
        classPrefix: string | null;
        locationMessage: string;
        fontSize: string;
        bannerContainer: string;
        textColor: string;
        isSticky: boolean;
    },
    canCustomizeBanner: boolean | undefined,
    canRemoveBranding: boolean | undefined
    }) {
      //  canRemoveBranding = true
    const { toast } = useToast()

      const form = useForm<z.infer<typeof ProductCustomizationSchema>>({
        resolver: zodResolver(ProductCustomizationSchema),
        defaultValues:{
          backgroundColor: customization.backgroundColor,
          classPrefix: customization.classPrefix ?? "",
          locationMessage: customization.locationMessage,
          fontSize: customization.fontSize,
          bannerContainer: customization.bannerContainer,
          textColor: customization.textColor,
          isSticky: customization.isSticky
        }
      })
      const formWatch = form.watch()
      const location = formWatch.locationMessage
      const sampleData = {coupon:"HALF-OFF", country: "india", discount: "50"}

      async function onSubmit(values: z.infer<typeof ProductCustomizationSchema>){
        const isSuccess = await updateProductCustomization(values, customization.productId)
        return toast({
          title: isSuccess.errors ? "Error" : "Success",
          description: isSuccess.message,
          variant: isSuccess.errors ? "destructive" : "default",
      })
      }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className='mb-4'>
        <Banner canRemoveBranding={canRemoveBranding} message={location} mappings= {sampleData} customization={customization} />
        </div>
        {!canCustomizeBanner && 
        <div className='mb-8'>
          <NoPermissionCard />
        </div>}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <FormField
          control={form.control}
          name="locationMessage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PPP Discount Message <Required /></FormLabel>
              <FormControl>
                <Textarea {...field} className='h-24 overflow-y-auto resize-none' disabled={!canRemoveBranding} />
              </FormControl>
              <FormDescription>{`Data Parameters. {country}, {coupon}, {discount}`}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

        <FormField
          control={form.control}
          name="backgroundColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Background color <Required /></FormLabel>
              <FormControl>
                <Input {...field} disabled={!canRemoveBranding}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="textColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text color <Required /></FormLabel>
              <FormControl>
                <Input {...field} disabled={!canRemoveBranding} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fontSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Font size <Required /></FormLabel>
              <FormControl>
                <Input {...field} disabled={!canRemoveBranding} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isSticky"
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>Sticky?</FormLabel>
              <FormControl>
                <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={!canRemoveBranding}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
          <FormField
          control={form.control}
          name="bannerContainer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Banner container <Required /></FormLabel>
              <FormControl>
                <Input {...field} disabled={!canRemoveBranding} />
              </FormControl>
              <FormDescription>HTML container selector where you want to place the
              banner. Ex: #container, .container, body</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
          <FormField
          control={form.control}
          name="classPrefix"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class prefix</FormLabel>
              <FormControl>
                <Input {...field} disabled={!canRemoveBranding} />
              </FormControl>
              <FormDescription>An optional prefix added to all CSS classes to avoid
              conflicts</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        </div>
       
        { canRemoveBranding && <Button type='submit' disabled={form.formState.isSubmitting} className='self-end'>Save</Button>}
      </form>
    </Form>
  )
}
