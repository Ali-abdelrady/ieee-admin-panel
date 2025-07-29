import { CloudUpload, X } from "lucide-react";
import * as React from "react";
import {
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { bytesToMB } from "@/services/helpers/numberHelper";

interface FileUploaderProps<TFieldValues extends FieldValues = FieldValues> {
  fileUploadConfig: {
    maxFiles: number;
    maxSize?: number;
    fileType: "video" | "image" | "all";
  };
  disabled?: boolean;
  form: UseFormReturn<TFieldValues>;
  field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>;
}
export default function FileUploadField({
  fileUploadConfig,
  form,
  field,
  disabled,
}: FileUploaderProps) {
  const isSingleFile = fileUploadConfig.maxFiles === 1;
  const files = React.useMemo(() => {
    if (!field.value) return [];

    const valueArray =
      isSingleFile && !Array.isArray(field.value) ? [field.value] : field.value;

    return valueArray.map((file: any) => {
      if (typeof file === "string") {
        // Create a mock file-like object from URL
        return {
          name: file.split("/").pop() || "image.jpg",
          type: "image/*", // or infer from extension
          url: file, // custom field to hold URL
          isExisting: true, // flag to differentiate
        };
      }
      return file; // real File object
    });
  }, [field.value, isSingleFile]);

  // Handle file value changes
  const handleValueChange = (newFiles: any[]) => {
    if (isSingleFile) {
      // For single file, set the first file or null
      field.onChange(newFiles[0] || null);
    } else {
      // For multiple files, set the array
      field.onChange(newFiles);
    }
  };

  return (
    <>
      <FormControl>
        <FileUpload
          disabled={disabled}
          value={files}
          onValueChange={handleValueChange}
          accept={
            fileUploadConfig.fileType === "image"
              ? "image/*"
              : fileUploadConfig.fileType === "video"
              ? "video/*"
              : "image/*,video/*"
          }
          maxFiles={fileUploadConfig.maxFiles}
          maxSize={fileUploadConfig.maxSize ?? 5 * 1024 * 1024}
          onFileReject={(_, message) => {
            form.setError(field.name, { message }); // Was "files" before
          }}
          multiple={!isSingleFile}
        >
          <FileUploadDropzone className="flex-row border-dotted">
            <CloudUpload className="size-4" />
            Drag and drop or
            <FileUploadTrigger asChild>
              <Button variant="link" size="sm" className="p-0">
                choose files
              </Button>
            </FileUploadTrigger>
            to upload
          </FileUploadDropzone>
          <FileUploadList>
            {files.map((file, index) => (
              <FileUploadItem key={index} value={file}>
                <FileUploadItemPreview />
                <FileUploadItemMetadata />
                <FileUploadItemDelete asChild>
                  <Button variant="ghost" size="icon" className="size-7">
                    <X />
                    <span className="sr-only">Delete</span>
                  </Button>
                </FileUploadItemDelete>
              </FileUploadItem>
            ))}
          </FileUploadList>
        </FileUpload>
      </FormControl>
      <FormDescription>
        {isSingleFile
          ? `Upload a ${fileUploadConfig.fileType} up to ${bytesToMB(
              fileUploadConfig.maxSize ?? 5 * 1024 * 1024
            )}`
          : `Upload up to ${fileUploadConfig.maxFiles} files up to ${bytesToMB(
              fileUploadConfig.maxSize ?? 5 * 1024 * 1024
            )} each.`}
      </FormDescription>
      {/* <FormMessage />/ */}
    </>
  );
}
