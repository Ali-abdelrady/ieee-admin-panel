// src/app/faq/page.tsx
"use client";
import DataTable from "@/components/table/dataTable";
import React from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import DeleteDialog from "@/components/forms/deleteDialog";
import {
  useAddFaqMutation,
  useDeleteFaqMutation,
  useGetFaqsQuery,
} from "@/services/Api/faq";

import { FAQType } from "@/types/faq";
import ImportDialog from "@/components/dialogs/importDialog";
import Link from "next/link";
import PreviewButton from "@/components/button/previewButton";
import { faqFormSchema } from "@/validations/faq";
import FaqForm from "./_components/form";
import { faqColumns } from "./_components/coulmns";
import Loader from "@/components/Loader";

export default function FaqPage() {
  const { data, isError, isLoading: isFetching, error } = useGetFaqsQuery();
  const [deleteFaq, { isLoading: isDeleting }] = useDeleteFaqMutation();
  const [addFaq, { isLoading: isAdding }] = useAddFaqMutation();

  const initialRows = data?.data ?? [];

  const columns = faqColumns(
    (row) => <FaqForm operation="edit" defaultValues={row} />,
    (rows) => (
      <DeleteDialog<FAQType>
        rows={rows}
        isLoading={isDeleting}
        deleteFn={deleteFaq}
        getId={(row) => row.id}
        isIcon={true}
      />
    ),
    (row) => <FaqForm operation="preview" defaultValues={row} />
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
      <h1 className="text-2xl font-bold">FAQ List</h1>
      <DataTable<FAQType, unknown>
        columns={columns}
        data={initialRows}
        addDialogContent={<FaqForm operation="add" />}
        onDeleteRows={(rows) => (
          <DeleteDialog<FAQType>
            rows={rows}
            isLoading={isDeleting}
            deleteFn={deleteFaq}
            getId={(row) => row.id}
          />
        )}
        label="FAQ"
        filterKey="question"
        importDialogContent={
          <ImportDialog<FAQType>
            addFn={addFaq}
            isLoading={isAdding}
            columns={columns}
            filterKey="question"
            schema={faqFormSchema}
          />
        }
      />
    </div>
  );
}
