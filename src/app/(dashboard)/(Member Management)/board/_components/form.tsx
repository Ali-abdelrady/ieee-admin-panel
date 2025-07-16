// src/app/board/_components/boardForm.tsx
import { CrudForm } from "@/components/crudForm";
import { z } from "zod";
import { FormFieldType } from "@/types";
import { boardFormSchema } from "@/validations/board";
import {
  useAddBoardMutation,
  useUpdateBoardMutation,
} from "@/services/Api/board";
import { useFieldArray } from "react-hook-form";

interface BoardFormProps {
  operation: "add" | "edit" | "preview";
  defaultValues?: Partial<z.infer<typeof boardFormSchema>> & {
    id?: number;
  };
  onSuccess?: () => void;
}

const BoardForm = ({ operation, defaultValues, onSuccess }: BoardFormProps) => {
  const [addItem, { isLoading: isLoadingAdd }] = useAddBoardMutation();
  const [updateItem, { isLoading: isLoadingEdit }] = useUpdateBoardMutation();

  const fields: FormFieldType[] = [
    { name: "name", label: "Full Name", type: "text" },
    {
      name: "position",
      label: "Position",
      type: "select",
      options: [
        { label: "counselor", value: "counselor" },
        { label: "excom", value: "excom" },
        { label: "vice", value: "vice" },
        { label: "head", value: "head" },
      ],
    },
    { name: "title", label: "Title", type: "text" },
    { name: "image", label: "Profile Image", type: "file" },
    {
      name: "socialLinks",
      label: "Social Links",
      type: "socialLinks",
    },
  ];

  return (
    <CrudForm
      schema={boardFormSchema}
      fields={fields}
      operation={operation}
      defaultValues={defaultValues}
      onAdd={(data) => addItem(data).unwrap()}
      onUpdate={(data) => updateItem(data).unwrap()}
      itemName="Board Member"
      onSuccess={onSuccess}
      isLoadingAdd={isLoadingAdd}
      isLoadingEdit={isLoadingEdit}
    />
  );
};

export default BoardForm;
