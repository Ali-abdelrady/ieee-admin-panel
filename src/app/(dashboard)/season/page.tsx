// src/app/season/page.tsx
"use client";
import DataTable from "@/components/table/dataTable";
import React, { useEffect } from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import DeleteDialog from "@/components/forms/deleteDialog";
import {
  useAddSeasonMutation,
  useDeleteSeasonMutation,
  useGetSeasonsQuery,
} from "@/services/Api/season";

import { SeasonType } from "@/types/season";
import ImportDialog from "@/components/dialogs/importDialog";
import Link from "next/link";
import PreviewButton from "@/components/button/previewButton";
import { seasonFormSchema } from "@/validations/season";
import SeasonForm from "./_components/form";
import { seasonColumns } from "./_components/coulmns";

export default function SeasonPage() {
  const { data, isError, isLoading: isFetching, error } = useGetSeasonsQuery();
  const [deleteSeason, { isLoading: isDeleting }] = useDeleteSeasonMutation();
  const [addSeason, { isLoading: isAdding }] = useAddSeasonMutation();

  const initialRows = data?.data?.seasons ?? [];

  const columns = seasonColumns(
    (row) => <SeasonForm operation="edit" defaultValues={row} />,
    (rows) => (
      <DeleteDialog<SeasonType>
        rows={rows}
        isLoading={isDeleting}
        deleteFn={deleteSeason}
        getDeleteParams={(season) => season.id}
        isIcon={true}
      />
    ),
    (row) => <SeasonForm operation="preview" defaultValues={row} />
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
      <h1 className="text-2xl font-bold">Season List</h1>
      <DataTable<SeasonType, unknown>
        columns={columns}
        data={initialRows}
        addDialogContent={<SeasonForm operation="add" />}
        onDeleteRows={(rows) => (
          <DeleteDialog<SeasonType>
            rows={rows}
            isLoading={isDeleting}
            deleteFn={deleteSeason}
            getDeleteParams={(season) => season.id}
          />
        )}
        label="Season"
        filterKey="name"
        importDialogContent={
          <ImportDialog<SeasonType>
            addFn={addSeason}
            isLoading={isAdding}
            columns={columns}
            filterKey="question"
            schema={seasonFormSchema}
          />
        }
      />
    </div>
  );
}
