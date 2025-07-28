import { CrudForm } from "@/components/crudForm";
import { z } from "zod";
import { FormFieldType } from "@/types";
import { awardFormSchema } from "@/validations/awards";
import {
  useAddAwardMutation,
  useUpdateAwardMutation,
} from "@/services/Api/awards";

interface AwardFormProps {
  operation: "add" | "edit" | "preview";
  defaultValues?: Partial<z.infer<typeof awardFormSchema>> & {
    id?: number;
  };
}

const fields: FormFieldType[] = [
  { name: "title", label: "Title", type: "text" },
  { name: "description", label: "Description", type: "textArea" },
  { name: "winningDate", label: "Winning Date", type: "date" },
  { name: "place", label: "Place", type: "number" },
  {
    name: "image",
    label: "Image File",
    type: "file",
    fileUploadConfig: {
      fileType: "image",
      maxFiles: 1,
    },
  },
];

const AwardForm = ({ operation, defaultValues }: AwardFormProps) => {
  const [addItem, { isLoading: isLoadingAdd }] = useAddAwardMutation();
  const [updateItem, { isLoading: isLoadingEdit }] = useUpdateAwardMutation();

  return (
    <CrudForm
      schema={awardFormSchema}
      fields={fields}
      operation={operation}
      defaultValues={defaultValues}
      onAdd={(data) => addItem(data).unwrap()}
      onUpdate={(data) => updateItem(data).unwrap()}
      itemName="Award"
      isLoadingAdd={isLoadingAdd}
      isLoadingEdit={isLoadingEdit}
    />
  );
};

export default AwardForm;
