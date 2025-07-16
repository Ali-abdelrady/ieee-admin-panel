// src/app/Session/_components/SessionForm.tsx
import { CrudForm } from "@/components/crudForm";
import { z } from "zod";
import { FormFieldType } from "@/types";
import { agendaFormSchema, timelineFormSchema } from "@/validations/timeline";
import {
  useAddAwardMutation,
  useUpdateAwardMutation,
} from "@/services/Api/awards";
// import { SessionFormSchema } from "@/validations/Session";
// import { useAddSessionMutation, useUpdateSessionMutation } from "@/services/Api/Session";

interface SessionFormProps {
  operation: "add" | "edit" | "preview";
  defaultValues?: Partial<z.infer<typeof timelineFormSchema>> & {
    id?: number;
  };
  onSuccess?: () => void;
}

const fields: FormFieldType[] = [
  {
    name: "name",
    label: "Name",
    type: "text",
  },
  { name: "description", label: "Description", type: "textArea" },
  { name: "startTime", label: "StartTime", type: "date" },
  { name: "endTime", label: "EndTime", type: "date" },
  { name: "speakerId", label: "Speaker", type: "select", options: [] },
];

const SessionForm = ({
  operation,
  defaultValues,
  onSuccess,
}: SessionFormProps) => {
  const [addItem, { isLoading: isLoadingAdd }] = useAddAwardMutation();
  const [updateItem, { isLoading: isLoadingEdit }] = useUpdateAwardMutation();

  return (
    <CrudForm
      schema={agendaFormSchema}
      fields={fields}
      operation={operation}
      defaultValues={defaultValues}
      onAdd={(data) => addItem(data).unwrap()}
      onUpdate={(data) => updateItem(data).unwrap()}
      itemName="Session"
      onSuccess={onSuccess}
      isLoadingAdd={isLoadingAdd}
      isLoadingEdit={isLoadingEdit}
    />
  );
};

export default SessionForm;
