// src/app/committee/page.tsx
"use client";
import DataTable from "@/components/table/dataTable";
import React from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import DeleteDialog from "@/components/forms/deleteDialog";
import {
  useAddCommitteeMutation,
  useDeleteCommitteeMutation,
  useGetCommitteesQuery,
} from "@/services/Api/committee";

import { CommitteeType } from "@/types/committee";
import ImportDialog from "@/components/dialogs/importDialog";
import Link from "next/link";
import PreviewButton from "@/components/button/previewButton";
import { committeeFormSchema } from "@/validations/committee";
import CommitteeForm from "./_components/form";
import { committeeColumns } from "./_components/coulmns";

export default function CommitteePage() {
  const {
    data,
    isError,
    isLoading: isFetching,
    error,
  } = useGetCommitteesQuery();
  const [deleteCommittee, { isLoading: isDeleting }] =
    useDeleteCommitteeMutation();
  const [addCommittee, { isLoading: isAdding }] = useAddCommitteeMutation();

  const initialRows = data?.data?.committees ?? [];

  const columns = committeeColumns(
    (row) => <CommitteeForm operation="edit" defaultValues={row} />,
    (rows) => (
      <DeleteDialog<CommitteeType>
        rows={rows}
        isLoading={isDeleting}
        deleteFn={deleteCommittee}
        getId={(row) => row.id}
        isIcon={true}
      />
    ),
    (row) => <CommitteeForm operation="preview" defaultValues={row} />
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
      <h1 className="text-2xl font-bold">Committees</h1>
      <DataTable<CommitteeType, unknown>
        columns={columns}
        data={initialRows}
        addDialogContent={<CommitteeForm operation="add" />}
        onDeleteRows={(rows) => (
          <DeleteDialog<CommitteeType>
            rows={rows}
            isLoading={isDeleting}
            deleteFn={deleteCommittee}
            getId={(row) => row.id}
          />
        )}
        label="Committee"
        filterKey="name"
      />
    </div>
  );
}
