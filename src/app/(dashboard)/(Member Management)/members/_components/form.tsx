// src/app/member/_components/memberForm.tsx
import { CrudForm } from "@/components/crudForm";
import { z } from "zod";
import { FormFieldType } from "@/types";
import { memberFormSchema } from "@/validations/member";
import {
  useAddMemberMutation,
  useUpdateMemberMutation,
} from "@/services/Api/member";

interface MemberFormProps {
  operation: "add" | "edit" | "preview";
  defaultValues?: Partial<z.infer<typeof memberFormSchema>> & {
    id?: number;
  };
}

const MemberForm = ({ operation, defaultValues }: MemberFormProps) => {
  const [addItem, { isLoading: isLoadingAdd }] = useAddMemberMutation();
  const [updateItem, { isLoading: isLoadingEdit }] = useUpdateMemberMutation();

  const fields: FormFieldType[] = [
    { name: "name", label: "Full Name", type: "text" },
    { name: "email", label: "Email", type: "email" },

    { name: "personalEmail", label: "Personal Email", type: "email" },
    {
      name: "password",
      label: "Password",
      type: "text",
    },
    { name: "phone", label: "Phone", type: "text" },
    { name: "university", label: "University", type: "text" },
    { name: "faculty", label: "Faculty", type: "text" },
    {
      name: "role",
      label: "Role",
      type: "select",
      options: [
        { label: "Attendee", value: "ATTENDEE" },
        { label: "Member", value: "MEMBER" },
        { label: "Head", value: "HEAD" },
        { label: "ExCom", value: "EXCOM" },
      ],
    },
  ];

  return (
    <CrudForm
      schema={memberFormSchema}
      fields={fields}
      operation={operation}
      defaultValues={defaultValues}
      onAdd={(data) => addItem({ data }).unwrap()}
      onUpdate={(data) => updateItem({ data, memberId: data.id }).unwrap()}
      itemName="Member"
      isLoadingAdd={isLoadingAdd}
      isLoadingEdit={isLoadingEdit}
    />
  );
};

export default MemberForm;
