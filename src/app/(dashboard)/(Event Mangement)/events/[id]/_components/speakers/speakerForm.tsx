// src/app/speakers/_components/form.tsx
import { CrudForm } from "@/components/crudForm";
import { z } from "zod";
import { FormFieldType } from "@/types";
import { speakerFormSchema } from "@/validations/speakers";
import {
  useAddSpeakerMutation,
  useUpdateSpeakerMutation,
} from "@/services/Api/speakers";
import { useFieldArray } from "react-hook-form";

interface SpeakerFormProps {
  operation: "add" | "edit" | "preview";
  defaultValues?: Partial<z.infer<typeof speakerFormSchema>> & {
    id?: number;
  };
  onSuccess?: () => void;
}

const SpeakerForm = ({
  operation,
  defaultValues,
  onSuccess,
}: SpeakerFormProps) => {
  const [addItem, { isLoading: isLoadingAdd }] = useAddSpeakerMutation();
  const [updateItem, { isLoading: isLoadingEdit }] = useUpdateSpeakerMutation();

  const fields: FormFieldType[] = [
    { name: "name", label: "Full Name", type: "text" },
    { name: "title", label: "Title", type: "text" },
    // { name: "job", label: "Job Position", type: "text", optional: true },
    // { name: "company", label: "Company", type: "text", optional: true },
    // { name: "bio", label: "Biography", type: "textarea", optional: true },
    { name: "image", label: "Profile Image", type: "file" },
    {
      name: "socialLinks",
      label: "Social Links",
      type: "socialLinks",
    },
  ];

  return (
    <CrudForm
      schema={speakerFormSchema}
      fields={fields}
      operation={operation}
      defaultValues={defaultValues}
      onAdd={(data) => addItem(data).unwrap()}
      onUpdate={(data) => updateItem(data).unwrap()}
      itemName="Speaker"
      onSuccess={onSuccess}
      isLoadingAdd={isLoadingAdd}
      isLoadingEdit={isLoadingEdit}
    />
  );
};

export default SpeakerForm;
