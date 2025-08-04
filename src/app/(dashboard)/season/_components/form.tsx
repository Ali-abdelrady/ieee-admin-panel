// src/app/season/_components/seasonForm.tsx
import { CrudForm } from "@/components/crudForm";
import { z } from "zod";
import { FormFieldType } from "@/types";
import { seasonFormSchema } from "@/validations/season";
import {
  useAddSeasonMutation,
  useUpdateSeasonMutation,
} from "@/services/Api/season";

interface SeasonFormProps {
  operation: "add" | "edit" | "preview";
  defaultValues?: Partial<z.infer<typeof seasonFormSchema>> & {
    id?: number;
  };
}

const fields: FormFieldType[] = [
  { name: "name", label: "Name", type: "text" },
  { name: "startDate", label: "Start Date", type: "date" },
  { name: "endDate", label: "End Date", type: "date" },
];

const SeasonForm = ({ operation, defaultValues }: SeasonFormProps) => {
  const [addItem, { isLoading: isLoadingAdd }] = useAddSeasonMutation();
  const [updateItem, { isLoading: isLoadingEdit }] = useUpdateSeasonMutation();

  return (
    <CrudForm
      schema={seasonFormSchema}
      fields={fields}
      operation={operation}
      defaultValues={defaultValues}
      onAdd={(data) => addItem(data).unwrap()}
      onUpdate={(data) => updateItem(data).unwrap()}
      itemName="Season"
      isLoadingAdd={isLoadingAdd}
      isLoadingEdit={isLoadingEdit}
    />
  );
};

export default SeasonForm;
