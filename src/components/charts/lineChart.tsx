"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";

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

export const description = "A line chart";

interface LineChartProps<T> {
  title: string;
  description: string;
  lineKey: keyof T;
  xAxisKey: keyof T;
  lineLabel?: string;
  data: T[];
  color?: string;
}

export function CustomLineChart<T>({
  title,
  description,
  lineKey,
  data,
  lineLabel,
  xAxisKey,
  color = "",
}: LineChartProps<T>) {
  const chartConfig = {
    [lineKey as string]: {
      label: lineLabel,
      color: "var(--chart-2)",
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
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={xAxisKey as string}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              //   tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey={lineKey as string}
              type="natural"
              fill={color}
              strokeWidth={2}
              dot={false}
              stroke={color}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
