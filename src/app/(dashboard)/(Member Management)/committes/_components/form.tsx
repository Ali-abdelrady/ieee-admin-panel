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
}

const CommitteeForm = ({ operation, defaultValues }: CommitteeFormProps) => {
  const [addItem, { isLoading: isLoadingAdd }] = useAddCommitteeMutation();
  const [updateItem, { isLoading: isLoadingEdit }] =
    useUpdateCommitteeMutation();
  const { data } = useGetBoardsQuery();
  const boardOptions = useMemo(() => {
    const options =
      data?.data?.boards?.map((item) => ({
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
      name: "headIds",
      label: "one or more leader",
      type: "multiSelect",
      options: boardOptions,
    },
    { name: "description", label: "Description", type: "textArea" },
    {
      name: "image",
      label: "Image",
      type: "file",
      fileUploadConfig: {
        fileType: "image",
        maxFiles: 1,
      },
    },
    {
      name: "topics",
      label: "Topics",
      type: "dynamicArrayField",
      dynamicArrayFieldsConfig: {
        fields: [
          { name: "title", type: "text", label: "Title" },
          { name: "content", type: "textArea", label: "Content" },
        ],
        itemName: "Topic",
      },
    },
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
      isLoadingAdd={isLoadingAdd}
      isLoadingEdit={isLoadingEdit}
    />
  );
};

export default CommitteeForm;
