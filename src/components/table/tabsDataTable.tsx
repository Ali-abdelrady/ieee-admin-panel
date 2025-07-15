import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DataTable from "./dataTable";
import { BaseTabConfig, TabsDatablesProps } from "@/types/tabs";
import { ColumnDef } from "@tanstack/react-table";

function TabsDatables<TTab extends BaseTabConfig<any, any>>({
  tabs,
  defaultTab,
}: TabsDatablesProps<TTab>) {
  const firstTabValue = tabs[0]?.value;
  const defaultValue = defaultTab || firstTabValue;
  const [currentTab, setCurrentTab] = useState(defaultValue);

  return (
    <Tabs
      value={currentTab}
      onValueChange={setCurrentTab}
      className="w-full flex-col justify-start gap-6 md:col-span-2"
    >
      <div className="flex items-center justify-between ">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select value={currentTab} onValueChange={setCurrentTab}>
          <SelectTrigger className="flex w-fit 2xl:hidden" id="view-selector">
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            {tabs.map((tab) => (
              <SelectItem key={tab.value} value={tab.value}>
                {tab.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <TabsList className="hidden **:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 2xl:flex">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="capitalize flex items-center"
            >
              {tab.value}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="relative flex flex-col gap-4 overflow-auto "
        >
          <DataTable
            data={tab.data}
            columns={tab.columns as ColumnDef<unknown, unknown>[]}
            filterKey={tab.filterKey as string}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}

export default TabsDatables;
