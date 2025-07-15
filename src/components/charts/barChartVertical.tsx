"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A bar chart";

interface BarChartVerticalProps<T> {
  title: string;
  description: string;
  barKey: keyof T;
  xAxisKey: keyof T;
  barLabel?: string;
  data: T[];
  color?: string;
}
export function BarChartVertical<T>({
  title,
  description,
  barKey,
  data,
  barLabel,
  xAxisKey,
  color = "var(--chart-1)",
}: BarChartVerticalProps<T>) {
  const chartConfig = {
    [barKey]: {
      label: barLabel,
      color,
    },
  } satisfies ChartConfig;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto max-h-[250px]">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={xAxisKey as string}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey={barKey as string}
              fill={chartConfig[barKey as string].color}
              radius={8}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
