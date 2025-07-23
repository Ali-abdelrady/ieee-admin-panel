// src/app/board/_components/boardForm.tsx
import { CrudForm } from "@/components/crudForm";
import { z } from "zod";
import { FormFieldType } from "@/types";
import { boardFormSchema } from "@/validations/board";
import {
  useAddBoardMutation,
  useUpdateBoardMutation,
} from "@/services/Api/board";
import { useFieldArray } from "react-hook-form";
import { parseSocialLinks } from "@/components/forms/SocialLinksManger";

interface BoardFormProps {
  operation: "add" | "edit" | "preview";
  defaultValues?: Partial<z.infer<typeof boardFormSchema>> & {
    id?: number;
  };
  onSuccess?: () => void;
}

const BoardForm = ({ operation, defaultValues, onSuccess }: BoardFormProps) => {
  const [addItem, { isLoading: isLoadingAdd }] = useAddBoardMutation();
  const [updateItem, { isLoading: isLoadingEdit }] = useUpdateBoardMutation();

  const fields: FormFieldType[] = [
    { name: "name", label: "Full Name", type: "text" },
    {
      name: "position",
      label: "Position",
      type: "select",
      options: [
        { label: "counselor", value: "counselor" },
        { label: "excom", value: "excom" },
        { label: "vice", value: "vice" },
        { label: "head", value: "head" },
      ],
    },
    { name: "title", label: "Title", type: "text" },
    { name: "image", label: "Profile Image", type: "file" },
    {
      name: "socialLinks",
      label: "Social Links",
      type: "dynamicArrayField",
      dynamicArrayFieldsConfig: {
        fields: [
          { name: "url", label: "Url", type: "text" },
          {
            name: "platform",
            label: "Platform",
            type: "select",
            options: [
              { value: "facebook", label: "Facebook" },
              { value: "twitter", label: "Twitter" },
              { value: "instagram", label: "Instagram" },
              { value: "linkedin", label: "LinkedIn" },
              { value: "behance", label: "Behance" },
            ],
          },
        ],
        itemName: "socialLink",
      },
    },
  ];

  return (
    <CrudForm
      schema={boardFormSchema}
      fields={fields}
      operation={operation}
      defaultValues={{
        ...defaultValues,
        socialLinks: parseSocialLinks(defaultValues?.socialLinks),
      }}
      onAdd={(data) => addItem(data).unwrap()}
      onUpdate={(data) => updateItem(data).unwrap()}
      itemName="Board Member"
      isLoadingAdd={isLoadingAdd}
      isLoadingEdit={isLoadingEdit}
    />
  );
};

export default BoardForm;
