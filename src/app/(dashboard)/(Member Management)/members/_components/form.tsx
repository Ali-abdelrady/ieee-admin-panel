import { CrudForm } from "@/components/crudForm";
import { z } from "zod";
import { FormFieldType } from "@/types";
import {
  useAddPermissionMutation,
  useUpdatePermissionMutation,
} from "@/services/Api/userManagement/premissions";
import { permissionSchema } from "@/validations/userManagement/premissions";
import { PermissionType } from "@/types/userManagement/premissions";

interface PermissionFormProps {
  operation: "add" | "edit" | "preview";
  defaultValues?: PermissionType;
  onSuccess?: () => void;
}

const fields: FormFieldType[] = [
  { name: "title", label: "Title", type: "text" },
];

const PermissionForm = ({
  operation,
  defaultValues,
  onSuccess,
}: PermissionFormProps) => {
  const [addItem, { isLoading: isLoadingAdd }] = useAddPermissionMutation();
  const [updateItem, { isLoading: isLoadingEdit }] =
    useUpdatePermissionMutation();

  return (
    <CrudForm
      schema={permissionSchema}
      fields={fields}
      operation={operation}
      defaultValues={defaultValues}
      onAdd={(data) => addItem(data).unwrap()}
      onUpdate={(data) => updateItem(data).unwrap()}
      itemName="Permission"
      onSuccess={onSuccess}
      isLoadingAdd={isLoadingAdd}
      isLoadingEdit={isLoadingEdit}
    />
  );
};

export default PermissionForm;
