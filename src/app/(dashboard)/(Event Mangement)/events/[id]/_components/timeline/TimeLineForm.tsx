// src/app/TimeLine/_components/TimeLineForm.tsx
import { CrudForm } from "@/components/crudForm";
import { z } from "zod";
import { FormFieldType } from "@/types";
import { timelineFormSchema } from "@/validations/eventTimeline";

import {
  useAddTimelineMutation,
  useUpdateTimelineMutation,
} from "@/services/Api/eventTimeline";
// import { TimeLineFormSchema } from "@/validations/TimeLine";
// import { useAddTimeLineMutation, useUpdateTimeLineMutation } from "@/services/Api/TimeLine";

interface TimeLineFormProps {
  operation: "add" | "edit" | "preview";
  defaultValues?: Partial<z.infer<typeof timelineFormSchema>> & {
    id?: number;
  };
  eventId: string;
  trigger?: React.ReactNode;
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
  eventId,
  trigger,
}: TimeLineFormProps) => {
  const [addTimeline, { isLoading: isAdding }] = useAddTimelineMutation();
  const [updateTimeline, { isLoading: isEdting }] = useUpdateTimelineMutation();

  return (
    <CrudForm
      trigger={trigger}
      schema={timelineFormSchema}
      fields={fields}
      operation={operation}
      defaultValues={defaultValues}
      onAdd={(data) => addTimeline({ data, eventId }).unwrap()}
      onUpdate={(data) =>
        updateTimeline({
          data,
          eventId,
          timelineId: data?.id?.toString(),
        }).unwrap()
      }
      itemName="Day"
      isLoadingAdd={isAdding}
      isLoadingEdit={isEdting}
    />
  );
};

export default TimeLineForm;
