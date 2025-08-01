// src/app/posts/_components/postForm.tsx
import { CrudForm } from "@/components/crudForm";
import { z } from "zod";
import { FormFieldType } from "@/types";
import { postFormSchema } from "@/validations/post";
import { useAddPostMutation, useUpdatePostMutation } from "@/services/Api/post";

interface PostFormProps {
  operation: "add" | "edit" | "preview";
  defaultValues?: Partial<z.infer<typeof postFormSchema>> & {
    id?: number;
  };
}

const fields: FormFieldType[] = [
  { name: "title", label: "Title", type: "text" },
  { name: "content", label: "Content", type: "textArea" },
  {
    name: "images",
    label: "Images",
    type: "file",
    fileUploadConfig: {
      fileType: "image",
      maxFiles: 1,
    },
  },
  {
    name: "private",
    label: "Members Only",
    type: "checkbox",
  },
];

const PostForm = ({ operation, defaultValues }: PostFormProps) => {
  const [addItem, { isLoading: isLoadingAdd }] = useAddPostMutation();
  const [updateItem, { isLoading: isLoadingEdit }] = useUpdatePostMutation();

  return (
    <CrudForm
      schema={postFormSchema}
      fields={fields}
      operation={operation}
      defaultValues={defaultValues}
      onAdd={(data) => addItem(data).unwrap()}
      onUpdate={(data) => updateItem(data).unwrap()}
      itemName="Post"
      isLoadingAdd={isLoadingAdd}
      isLoadingEdit={isLoadingEdit}
    />
  );
};

export default PostForm;
