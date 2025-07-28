// src/app/board/page.tsx
"use client";
import DataTable from "@/components/table/dataTable";
import React from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import DeleteDialog from "@/components/forms/deleteDialog";
import {
  useAddBoardMutation,
  useDeleteBoardMutation,
  useGetBoardsQuery,
} from "@/services/Api/board";
import { BoardType } from "@/types/board";
import ImportDialog from "@/components/dialogs/importDialog";
import { boardFormSchema } from "@/validations/board";
import BoardForm from "./_components/form";
import { boardColumns } from "./_components/coulmns";

export default function BoardPage() {
  const { data, isError, isLoading: isFetching, error } = useGetBoardsQuery();
  const [deleteBoard, { isLoading: isDeleting }] = useDeleteBoardMutation();
  const [addBoard, { isLoading: isAdding }] = useAddBoardMutation();

  const initialRows = data?.data?.board ?? [];

  const columns = boardColumns(
    (row) => <BoardForm operation="edit" defaultValues={row} />,
    (rows) => (
      <DeleteDialog<BoardType>
        rows={rows}
        isLoading={isDeleting}
        deleteFn={deleteBoard}
        getDeleteParams={(board) => board.id}
        isIcon={true}
      />
    ),
    (row) => <BoardForm operation="preview" defaultValues={row} />
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
      <h1 className="text-2xl font-bold">Board Members</h1>
      <DataTable<BoardType, unknown>
        columns={columns}
        data={initialRows}
        addDialogContent={<BoardForm operation="add" />}
        onDeleteRows={(rows) => (
          <DeleteDialog<BoardType>
            rows={rows}
            isLoading={isDeleting}
            deleteFn={deleteBoard}
            getDeleteParams={(board) => board.id}
          />
        )}
        label="Board Member"
        filterKey="name"
        // importDialogContent={
        //   <ImportDialog<BoardType>
        //     addFn={addBoard}
        //     isLoading={isAdding}
        //     columns={columns}
        //     filterKey="name"
        //     schema={boardFormSchema}
        //   />
        // }
      />
    </div>
  );
}
