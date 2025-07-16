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
  onSuccess?: () => void;
}

const fields: FormFieldType[] = [
  { name: "title", label: "Title", type: "text" },
  { name: "description", label: "Description", type: "textArea" },
  { name: "winningDate", label: "Winning Date", type: "date" },
  { name: "place", label: "Place", type: "number" },
  { name: "image", label: "Image File", type: "file" },
];

const AwardForm = ({ operation, defaultValues, onSuccess }: AwardFormProps) => {
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
      onSuccess={onSuccess}
      isLoadingAdd={isLoadingAdd}
      isLoadingEdit={isLoadingEdit}
    />
  );
};

export default AwardForm;
