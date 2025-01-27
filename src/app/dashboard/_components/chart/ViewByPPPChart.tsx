"use client"
import React from 'react'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { formatCompactNumber } from '@/lib/formatter'

const chartConfig ={
    views: {
        label: "visitors",
        color: "#2563eb",
      },
}

export function ViewByPPPChart({chartData}:{chartData: {
    views: number;
    PPPName: string;
}[]}) {
    if(chartData.length === 0){
        return (
          <p className='flex items-center justify-center text-muted-foreground min-h-[150px] max-h-[250px] w-full'>
            No data available
          </p>
        )
      }
    const datas = chartData.map((data)=>({...data, PPPName: data.PPPName.replace("Parity Group:", "")}))
      
  return (
    <ChartContainer config={chartConfig} className="min-h-[150px] max-h-[250px] w-full">
            <BarChart accessibilityLayer data={datas}>
              <XAxis
              dataKey='PPPName'
              tickLine={false}
              tickMargin={10}
              />
              <YAxis
              tickMargin={10}
              tickLine={false}
              tickFormatter={formatCompactNumber}
              />
              <ChartTooltip content={<ChartTooltipContent nameKey='PPPName' />} />
              <Bar dataKey='views' fill='var(--color-views)'  />
            </BarChart>
        </ChartContainer>
  )
}
