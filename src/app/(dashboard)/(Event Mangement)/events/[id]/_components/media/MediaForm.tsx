// src/app/faq/_components/MenuForm.tsx
import { CrudForm } from "@/components/crudForm";
import { z } from "zod";
import { FormFieldType } from "@/types";

import { useUploadEventMediaMutation } from "@/services/Api/evnetMedia";
import { MediaType } from "@/types/eventMedia";
import { eventMediaSchema } from "@/validations/eventMedia";

interface MediaFormProps {
  operation: "add" | "edit" | "preview";
  defaultValues?: MediaType;
  eventId: string;
  trigger?: React.ReactNode;
}

const fields: FormFieldType[] = [
  {
    name: "media",
    // label: "Media",
    type: "file",
    fileUploadConfig: {
      fileType: "all",
      maxFiles: 12,
      maxSize: 52428800, //50 mb
    },
  },
];

const MediaForm = ({
  operation,
  defaultValues,
  eventId,
  trigger,
}: MediaFormProps) => {
  const [uploadMedia, { isLoading: isLoadingAdd }] =
    useUploadEventMediaMutation();

  return (
    <CrudForm
      schema={eventMediaSchema}
      fields={fields}
      operation={operation}
      defaultValues={defaultValues}
      onAdd={(data) => uploadMedia({ eventId, data }).unwrap()}
      itemName="Media"
      isLoadingAdd={isLoadingAdd}
      trigger={trigger}
    />
  );
};

export default MediaForm;
