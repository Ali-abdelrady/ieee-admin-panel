// src/app/events/_components/form.tsx
import { CrudForm } from "@/components/crudForm";
import { z } from "zod";
import { FormFieldType } from "@/types";
import { eventFormSchema } from "@/validations/events";
import {
  useAddEventMutation,
  useUpdateEventMutation,
} from "@/services/Api/events";
import { useFieldArray } from "react-hook-form";

interface EventFormProps {
  operation: "add" | "edit" | "preview";
  defaultValues?: Partial<z.infer<typeof eventFormSchema>> & {
    id?: number;
  };
  onSuccess?: () => void;
}

const EventForm = ({ operation, defaultValues, onSuccess }: EventFormProps) => {
  const [addItem, { isLoading: isLoadingAdd }] = useAddEventMutation();
  const [updateItem, { isLoading: isLoadingEdit }] = useUpdateEventMutation();

  const fields: FormFieldType[] = [
    { name: "name", label: "Event Name", type: "text" },
    { name: "description", label: "Description", type: "textArea" },
    { name: "startDate", label: "Start Date", type: "date" },
    { name: "endDate", label: "End Date", type: "date" },
    { name: "private", label: "Private Event", type: "switch" },
    {
      name: "category",
      label: "Category",
      type: "select",
      options: [
        { label: "Event", value: "event" },
        { label: "Bootcamp", value: "bootcamp" },
        { label: "Workshop", value: "workshop" },
        { label: "Outing", value: "outing" },
      ],
    },
    { name: "location", label: "Location", type: "text" },
    { name: "images", label: "Images", type: "file", isMultiFiles: true },
    { name: "videos", label: "Videos", type: "file", isMultiFiles: true },
    {
      name: "registrationStart",
      label: "Registration Start",
      type: "date",
    },
    { name: "registrationEnd", label: "Registration End", type: "date" },
  ];

  return (
    <CrudForm
      schema={eventFormSchema}
      fields={fields}
      operation={operation}
      defaultValues={defaultValues}
      onAdd={(data) => addItem(data).unwrap()}
      onUpdate={(data) => updateItem(data).unwrap()}
      itemName="Event"
      onSuccess={onSuccess}
      isLoadingAdd={isLoadingAdd}
      isLoadingEdit={isLoadingEdit}
      isModal={false}
    />
  );
};

export default EventForm;
