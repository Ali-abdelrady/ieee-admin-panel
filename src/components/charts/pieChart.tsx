"use client";

import { Cell, LabelList, Pie, PieChart } from "recharts";

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

interface ChartPieLabelListProps<T> {
  title: string;
  description: string;
  nameKey: keyof T;
  valueKey: keyof T;
  data: T[];
}
export const description = "A pie chart with a label list";

const chartConfig = {
  companyName: {
    // label: "Company",
    color: "var(--chart-1)",
  },
  certificates_count: {
    label: "Certificates",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;
const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];
export function ChartPieLabelList<T>({
  title,
  description,
  nameKey,
  valueKey,
  data,
}: ChartPieLabelListProps<T>) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
        >
          {data.every((item) => item[valueKey] === 0) ? (
            <div className="text-center text-muted-foreground flex items-center justify-center h-full text-xl">
              No data to display
            </div>
          ) : (
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent nameKey={nameKey as string} hideLabel />
                }
              />
              <Pie
                data={data}
                dataKey={valueKey as string}
                nameKey={nameKey as string}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
                <LabelList
                  dataKey={nameKey as string}
                  className="fill-background"
                  stroke="none"
                  fontSize={12}
                />
              </Pie>
            </PieChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
