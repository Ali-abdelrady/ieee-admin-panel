"use client";
import DataTable from "@/components/table/dataTable";
import React from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import DeleteDialog from "@/components/forms/deleteDialog";
import {
  useAddAwardMutation,
  useDeleteAwardMutation,
  useGetAwardsQuery,
} from "@/services/Api/awards";
import { AwardType } from "@/types/awards";
import ImportDialog from "@/components/dialogs/importDialog";
import { awardFormSchema } from "@/validations/awards";
import AwardForm from "./_components/form";
import { awardColumns } from "./_components/coulmns";
import Loader from "@/components/Loader";

export default function AwardPage() {
  const { data, isError, isLoading: isFetching, error } = useGetAwardsQuery();
  const [deleteAward, { isLoading: isDeleting }] = useDeleteAwardMutation();
  const [addAward, { isLoading: isAdding }] = useAddAwardMutation();

  const initialRows = data?.data?.awards ?? [];

  const columns = awardColumns(
    (row) => <AwardForm operation="edit" defaultValues={row} />,
    (rows) => (
      <DeleteDialog<AwardType>
        rows={rows}
        isLoading={isDeleting}
        deleteFn={deleteAward}
        getDeleteParams={(award) => award.id}
        isIcon={true}
      />
    ),
    (row) => <AwardForm operation="preview" defaultValues={row} />
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
  console.log(initialRows);
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold">Awards List</h1>
      <DataTable<AwardType, unknown>
        columns={columns}
        data={initialRows}
        addDialogContent={<AwardForm operation="add" />}
        onDeleteRows={(rows) => (
          <DeleteDialog<AwardType>
            rows={rows}
            isLoading={isDeleting}
            deleteFn={deleteAward}
            getDeleteParams={(award) => award.id}
          />
        )}
        label="Award"
        filterKey="title"
        importDialogContent={
          <ImportDialog<AwardType>
            addFn={addAward}
            isLoading={isAdding}
            columns={columns}
            filterKey="title"
            schema={awardFormSchema}
          />
        }
      />
    </div>
  );
}
