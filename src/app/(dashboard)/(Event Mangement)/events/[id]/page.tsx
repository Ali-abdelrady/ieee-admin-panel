"use client";
import DataTable from "@/components/table/dataTable";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetEventByIdQuery } from "@/services/Api/events";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import DeleteDialog from "@/components/forms/deleteDialog";
import { SpeakerType } from "@/types/speakers";

import TimeLineTab from "./_components/timeline/TimelineTab";
import { EventType } from "react-hook-form";
import DetailsTab from "./_components/details/page";
import Loader from "@/components/Loader";
import SpeakersTab from "./_components/speakers/SpeakerTab";
import SponsorsTab from "./_components/sponsors/SponsorTab";
import { FoodMenuTab } from "./_components/foodMenu/FoodMenuTab";
import MediaTab from "./_components/media/MediaTab";

export default function EventDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, isError } = useGetEventByIdQuery(id);
  if (isLoading) {
    return <Loader error={isError} />;
  }
  const event = data?.data?.event;
  const tabs = [
    {
      value: "details",
      component: <DetailsTab eventId={id} />,
      label: "Details",
      icon: null,
    },
    {
      value: "media",
      component: <MediaTab eventId={id} />,
      label: "Media",
      icon: null,
    },
    {
      value: "speakers",
      component: <SpeakersTab eventId={id} />,
      label: "Speakers",
      icon: null,
    },
    {
      value: "sponsors",
      component: <SponsorsTab eventId={id} />,
      label: "Sponsors",
      icon: null,
    },
    {
      value: "timeline",
      component: <TimeLineTab eventId={id} />,
      label: "Timeline",
      icon: null,
    },
    {
      value: "forms",
      component: <FormsTab eventId={id} />,
      label: "Forms",
      icon: null,
    },
    {
      value: "foodMenu",
      component: <FoodMenuTab eventId={id} />,
      label: "Food Menu",
      icon: null,
    },
  ];

  return (
    <div className="flex w-full flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* <div className="flex items-center justify-between">
        <Link href="/events">
          <Button variant="outline" className="w-fit">
            Go Back
          </Button>
        </Link>
      </div> */}

      {/* Event Name & Creation Date */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{event?.name}</h1>
      </div>

      <Tabs className="w-full space-y-6" defaultValue="details">
        <div className="overflow-x-auto">
          <TabsList className="w-full  justify-start">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="relative h-full  rounded-lg "
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="w-full">
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function FormsTab({ eventId }) {
  return <div className="">Forms content here</div>;
}
