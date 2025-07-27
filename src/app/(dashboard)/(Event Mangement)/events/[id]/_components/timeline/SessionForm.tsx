// src/app/Session/_components/SessionForm.tsx
import { CrudForm } from "@/components/crudForm";
import { z } from "zod";
import { FormFieldType } from "@/types";
import {
  agendaItemFormSchema,
  timelineFormSchema,
} from "@/validations/eventTimeline";
import {
  useAddAwardMutation,
  useUpdateAwardMutation,
} from "@/services/Api/awards";
import {
  useAddAgendaItemMutation,
  useUpdateAgendaItemMutation,
} from "@/services/Api/eventTimeline";
// import { SessionFormSchema } from "@/validations/Session";
// import { useAddSessionMutation, useUpdateSessionMutation } from "@/services/Api/Session";

interface SessionFormProps {
  operation: "add" | "edit" | "preview";
  defaultValues?: Partial<z.infer<typeof agendaItemFormSchema>> & {
    id?: number;
  };
  speakersOptions?: {
    label: string;
    value: number | string;
  }[];
  eventId: string;
  timelineId: string;
}

const SessionForm = ({
  operation,
  defaultValues,
  speakersOptions,
  eventId,
  timelineId,
}: SessionFormProps) => {
  const [addItem, { isLoading: isLoadingAdd }] = useAddAgendaItemMutation();
  const [updateItem, { isLoading: isLoadingEdit }] =
    useUpdateAgendaItemMutation();
  const fields: FormFieldType[] = [
    {
      name: "name",
      label: "Name",
      type: "text",
    },
    { name: "description", label: "Description", type: "textArea" },
    { name: "startTime", label: "StartTime", type: "time" },
    { name: "endTime", label: "EndTime", type: "time" },
    {
      name: "speakerId",
      label: "Speaker",
      type: "select",
      options: speakersOptions,
    },
  ];

  return (
    <CrudForm
      schema={agendaItemFormSchema}
      fields={fields}
      operation={operation}
      defaultValues={defaultValues}
      onAdd={(data) => addItem({ data, eventId, timelineId }).unwrap()}
      onUpdate={(data) =>
        updateItem({
          data,
          eventId,
          timelineId,
          agendaItemId: data.id.toString(),
        }).unwrap()
      }
      itemName="Session"
      isLoadingAdd={isLoadingAdd}
      isLoadingEdit={isLoadingEdit}
    />
  );
};

export default SessionForm;
