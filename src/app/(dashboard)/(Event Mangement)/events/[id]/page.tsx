"use client";
import DataTable from "@/components/table/dataTable";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetEventByIdQuery } from "@/services/Api/events";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { speakerColumns } from "./_components/speakers/speakersCoulmns";
import DeleteDialog from "@/components/forms/deleteDialog";
import { SpeakerType } from "@/types/speakers";

import TimeLineTab from "./_components/timeline/TimelineTab";
import { EventType } from "react-hook-form";
import DetailsTab from "./_components/details/page";
import Loader from "@/components/Loader";

export default function EventDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, isError } = useGetEventByIdQuery(id);
  const eventData = data?.data?.event;

  console.log("eventData:", eventData);

  let speakers, sponsors, timeline;

  if (eventData) {
    ({ speakers, sponsors, eventDays: timeline } = eventData);
  }
  if (isLoading) {
    return <Loader error={isError} />;
  }
  const tabs = [
    {
      value: "details",
      component: <DetailsTab eventId={id} event={eventData} />,
      label: "Details",
      icon: null,
    },
    {
      value: "speakers",
      component: <SpeakersTab speakers={speakers ?? []} eventId={id} />,
      label: "Speakers",
      icon: null,
    },
    {
      value: "sponsors",
      component: <SponsorsTab sponsors={sponsors ?? []} eventId={id} />,
      label: "Sponsors",
      icon: null,
    },
    {
      value: "timeline",
      component: <TimeLineTab eventId={id} speakers={speakers ?? []} />,
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
      <div className="flex items-center justify-between">
        <Link href="/events">
          <Button variant="outline" className="w-fit">
            Go Back
          </Button>
        </Link>
      </div>

      {/* Event Name & Creation Date */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Event Name</h1>
        <p className="text-sm text-muted-foreground">
          Created on {new Date().toLocaleDateString()}
        </p>
      </div>

      <Tabs defaultValue="details" className="w-full space-y-6">
        <div className="overflow-x-auto">
          <TabsList className="w-full  justify-start">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="relative h-full   rounded-lg "
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

function SpeakersTab({
  eventId,
  speakers,
}: {
  eventId: string;
  speakers: SpeakerType[];
}) {
  const columns = speakerColumns({
    // onEdit: (row) => <EventForm operation="edit" defaultValues={row} />,
    onDelete: (rows) => (
      <DeleteDialog<SpeakerType>
        rows={rows}
        isLoading={false}
        deleteFn={(id) => {
          console.log("delete me");
        }}
        getId={(row) => row.id}
        isIcon={true}
      />
    ),
    // onPreview: (row) => <EventForm operation="preview" defaultValues={row} />,
  });
  return (
    <div>
      <DataTable data={speakers} columns={columns} />
    </div>
  );
}
function SponsorsTab({ eventId, sponsors }) {
  return (
    <div>
      <DataTable data={[]} columns={[]} />
    </div>
  );
}

function FormsTab({ eventId }) {
  return <div className="">Forms content here</div>;
}
function FoodMenuTab({ eventId }) {
  return <div className="">Food Menu content here</div>;
}
