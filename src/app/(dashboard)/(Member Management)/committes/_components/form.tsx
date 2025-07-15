// src/app/committee/_components/committeeForm.tsx
import { CrudForm } from "@/components/crudForm";
import { z } from "zod";
import { FormFieldType } from "@/types";
import { committeeFormSchema } from "@/validations/committee";
import {
  useAddCommitteeMutation,
  useUpdateCommitteeMutation,
} from "@/services/Api/committee";
import { useGetBoardByIdQuery, useGetBoardsQuery } from "@/services/Api/board";
import { useMemo } from "react";

interface CommitteeFormProps {
  operation: "add" | "edit" | "preview";
  defaultValues?: Partial<z.infer<typeof committeeFormSchema>> & {
    id?: number;
  };
  onSuccess?: () => void;
}

const CommitteeForm = ({
  operation,
  defaultValues,
  onSuccess,
}: CommitteeFormProps) => {
  const [addItem, { isLoading: isLoadingAdd }] = useAddCommitteeMutation();
  const [updateItem, { isLoading: isLoadingEdit }] =
    useUpdateCommitteeMutation();
  const { data } = useGetBoardsQuery();
  const boardOptions = useMemo(() => {
    const options =
      data?.data?.board?.map((item) => ({
        label: item.name,
        value: item.id,
      })) || [];
    return options;
  }, [data]);

  const fields: FormFieldType[] = [
    {
      name: "name",
      label: "Committee Name",
      type: "text",
    },
    {
      name: "headId",
      label: "Head Name",
      type: "select",
      options: boardOptions,
    },
    { name: "description", label: "Description", type: "textArea" },
    { name: "image", label: "Image", type: "file" },
    { name: "topics", label: "Topic", type: "topics" },
  ];
  console.log("board", boardOptions);
  return (
    <CrudForm
      schema={committeeFormSchema}
      fields={fields}
      operation={operation}
      defaultValues={defaultValues}
      onAdd={(data) => addItem(data).unwrap()}
      onUpdate={(data) => updateItem(data).unwrap()}
      itemName="Committee"
      onSuccess={onSuccess}
      isLoadingAdd={isLoadingAdd}
      isLoadingEdit={isLoadingEdit}
      isModal={false}
    />
  );
};

export default CommitteeForm;
