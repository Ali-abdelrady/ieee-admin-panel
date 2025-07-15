// src/app/partners/_components/form.tsx
import { CrudForm } from "@/components/crudForm";
import { z } from "zod";
import { FormFieldType } from "@/types";
import { partnerFormSchema } from "@/validations/partners";
import {
  useAddPartnerMutation,
  useUpdatePartnerMutation,
} from "@/services/Api/partners";

interface PartnerFormProps {
  operation: "add" | "edit" | "preview";
  defaultValues?: Partial<z.infer<typeof partnerFormSchema>> & {
    id?: number;
  };
  onSuccess?: () => void;
}

const PartnerForm = ({
  operation,
  defaultValues,
  onSuccess,
}: PartnerFormProps) => {
  const [addItem, { isLoading: isLoadingAdd }] = useAddPartnerMutation();
  const [updateItem, { isLoading: isLoadingEdit }] = useUpdatePartnerMutation();

  const fields: FormFieldType[] = [
    { name: "name", label: "Name", type: "text" },
    { name: "image", label: "Logo", type: "file" },
    {
      name: "isSeasonPartner",
      label: "Season Partner",
      type: "checkbox",
    },
  ];

  return (
    <CrudForm
      schema={partnerFormSchema}
      fields={fields}
      operation={operation}
      defaultValues={defaultValues}
      onAdd={(data) => addItem(data).unwrap()}
      onUpdate={(data) => updateItem(data).unwrap()}
      itemName="Partner"
      onSuccess={onSuccess}
      isLoadingAdd={isLoadingAdd}
      isLoadingEdit={isLoadingEdit}
      isModal={false}
    />
  );
};

export default PartnerForm;
