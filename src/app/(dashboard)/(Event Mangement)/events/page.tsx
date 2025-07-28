// src/app/events/page.tsx
"use client";
import DataTable from "@/components/table/dataTable";
import React from "react";
import { Loader2Icon, Search } from "lucide-react";
import { toast } from "sonner";
import DeleteDialog from "@/components/forms/deleteDialog";
import {
  useAddEventMutation,
  useDeleteEventMutation,
  useGetEventsQuery,
} from "@/services/Api/events";
import { EventType } from "@/types/events";
import ImportDialog from "@/components/dialogs/importDialog";
import { eventFormSchema } from "@/validations/events";
import EventForm from "./_components/form";
import { eventColumns } from "./_components/coulmns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";

export default function EventsPage() {
  const { data, isError, isLoading: isFetching, error } = useGetEventsQuery();
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();
  const [addEvent, { isLoading: isAdding }] = useAddEventMutation();

  const initialRows = data?.data?.events ?? [];

  const columns = eventColumns(
    (row) => <EventForm operation="edit" defaultValues={row} />,
    (rows) => (
      <DeleteDialog<EventType>
        rows={rows}
        isLoading={isDeleting}
        deleteFn={deleteEvent}
        getDeleteParams={(event) => event.id}
        isIcon={true}
      />
    ),
    (row) => (
      <Link href={`/events/${row.id}`}>
        <Button variant={"outline"}>
          <Search />
        </Button>
      </Link>
    )
  );

  if (isFetching) {
    return <Loader error={isError} />;
  }

  if (isError) {
    console.log(error);
    toast.error("Something went wrong", {
      duration: 3000,
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold">Events</h1>
      <DataTable<EventType, unknown>
        columns={columns}
        data={initialRows}
        addDialogContent={<EventForm operation="add" />}
        onDeleteRows={(rows) => (
          <DeleteDialog<EventType>
            rows={rows}
            isLoading={isDeleting}
            deleteFn={deleteEvent}
            getDeleteParams={(event) => event.id}
          />
        )}
        label="Event"
        filterKey="name"
      />
    </div>
  );
}
