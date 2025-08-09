// src/app/posts/page.tsx
"use client";
import DataTable from "@/components/table/dataTable";
import React from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import DeleteDialog from "@/components/forms/deleteDialog";
import {
  useAddPostMutation,
  useDeletePostMutation,
  useGetPostsQuery,
} from "@/services/Api/post";

import Link from "next/link";
import PreviewButton from "@/components/button/previewButton";
import { postFormSchema } from "@/validations/post";
import PostForm from "./_components/form";
import { postColumns } from "./_components/coulmns";
import { PostType } from "@/types/post";
import ImportDialog from "@/components/dialogs/importDialog";
import Loader from "@/components/Loader";

export default function PostPage() {
  const { data, isError, isLoading: isFetching, error } = useGetPostsQuery();
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();
  const [addPost, { isLoading: isAdding }] = useAddPostMutation();

  const initialRows = data?.data?.posts ?? [];

  const columns = postColumns(
    (row) => <PostForm operation="edit" defaultValues={row} />,
    (rows) => (
      <DeleteDialog<PostType>
        rows={rows}
        isLoading={isDeleting}
        deleteFn={deletePost}
        isIcon={true}

      />
    ),
    (row) => <PostForm operation="preview" defaultValues={row} />
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
      <h1 className="text-2xl font-bold">Posts</h1>
      <DataTable<PostType, unknown>
        columns={columns}
        data={initialRows}
        addDialogContent={<PostForm operation="add" />}
        onDeleteRows={(rows) => (
          <DeleteDialog<PostType>
            rows={rows}
            isLoading={isDeleting}
            deleteFn={deletePost}
            getId={(row) => row.id}
          />
        )}
        label="Post"
        filterKey="title"
        importDialogContent={
          <ImportDialog<PostType>
            addFn={addPost}
            isLoading={isAdding}
            columns={columns}
            filterKey="title"
            schema={postFormSchema}
          />
        }
      />
    </div>
  );
}
