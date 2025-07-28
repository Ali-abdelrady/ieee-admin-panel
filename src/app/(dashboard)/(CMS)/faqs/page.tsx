// src/app/faq/page.tsx
"use client";
import DataTable from "@/components/table/dataTable";
import React, { useEffect } from "react";
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

export default function FaqPage() {
  const { data, isError, isLoading: isFetching, error } = useGetFaqsQuery();
  const [deleteFaq, { isLoading: isDeleting }] = useDeleteFaqMutation();
  const [addFaq, { isLoading: isAdding }] = useAddFaqMutation();

  const initialRows = data?.data?.faqs ?? [];

  const columns = faqColumns(
    (row) => <FaqForm operation="edit" defaultValues={row} />,
    (rows) => (
      <DeleteDialog<FAQType>
        rows={rows}
        isLoading={isDeleting}
        deleteFn={deleteFaq}
        getDeleteParams={(faq) => faq.id}
        isIcon={true}
      />
    ),
    (row) => <FaqForm operation="preview" defaultValues={row} />
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
            getDeleteParams={(faq) => faq.id}
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
