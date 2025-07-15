// src/app/partners/page.tsx
"use client";
import DataTable from "@/components/table/dataTable";
import React from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import DeleteDialog from "@/components/forms/deleteDialog";
import {
  useAddPartnerMutation,
  useDeletePartnerMutation,
  useGetPartnersQuery,
} from "@/services/Api/partners";
import { PartnerType } from "@/types/partners";
import ImportDialog from "@/components/dialogs/importDialog";
import { partnerFormSchema } from "@/validations/partners";
import PartnerForm from "./_components/form";
import { partnerColumns } from "./_components/coulmns";

export default function PartnersPage() {
  const { data, isError, isLoading: isFetching, error } = useGetPartnersQuery();
  const [deletePartner, { isLoading: isDeleting }] = useDeletePartnerMutation();
  const [addPartner, { isLoading: isAdding }] = useAddPartnerMutation();

  const initialRows = data?.data?.partners ?? [];

  const columns = partnerColumns(
    (row) => <PartnerForm operation="edit" defaultValues={row} />,
    (rows) => (
      <DeleteDialog<PartnerType>
        rows={rows}
        isLoading={isDeleting}
        deleteFn={deletePartner}
        getId={(row) => row.id}
        isIcon={true}
      />
    ),
    (row) => <PartnerForm operation="preview" defaultValues={row} />
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
      <h1 className="text-2xl font-bold">Partners</h1>
      <DataTable<PartnerType, unknown>
        columns={columns}
        data={initialRows}
        addDialogContent={<PartnerForm operation="add" />}
        onDeleteRows={(rows) => (
          <DeleteDialog<PartnerType>
            rows={rows}
            isLoading={isDeleting}
            deleteFn={deletePartner}
            getId={(row) => row.id}
          />
        )}
        label="Partner"
        filterKey="name"
        importDialogContent={
          <ImportDialog<PartnerType>
            addFn={addPartner}
            isLoading={isAdding}
            columns={columns}
            filterKey="name"
            schema={partnerFormSchema}
          />
        }
      />
    </div>
  );
}
