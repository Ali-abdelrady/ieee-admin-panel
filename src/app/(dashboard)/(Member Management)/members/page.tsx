// src/app/member/page.tsx
"use client";
import DataTable from "@/components/table/dataTable";
import React from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import DeleteDialog from "@/components/forms/deleteDialog";
import {
  useAddMemberMutation,
  useDeleteMemberMutation,
  useGetMembersQuery,
} from "@/services/Api/member";
import { MemberType } from "@/types/member";
import MemberForm from "./_components/form";
import { memberColumns } from "./_components/coulmns";
import Loader from "@/components/Loader";
import ImportDialog from "@/components/dialogs/importDialog";

export default function MemberPage() {
  const { data, isError, isLoading: isFetching, error } = useGetMembersQuery();
  const [deleteMember, { isLoading: isDeleting }] = useDeleteMemberMutation();
  const [addMember, { isLoading: isAdding }] = useAddMemberMutation();

  const initialRows = data?.data?.members ?? [];

  const columns = memberColumns(
    (row) => <MemberForm operation="edit" defaultValues={row} />,
    (rows) => (
      <DeleteDialog<MemberType>
        rows={rows}
        isLoading={isDeleting}
        deleteFn={deleteMember}
        getDeleteParams={(member) => member.id}
        isIcon={true}
      />
    ),
    (row) => <MemberForm operation="preview" defaultValues={row} />
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
      <h1 className="text-2xl font-bold">Members</h1>
      <DataTable<MemberType, unknown>
        columns={columns}
        data={initialRows}
        addDialogContent={<MemberForm operation="add" />}
        onDeleteRows={(rows) => (
          <DeleteDialog<MemberType>
            rows={rows}
            isLoading={isDeleting}
            deleteFn={deleteMember}
            getDeleteParams={(member) => member.id}
          />
        )}
        label="Member"
        filterKey="name"
        // importDialogContent={
        //   <ImportDialog addFn={(data) => addMember({ data }).unwrap()} columns={memberColumns} filterKey="name"  />
        // }
      />
    </div>
  );
}
