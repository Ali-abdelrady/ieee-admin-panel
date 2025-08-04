"use client";

import DeleteDialog from "@/components/forms/deleteDialog";
import { SponsorType } from "@/types/sponsors";

import DataTable from "@/components/table/dataTable";

import Loader from "@/components/Loader";
import {
  useAddPartnerMutation,
  useDeletePartnerMutation,
  useGetPartnersQuery,
} from "@/services/Api/partners";
import { partnerColumns } from "./_components/coulmns";
import { toast } from "sonner";
import {
  useDeleteSponsorMutation,
  useGetSponsorsQuery,
} from "@/services/Api/sponsors";
import SponsorForm from "./_components/SponsorForm";

export default function PartnersPage() {
  const { data, isError, isLoading: isFetching, error } = useGetSponsorsQuery();
  const [deletePartner, { isLoading: isDeleting }] = useDeleteSponsorMutation();

  const initialRows = data?.data?.sponsors ?? [];

  const columns = partnerColumns(
    (row) => (
      <SponsorForm
        operation="edit"
        defaultValues={row}
        partners={initialRows}
      />
    ),
    (rows) => (
      <DeleteDialog<SponsorType>
        rows={rows}
        isLoading={isDeleting}
        deleteFn={deletePartner}
        getDeleteParams={(s) => s.id}
        isIcon={true}
      />
    )
  );

  if (isFetching) {
    return (
      <div className="absolute left-1/2 top-1/2 -translate-1/2">
        <Loader error={isError} />
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
      <h1 className="text-2xl font-bold">Sponsors</h1>
      <DataTable<SponsorType, unknown>
        columns={columns}
        data={initialRows}
        addDialogContent={
          <SponsorForm operation="add" partners={initialRows} />
        }
        onDeleteRows={(rows) => (
          <DeleteDialog<SponsorType>
            rows={rows}
            isLoading={isDeleting}
            deleteFn={deletePartner}
            getDeleteParams={(s) => s.id}
            isIcon={true}
          />
        )}
        label="Sponsor"
        filterKey="name"
      />
    </div>
  );
}
