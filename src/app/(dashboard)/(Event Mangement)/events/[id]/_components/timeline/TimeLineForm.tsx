// src/app/TimeLine/_components/TimeLineForm.tsx
import { CrudForm } from "@/components/crudForm";
import { z } from "zod";
import { FormFieldType } from "@/types";
import { timelineFormSchema } from "@/validations/timeline";
import {
  useAddAwardMutation,
  useUpdateAwardMutation,
} from "@/services/Api/awards";
// import { TimeLineFormSchema } from "@/validations/TimeLine";
// import { useAddTimeLineMutation, useUpdateTimeLineMutation } from "@/services/Api/TimeLine";

interface TimeLineFormProps {
  operation: "add" | "edit" | "preview";
  defaultValues?: Partial<z.infer<typeof timelineFormSchema>> & {
    id?: number;
  };
  onSuccess?: () => void;
}

const fields: FormFieldType[] = [
  {
    name: "label",
    label: "Day Label",
    type: "text",
    placeholder: "Day 1 , Opening Day",
  },
  { name: "date", label: "Date", type: "date" },
];

const TimeLineForm = ({
  operation,
  defaultValues,
  onSuccess,
}: TimeLineFormProps) => {
  const [addItem, { isLoading: isLoadingAdd }] = useAddAwardMutation();
  const [updateItem, { isLoading: isLoadingEdit }] = useUpdateAwardMutation();

  return (
    <CrudForm
      schema={timelineFormSchema}
      fields={fields}
      operation={operation}
      defaultValues={defaultValues}
      onAdd={(data) => addItem(data).unwrap()}
      onUpdate={(data) => updateItem(data).unwrap()}
      itemName="Day"
      onSuccess={onSuccess}
      isLoadingAdd={isLoadingAdd}
      isLoadingEdit={isLoadingEdit}
      isModal={false}
    />
  );
};

export default TimeLineForm;
