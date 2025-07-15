// src/app/events/page.tsx
"use client";
import DataTable from "@/components/table/dataTable";
import React from "react";
import { Loader2Icon } from "lucide-react";
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
        getId={(row) => row.id}
        isIcon={true}
      />
    ),
    (row) => <EventForm operation="preview" defaultValues={row} />
  );

  if (isFetching) {
    return (
      <div className="absolute left-1/2 top-1/2 -translate-1/2">
        <Loader2Icon className="animate-spin" size={40} />
      </div>
    );
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
            getId={(row) => row.id}
          />
        )}
        label="Event"
        filterKey="name"
      />
    </div>
  );
}
