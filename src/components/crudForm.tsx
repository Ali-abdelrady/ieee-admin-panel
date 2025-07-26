"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Path, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomDialog } from "@/components/forms/customModal";

import PreviewButton from "./button/previewButton";
import Image from "next/image";
import { FormFieldType } from "@/types";
import { CalendarIcon, FileIcon, Loader2, X } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";

import { cn, prepareRequestPayload } from "@/lib/utils";
import { format } from "date-fns";
import { DynamicKeyValueForm } from "./forms/dynamicFormBuilder";
import { Badge } from "./ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command";
import { SelectInputTypeField } from "./forms/selectInputTypeField";

import cookieService from "@/services/cookies/cookieService";
import React, { useEffect, useRef, useState } from "react";
import ImportDialog from "@/components/dialogs/importDialog";
import AddButton from "./button/addButton";
import EditButton from "./button/editButton";
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { triggerCloseAll } from "@/services/store/features/dialogSlice";
import Stepper from "@/components/Stepper";
import { useWatch } from "react-hook-form";
import SocialLinksManager, {
  parseSocialLinks,
} from "./forms/SocialLinksManger";
import TopicsBuilder from "./forms/TopicsBuilder";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import DynamicArrayField from "./forms/DynamicArrayFields";

interface CrudFormProps<T extends z.ZodTypeAny> {
  schema: T;
  fields: FormFieldType[];
  operation: "add" | "edit" | "preview";
  defaultValues?: Partial<z.infer<T>> & { id?: number };
  onAdd?: (data: z.infer<T>) => Promise<any>;
  onUpdate?: (data: { id: number } & z.infer<T>) => Promise<any>;
  itemName: string;
  isLoadingAdd?: boolean;
  isLoadingEdit?: boolean;
  asDialog?: boolean;
  trigger?: React.ReactNode;
}
export const CrudForm = <T extends z.ZodTypeAny>({
  schema,
  fields: theFields,
  operation,
  defaultValues,
  onAdd,
  onUpdate,
  itemName,
  isLoadingAdd = false,
  isLoadingEdit = false,
  asDialog = true,
  trigger,
}: CrudFormProps<T>) => {
  const [fields, setFields] = useState<FormFieldType[]>(theFields);

  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues: fields?.reduce((acc, field) => {
      let value = defaultValues?.[field.name];
      if (field.type === "date" && typeof value === "string") {
        value = new Date(value);
      }
      if (field.type === "checkbox") {
        value = value === 1; // Convert 1/0 to true/false
      }
      if (field.type === "selectInputType") {
        value = typeof value === "string" ? value : JSON.stringify(value);
      }
      if (field.type === "dynamicArrayField") {
        // Ensure the value is a string (or the expected type used in select's options)
        value = value ?? [];
      }
      if (field.type === "select") {
        // Ensure the value is a string (or the expected type used in select's options)
        value = value !== undefined ? String(value) : "";
      }
      if (field.type === "socialLinks") {
        value = parseSocialLinks(value);
      }
      acc[field.name] = value ?? "";
      return acc;
    }, {} as Record<string, any>) as z.infer<T>,
  });

  const handleFormSubmit = (): Promise<boolean> => {
    return new Promise(async (resolve) => {
      // First trigger validation
      const isValid = await form.trigger();

      if (!isValid) {
        // Get current form values
        const formValues = form.getValues();
        console.log("Form State:", form.formState);
        console.group("Validation Error Details");
        console.log("Current Form Values:", formValues);
        console.log("Validation Errors:", form.formState.errors);
        console.groupEnd();

        // Show errors to user
        Object.entries(form.formState.errors).forEach(([field, error]) => {
          toast.error(
            `${field}: ${(error as any)?.message || "Validation error"}`
          );
        });

        resolve(false);
        return;
      }

      try {
        // Get form values directly
        const formData = form.getValues();
        console.log("Form State:", form.formState);
        console.group("Form Submission Data");
        console.log("Form data before submission:", formData);
        console.groupEnd();

        // Call onSubmit directly
        const result = await onSubmit(formData);

        console.log("Submission result:", result);

        resolve(result);
      } catch (error) {
        console.error("Error in form submission:", error);
        toast.error("An unexpected error occurred during submission");
        resolve(false);
      }
    });
  };

  const onSubmit = async (formData: z.infer<T>): Promise<boolean> => {
    // Create a copy to avoid mutating the original
    const payloadData = { ...formData };

    if (payloadData.socialLinks) {
      // Transform to the correct format and stringify
      payloadData.socialLinks = JSON.stringify(
        payloadData.socialLinks.map((link: any) => ({
          url: link.url,
          icon: link.platform,
          name: link.platform,
        }))
      );
    }

    console.log("FormData before prepareRequestPayload:", formData);
    console.log("PayloadData after transformation:", payloadData);

    const payload = prepareRequestPayload(payloadData); // Note: pass payloadData, not formData
    console.log(payload);
    try {
      if (operation === "add") {
        await onAdd?.(payload);
        toast.success(`${itemName} added successfully`);
      } else {
        if (!defaultValues?.id) throw new Error("Missing ID for update");

        if (payload instanceof FormData) {
          payload.append("id", defaultValues.id.toString());
          await onUpdate?.(payload as any);
        } else {
          await onUpdate?.({ id: defaultValues.id, ...payload });
        }
        toast.success(`${itemName} updated successfully`);
      }

      form.reset();

      return true;
    } catch (err: any) {
      console.error("Submission error:", err);
      toast.error(err?.data?.message || "An unknown error occurred");
      return false;
    }
  };

  const getTriggerButton = () => {
    switch (operation) {
      case "add":
        return <AddButton label={itemName} />;
      case "edit":
        return (
          <EditButton label={itemName} variant={"outline"} asIcon={true} />
        );
      case "preview":
        return (
          <PreviewButton label={itemName} variant={"outline"} asIcon={true} />
        ); // Replace with your own
      default:
        return null;
    }
  };

  if (!asDialog) {
    return (
      <FormDetails
        fields={fields}
        operation={operation}
        defaultValues={defaultValues}
        form={form}
      />
    );
  }

  return (
    <CustomDialog
      trigger={trigger ?? getTriggerButton()}
      title={
        operation === "add"
          ? `Add ${itemName}`
          : operation === "edit"
          ? `Update ${itemName}`
          : `Preview ${itemName}`
      }
      actionLabel={
        operation === "preview"
          ? undefined
          : operation === "add"
          ? "Save"
          : "Update"
      }
      isLoading={operation === "add" ? isLoadingAdd : isLoadingEdit}
      onSubmit={operation === "preview" ? undefined : handleFormSubmit}
    >
      <div className="max-h-[70vh] overflow-y-auto">
        <FormDetails
          fields={fields}
          operation={operation}
          defaultValues={defaultValues}
          form={form}
        />
      </div>
    </CustomDialog>
  );
};

interface FormProps<T extends z.ZodTypeAny> {
  form: UseFormReturn<z.TypeOf<T>, any, z.TypeOf<T>>;
  fields: FormFieldType[];
  operation: "add" | "edit" | "preview";
  defaultValues?: Partial<z.infer<T>> & { id?: number };
}
function FormDetails<T extends z.ZodTypeAny>({
  form,
  fields,
  defaultValues,
  operation,
}: FormProps<T>) {
  return (
    <Form {...form}>
      <div className="space-y-4">
        {fields?.map((fieldItem) => (
          <FormField
            key={fieldItem.name}
            control={form.control}
            name={fieldItem.name as Path<z.infer<T>>}
            render={({ field }) => (
              <FormItem
                className={`${
                  fieldItem.type === "checkbox" ? "flex gap-3" : ""
                }`}
              >
                <FormLabel>
                  {["topics", "socialLinks"].includes(fieldItem.type)
                    ? ""
                    : fieldItem.label}
                </FormLabel>
                {(fieldItem.type === "text" ||
                  fieldItem.type === "email" ||
                  fieldItem.type === "number") && (
                  <FormControl>
                    <Input
                      placeholder={fieldItem.label}
                      type={fieldItem.type}
                      {...field}
                      disabled={operation === "preview" || fieldItem?.readonly}
                      min={fieldItem.type === "number" ? 0 : undefined}
                    />
                  </FormControl>
                )}
                {fieldItem.type === "textArea" && (
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={fieldItem.label}
                      disabled={operation === "preview"}
                    />
                  </FormControl>
                )}
                {fieldItem.type === "checkbox" && (
                  <FormControl>
                    <Checkbox
                      checked={field.value as boolean}
                      onCheckedChange={field.onChange}
                      disabled={operation === "preview"}
                    />
                  </FormControl>
                )}
                {fieldItem.type === "switch" && (
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={operation === "preview"}
                      defaultChecked={false}
                    />
                  </FormControl>
                )}
                {fieldItem.type === "select" && (
                  <FormControl>
                    <Select
                      value={field.value?.toString()} // ensure it's string
                      onValueChange={field.onChange}
                      disabled={operation === "preview"}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${fieldItem.label}`}>
                          {fieldItem.options?.find(
                            (option) =>
                              option.value.toString() ===
                              field.value?.toString()
                          )?.label ?? `Select ${fieldItem.label}`}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {fieldItem.options?.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value.toString()}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                )}

                {fieldItem.type === "file" && (
                  <FormControl>
                    <div className="space-y-2">
                      <Input
                        type="file"
                        disabled={operation === "preview"}
                        // onChange={(e) => {
                        //   const file = e.target.files?.[0];
                        //   form.setValue(
                        //     fieldItem.name as Path<z.infer<T>>,
                        //     file || null // Always set to File or null, never undefined
                        //   );
                        // }}
                        onChange={(e) => field.onChange(e.target.files[0])}
                        multiple
                      />

                      {field.value?.original_url && (
                        <div className="space-y-2">
                          <a
                            href={field.value.original_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-fit"
                          >
                            {field.value.mime_type?.startsWith("image/") ? (
                              <Image
                                src={field.value.original_url}
                                alt="Current file"
                                width={100}
                                height={100}
                                className="h-32 rounded-md object-cover"
                              />
                            ) : (
                              <div className="p-2 border rounded flex items-center gap-2">
                                <FileIcon className="w-5 h-5" />
                                <span>{field.value.file_name}</span>
                              </div>
                            )}
                          </a>
                        </div>
                      )}
                    </div>
                  </FormControl>
                )}
                {fieldItem.type === "date" &&
                  (() => {
                    const [open, setOpen] = useState(false);
                    return (
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                                operation === "preview" &&
                                  "cursor-not-allowed opacity-50"
                              )}
                              type="button"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        {operation !== "preview" && (
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                field.onChange(date);
                                setOpen(false); // close after date is selected
                              }}
                              disabled={(date) => date < new Date("1900-01-01")}
                              autoFocus
                            />
                          </PopoverContent>
                        )}
                      </Popover>
                    );
                  })()}
                {fieldItem.type === "topics" && (
                  <FormControl>
                    <TopicsBuilder
                      name={fieldItem.name}
                      disabled={operation === "preview"}
                      defaultValues={field.value} // Pass the value from the form field
                    />
                  </FormControl>
                )}
                {fieldItem.type === "socialLinks" && (
                  <FormControl>
                    <SocialLinksManager
                      name={fieldItem.name}
                      disabled={operation === "preview"}
                    />
                  </FormControl>
                )}
                {fieldItem.type === "multiSelect" && (
                  <FormControl>
                    <div className="space-y-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !(field.value as any[])?.length &&
                                "text-muted-foreground",
                              operation === "preview" &&
                                "cursor-not-allowed opacity-50"
                            )}
                            disabled={operation === "preview"}
                          >
                            {(field.value as any[])?.length
                              ? (field.value as any[]).length ===
                                fieldItem.options?.length
                                ? "All selected"
                                : (field.value as any[]).length === 1
                                ? fieldItem.options?.find(
                                    (option) =>
                                      option.value === (field.value as any[])[0]
                                  )?.label
                                : `${(field.value as any[]).length} selected`
                              : `Select ${fieldItem.label}`}
                          </Button>
                        </PopoverTrigger>
                        {operation !== "preview" && (
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput
                                placeholder={`Search ${fieldItem.label}...`}
                                className="h-9"
                              />
                              <div className="flex space-x-2 p-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 px-2"
                                  onClick={() => {
                                    field.onChange(
                                      fieldItem.options?.map(
                                        (option) => option.value
                                      ) || []
                                    );
                                  }}
                                >
                                  Select All
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 px-2"
                                  onClick={() => {
                                    field.onChange([]);
                                  }}
                                >
                                  Deselect All
                                </Button>
                              </div>
                              <CommandEmpty>
                                No {fieldItem.label} found.
                              </CommandEmpty>
                              <CommandGroup className="max-h-64 overflow-y-auto">
                                {fieldItem.options?.map((option) => {
                                  const isSelected = (
                                    field.value as any[]
                                  )?.includes(option.value);
                                  return (
                                    <CommandItem
                                      key={option.value}
                                      onSelect={() => {
                                        const currentValue =
                                          (field.value as any[]) || [];
                                        if (isSelected) {
                                          field.onChange(
                                            currentValue.filter(
                                              (val) => val !== option.value
                                            )
                                          );
                                        } else {
                                          field.onChange([
                                            ...currentValue,
                                            option.value,
                                          ]);
                                        }
                                      }}
                                    >
                                      <div className="flex items-center space-x-2">
                                        <Checkbox checked={isSelected} />
                                        <span>{option.label}</span>
                                      </div>
                                    </CommandItem>
                                  );
                                })}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        )}
                      </Popover>
                      {(field.value as any[])?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {(field.value as any[]).map((value: any) => {
                            const option = fieldItem.options?.find(
                              (opt) => opt.value == value
                            );
                            return (
                              <Badge
                                key={value}
                                variant="secondary"
                                className="flex items-center gap-1"
                              >
                                {option?.label}
                                {operation !== "preview" && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      field.onChange(
                                        (field.value as any[]).filter(
                                          (val) => val !== value
                                        )
                                      );
                                    }}
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                )}
                              </Badge>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </FormControl>
                )}
                {fieldItem.type === "dynamicArrayField" && (
                  <FormControl>
                    <DynamicArrayField
                      minItems={1}
                      name={fieldItem.name}
                      addButtonLabel={
                        fieldItem.dynamicArrayFieldsConfig?.addButtonLabel ??
                        fieldItem.label
                      }
                      disabled={operation == "preview"}
                      simpleArray={
                        fieldItem.dynamicArrayFieldsConfig?.isSimpleArray
                      }
                      itemName={
                        fieldItem.dynamicArrayFieldsConfig?.itemName ?? "item"
                      }
                      fieldsConfig={fieldItem.dynamicArrayFieldsConfig?.fields}
                    />
                  </FormControl>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    </Form>
  );
}
