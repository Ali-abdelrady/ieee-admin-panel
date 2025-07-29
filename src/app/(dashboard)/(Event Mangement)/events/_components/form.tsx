// src/app/events/_components/form.tsx
import { CrudForm } from "@/components/crudForm";
import { z } from "zod";
import { FormFieldType } from "@/types";
import { eventFormSchema } from "@/validations/events";
import {
  useAddEventMutation,
  useUpdateEventMutation,
} from "@/services/Api/events";

interface EventFormProps {
  operation: "add" | "edit" | "preview";
  defaultValues?: Partial<z.infer<typeof eventFormSchema>> & {
    id?: number;
  };
  trigger?: React.ReactNode;
}

const EventForm = ({ operation, defaultValues, trigger }: EventFormProps) => {
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
    {
      name: "image",
      label: "Event Image",
      type: "file",
      fileUploadConfig: {
        fileType: "image",
        maxFiles: 1,
      },
    },
    // { name: "videos", label: "Videos", type: "file", isMultiFiles: true },
    {
      name: "registrationStart",
      label: "Registration Start",
      type: "date",
    },
    { name: "registrationEnd", label: "Registration End", type: "date" },
  ];

  // async function handleAddNewEevnt(data) {
  //   try {
  //     await addItem(data).unwrap();

  //   } catch (error) {}
  // }
  return (
    <CrudForm
      schema={eventFormSchema}
      fields={fields}
      operation={operation}
      defaultValues={defaultValues}
      onAdd={(data) => addItem(data).unwrap()}
      onUpdate={(data) => updateItem(data).unwrap()}
      itemName="Event"
      isLoadingAdd={isLoadingAdd}
      isLoadingEdit={isLoadingEdit}
      trigger={trigger}
    />
  );
};

export default EventForm;
