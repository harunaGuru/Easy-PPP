"use client"
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {  CountryDiscountSchema } from '@/data/schema'
import { useToast } from '@/hooks/use-toast'
import { updateProductCountryDiscount } from '@/server/actions/product'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'



export default function CountryDiscountForm({countryGroups, productId}:{productId:string; 
    countryGroups:{
        id: string;
        name:string;
        recommendedDiscountPercentage: number | null;
        countries:{
            name: string;
            code: string;
        }[],
        discount?:{
            discountPercentage: number,
            coupon: string
        }
    }[]
}) {
    const { toast } = useToast()
    const form = useForm<z.infer<typeof CountryDiscountSchema>>({
            resolver: zodResolver(CountryDiscountSchema),
            defaultValues: {
                groups: countryGroups.map(group=>{
                    const discount = group.discount?.discountPercentage ?? group.recommendedDiscountPercentage
                    return{
                        discountPercentage: discount != null ? discount * 100 : undefined,
                        coupon: group.discount?.coupon || "",
                        countryGroupId: group.id
                    }
                })
            }
        })
    async function onSubmit(data: z.infer<typeof CountryDiscountSchema>){
        const isSuccess = await updateProductCountryDiscount(productId, data)
         return toast({
            title: isSuccess.errors ? "Error" : "Success",
            description: isSuccess.message,
          variant: isSuccess.errors ? "destructive" : "default",
        })
    }
    return(
        <Form  {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6'>
                {countryGroups.map((group, index)=>(
                    <div key={group.id} className='flex justify-between p-3 items-start border-[1px] rounded-md shadow-lg'>
                        <div className='flex flex-col gap-4'>
                            <h3 className='text-sm'>{group.name}</h3>
                            <div className='flex gap-2 flex-wrap'>
                                {group.countries.map((country)=>(
                                    <Image alt={country.name} key={country.code} width={24} height={16} src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${country.code}.svg`} />
                                    
                                ))}
                            </div>
                        </div>

                        <div className='flex gap-2 items-start'>
                            <Input type='hidden' {...form.register(`groups.${index}.countryGroupId`)} /> 
                            <FormField
                                control={form.control}
                                name= {`groups.${index}.discountPercentage`}
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Discount %</FormLabel>
                                    <FormControl>
                                        <Input  {...field} className='w-24' type='number' value={field.value ?? ""} onChange={e=> field.onChange(e.target.valueAsNumber)} min='0' max='100'/>
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name= {`groups.${index}.coupon`}
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Coupon</FormLabel>
                                    <FormControl>
                                        <Input  {...field} className='w-48' />
                                    </FormControl>
                                    <FormMessage>
                                        {form.formState.errors.groups?.[index]?.root?.message}
                                    </FormMessage>
                                    </FormItem>
                                )}
                            />

                            {/* </div> */}
                        </div>
                    </div>
                ))}
                <Button type='submit' className='self-end'>Save</Button>
            </form>
        </Form>
    )
}
