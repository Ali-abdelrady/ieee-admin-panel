import { CloudUpload, X } from "lucide-react";
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
import { useEffect, useMemo, useState } from "react";
export interface PreviewFile {
  url: string;
  name: string;
  type: string;
  isExisting: true;
}
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
  const [removedPreviewUrls, setRemovedPreviewUrls] = useState<string[]>([]);
  const isSingleFile = fileUploadConfig.maxFiles === 1;
  const { previewFiles, actualFiles } = useMemo(() => {
    if (!field.value) return { previewFiles: [], actualFiles: [] };

    const valueArray =
      isSingleFile && !Array.isArray(field.value) ? [field.value] : field.value;

    const previewFiles: PreviewFile[] = [];
    const actualFiles: File[] = [];

    valueArray.forEach((file: any) => {
      if (typeof file === "string") {
        previewFiles.push({
          name: file.split("/").pop() || "image.jpg",
          type: "image/*", // optional: infer from extension
          url: file,
          isExisting: true,
        });
      } else if (file instanceof File) {
        actualFiles.push(file);
      }
    });

    return { previewFiles, actualFiles };
  }, [field.value, isSingleFile]);

  console.log("previewFile", previewFiles);
  console.log("actualFiles", actualFiles);
  // Handle file value changes
  const handleValueChange = (newFiles: File[]) => {
    const currentFiles = field.value || [];

    // Get existing preview file URLs (not removed)
    const existingPreviewUrls = previewFiles
      .filter((file) => !removedPreviewUrls.includes(file.url))
      .map((file) => file.url);

    // Combine preserved preview URLs and new files
    const updatedValue = [...existingPreviewUrls, ...newFiles];

    // Set form field value
    if (isSingleFile) {
      field.onChange(updatedValue[0] || null);
    } else {
      field.onChange(updatedValue);
    }
  };

  // Handle preview file removal
  const handleRemovePreview = (url: string) => {
    setRemovedPreviewUrls((prev) => [...prev, url]);
    // // Update form field immediately
    // if (isSingleFile) {
    //   field.onChange(null);
    // } else {
    //   const newValue = (field.value || []).filter((item: any) => item !== url);
    //   field.onChange(newValue);
    // }
  };
  // Submit removed URLs to form context
  useEffect(() => {
    form.setValue("removedImages", removedPreviewUrls);
  }, [removedPreviewUrls, form]);
  console.log("removed Urls", removedPreviewUrls);

  return (
    <>
      <FormControl>
        <div>
          <FileUpload
            disabled={disabled}
            value={actualFiles}
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
              {actualFiles.map((file, index) => (
                <FileUploadItem key={`actual-${index}`} value={file}>
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
          {previewFiles.filter((f) => !removedPreviewUrls.includes(f.url))
            .length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Existing Files</h4>
              <div className="space-y-2">
                {previewFiles
                  .filter((file) => !removedPreviewUrls.includes(file.url))
                  .map((file, index) => (
                    <div
                      key={`preview-${index}`}
                      className="flex items-center p-3 border rounded-md"
                    >
                      <div className="flex-shrink-0">
                        <img
                          src={file.url}
                          alt={file.name}
                          className="size-10 object-cover rounded-md"
                        />
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Uploaded
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => handleRemovePreview(file.url)}
                      >
                        <X />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
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
