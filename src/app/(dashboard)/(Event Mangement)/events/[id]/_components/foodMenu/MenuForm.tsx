// src/app/faq/_components/MenuForm.tsx
import { CrudForm } from "@/components/crudForm";
import { z } from "zod";
import { FormFieldType } from "@/types";
import { useAddFaqMutation, useUpdateFaqMutation } from "@/services/Api/faq";
import {
  useAddMenuMutation,
  useUpdateMenuMutation,
} from "@/services/Api/foodMenu";
import { foodMenuSchema } from "@/validations/foodMenu";

interface MenuFormProps {
  operation: "add" | "edit" | "preview";
  defaultValues?: Partial<z.infer<typeof foodMenuSchema>> & {
    id?: number;
  };
  eventId: string;
  trigger: React.ReactNode;
}

const fields: FormFieldType[] = [
  {
    name: "name",
    label: "Menu Name",
    type: "text",
    placeholder: "Enter Menu Name",
  },
  {
    name: "menuImagUrl",
    label: "Menu Images",
    type: "dynamicArrayField",
    dynamicArrayFieldsConfig: {
      isSimpleArray: true,
      addButtonLabel: "Add New Menu",
      itemName: "menu",
    },
  },
];

const MenuForm = ({
  operation,
  defaultValues,
  eventId,
  trigger,
}: MenuFormProps) => {
  const [addMenu, { isLoading: isLoadingAdd }] = useAddMenuMutation();
  const [updateMenu, { isLoading: isLoadingEdit }] = useUpdateMenuMutation();

  return (
    <CrudForm
      schema={foodMenuSchema}
      fields={fields}
      operation={operation}
      defaultValues={defaultValues}
      onAdd={(data) => addMenu({ eventId, data }).unwrap()}
      onUpdate={(data) => updateMenu({ eventId, data }).unwrap()}
      itemName="Food Menu"
      isLoadingAdd={isLoadingAdd}
      isLoadingEdit={isLoadingEdit}
      trigger={trigger}
    />
  );
};

export default MenuForm;
