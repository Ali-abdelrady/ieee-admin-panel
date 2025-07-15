// src/app/faq/_components/faqForm.tsx
import { CrudForm } from "@/components/crudForm";
import { z } from "zod";
import { FormFieldType } from "@/types";
import { faqFormSchema } from "@/validations/faq";
import { useAddFaqMutation, useUpdateFaqMutation } from "@/services/Api/faq";

interface FaqFormProps {
  operation: "add" | "edit" | "preview";
  defaultValues?: Partial<z.infer<typeof faqFormSchema>> & {
    id?: number;
  };
  onSuccess?: () => void;
}

const fields: FormFieldType[] = [
  { name: "question", label: "Question", type: "text" },
  { name: "answer", label: "Answer", type: "textArea" },
];

const FaqForm = ({ operation, defaultValues, onSuccess }: FaqFormProps) => {
  const [addItem, { isLoading: isLoadingAdd }] = useAddFaqMutation();
  const [updateItem, { isLoading: isLoadingEdit }] = useUpdateFaqMutation();

  return (
    <CrudForm
      schema={faqFormSchema}
      fields={fields}
      operation={operation}
      defaultValues={defaultValues}
      onAdd={(data) => addItem(data).unwrap()}
      onUpdate={(data) => updateItem(data).unwrap()}
      itemName="FAQ"
      onSuccess={onSuccess}
      isLoadingAdd={isLoadingAdd}
      isLoadingEdit={isLoadingEdit}
      isModal={false}
    />
  );
};

export default FaqForm;
