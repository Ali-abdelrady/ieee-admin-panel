"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

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

interface BarChartHorizontalProps<T> {
  title: string;
  description: string;
  barKey: keyof T;
  yAxisKey: keyof T;
  barLabel?: string;
  data: T[];
  color?: string;
}

export function BarChartHorizontal<T>({
  title,
  description,
  barKey,
  data,
  barLabel,
  yAxisKey,
  color = "var(--chart-1)",
}: BarChartHorizontalProps<T>) {
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
        <ChartContainer className="mx-auto max-h-[250px]" config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{
              left: -20,
            }}
          >
            <XAxis type="number" dataKey={barKey as string} hide />
            <YAxis
              dataKey={yAxisKey as string}
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              //   tickFormatter={(value) => {
              //     const val = value as string;
              //     return val?.split(" ")[0];
              //   }}
            />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey={barKey as string}
              fill={chartConfig[barKey as string].color}
              radius={5}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
