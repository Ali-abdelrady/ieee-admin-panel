import { AppWindowIcon, CodeIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabs = [
  {
    value: "details",
    component: DetailsTab,
  },
  {
    value: "speakers",
    component: SpeakersTab,
  },
  {
    value: "sponsors",
    component: SponsorsTab,
  },
  {
    value: "agenda",
    component: AgendaTab,
  },
  {
    value: "forms",
    component: FormsTab,
  },
  {
    value: "foodMenu",
    component: FoodMenuTab,
  },
];
export function EventEditor() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Tabs defaultValue="account">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="capitalize"
            >
              {tab.value}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <tab.component />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function DetailsTab() {
  return <div>Details content here</div>;
}
function SpeakersTab() {
  return <div>Speakers content here</div>;
}
function SponsorsTab() {
  return <div>Sponsors content here</div>;
}
function AgendaTab() {
  return <div>Agenda content here</div>;
}
function FormsTab() {
  return <div>Forms content here</div>;
}
function FoodMenuTab() {
  return <div>Food Menu content here</div>;
}
