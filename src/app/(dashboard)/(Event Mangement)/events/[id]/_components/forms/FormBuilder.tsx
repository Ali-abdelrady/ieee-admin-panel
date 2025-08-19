import React, { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown, Edit, User, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormField, FormControl, FormItem, FormLabel } from "@/components/ui/form";
import {
  FormFieldType as EventFormField,
  FieldType,
  FormType as EventForm,
} from "@/types/forms";
import { toast } from "sonner";
import RulesEditor from "./RulesEditor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { z } from "zod";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FileUploadField from "@/components/forms/fields/FileUploader";
import { CopyButton } from "@/components/copyButton";

interface FormBuilderProps {
  form?: EventForm;
  onSave: (fd: FormData) => void; // unchanged consumer contract (multipart)
}

/* ----------------------------- Zod Schemas ----------------------------- */

const fieldTypeEnum = z.enum([
  "TEXT",
  "FILE",
  "EMAIL",
  "NUMBER",
  "TEXTAREA",
  "SELECT",
  "RADIO",
  "CHECKBOX",
  "DATE",
]);

const fieldSchema = z.object({
  id: z.string(),
  name: z.string().min(0),
  label: z.string().min(1, "Label is required"),
  type: fieldTypeEnum,
  placeholder: z.string().optional().nullable(),
  required: z.boolean().default(false),
  min: z.union([z.number(), z.string()]).optional().nullable(),
  max: z.union([z.number(), z.string()]).optional().nullable(),
  rules: z.any().optional().nullable(),
  options: z.array(z.string()).optional(),
  maxFileSize: z.union([z.number(), z.string()]).optional().nullable(),
});

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Form Title Required"),
  description: z.string().optional().nullable(),
  type: z.string().default("ANY"),
  isPublic: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  hasQrCode: z.boolean().default(false),
  isRegistrationForm: z.boolean().default(false),

  startDate: z.string().optional(),
  endDate: z.string().optional(),

  eventId: z.string().optional().nullable(),

  // image file (optional)
  image: z
    .any()
    .refine(
      (f) =>
        f === null ||
        f === undefined ||
        f instanceof File ||
        (Array.isArray(f) && f.length === 0) ||
        (Array.isArray(f) && f[0] instanceof File),
      "Invalid file"
    )
    .optional(),

  // dynamic fields
  fields: z.array(fieldSchema).min(1, "At least one field is required"),
});

/* --------------------------- Helper Functions -------------------------- */

function toISO(d?: string) {
  if (!d) return undefined;
  try {
    return new Date(d).toISOString();
  } catch {
    return undefined;
  }
}

const ACCEPTED = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const MAX_MB = 5;

/* ------------------------------ Component ------------------------------ */

const FormBuilder: React.FC<FormBuilderProps> = ({ form, onSave }) => {
  // editor (which field is being edited in the right pane)
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // RHF setup
  const defaultValues = useMemo(() => {
    const now = new Date().toISOString();
    const week = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    return {
      id: form?.id && !String(form.id).startsWith("form-") ? form.id : undefined,
      name: form?.name || "Registration Form",
      description: form?.description || "",
      type: form?.type || "ANY",
      isPublic: form?.isPublic || false,
      isPublished: form?.isPublished || false,
      hasQrCode: form?.hasQrCode || false,
      isRegistrationForm: form?.isRegistrationForm || false,
      startDate: form?.startDate || now,
      endDate: form?.endDate || week,
      eventId: (form as any)?.eventId || undefined,
      image: undefined, // file input; existing URL is shown separately
      fields: (form?.fields as EventFormField[])?.length
        ? (form!.fields as EventFormField[])
        : ([
            {
              id: `field-${Date.now()}`,
              name: "",
              label: "New Field",
              type: "TEXT",
              placeholder: "",
              required: false,
            },
          ] as any),
    };
  }, [form]);

  const rhf = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { isSubmitting },
  } = rhf;

  const { fields, append, remove, swap, update } = useFieldArray({
    control,
    name: "fields",
    keyName: "_key", // internal key
  });

  // Watchers
  const isRegistrationForm = useWatch({ control, name: "isRegistrationForm" });
  const hasQrCode = useWatch({ control, name: "hasQrCode" });
  const watchedImage = useWatch({ control, name: "image" });
  const nameVal = useWatch({ control, name: "name" });
  const descVal = useWatch({ control, name: "description" });
  const fieldsWatch = useWatch({ control, name: "fields" }); // array of fields from RHF
  const currentType =
    editingIndex !== null ? fieldsWatch?.[editingIndex]?.type : undefined;
  const currentOptions =
    editingIndex !== null ? fieldsWatch?.[editingIndex]?.options : undefined;
  // Image preview: prefer new file if selected; else existing URL from form
  const existingImageUrl = typeof form?.image === "string" ? form?.image : null;
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    // clean up blob URL
    return () => {
      if (blobUrl && blobUrl.startsWith("blob:")) URL.revokeObjectURL(blobUrl);
    };
  }, [blobUrl]);

  useEffect(() => {
    // reflect selected image
    const f = Array.isArray(watchedImage) ? watchedImage[0] : watchedImage;
    if (f instanceof File) {
      const url = URL.createObjectURL(f);
      if (blobUrl && blobUrl.startsWith("blob:")) URL.revokeObjectURL(blobUrl);
      setBlobUrl(url);
    } else {
      // cleared
      if (blobUrl && blobUrl.startsWith("blob:")) URL.revokeObjectURL(blobUrl);
      setBlobUrl(null);
    }
  }, [watchedImage]);

  /* --------------------------- Event Handlers --------------------------- */

  const onAddField = () => {
    const newField: EventFormField = {
      id: `field-${Date.now()}`,
      name: "",
      type: "TEXT",
      label: "New Field",
      placeholder: "",
      required: false,
    };
    append(newField);
    setEditingIndex(fields.length);
  };

  const onMoveField = (index: number, dir: "up" | "down") => {
    const newIndex = dir === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= fields.length) return;
    swap(index, newIndex);
    if (editingIndex === index) setEditingIndex(newIndex);
    else if (editingIndex === newIndex) setEditingIndex(index);
  };

  const onDeleteField = (index: number) => {
    remove(index);
    if (editingIndex === index) setEditingIndex(null);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // guard
    if (!values.name.trim()) {
      toast.error("Form Title Required", {
        description: "Please enter a title for the form.",
      });
      return;
    }
    if (!values.fields?.length) {
      toast.error("Fields Required", {
        description: "Please add at least one field to the form.",
      });
      return;
    }

    // Build multipart
    const fd = new FormData();
    const isUpdate = Boolean(values.id && !String(values.id).startsWith("form-"));
    if (isUpdate) fd.append("id", String(values.id));

    fd.append("name", values.name.trim());
    fd.append("type", String(values.type));
    if (values.description) fd.append("description", values.description);
    if (values.startDate) fd.append("startDate", toISO(values.startDate)!);
    if (values.endDate) fd.append("endDate", toISO(values.endDate)!);

    fd.append("isPublic", String(values.isPublic));
    fd.append("hasQRcode", String(values.hasQrCode));
    fd.append("isPublished", String(values.isPublished));
    fd.append("isRegistrationForm", String(values.isRegistrationForm));
    if (values.eventId) fd.append("eventId", String(values.eventId));

    // send fields exactly in array order; backend will rewrite sortOrder
    fd.append("fields", JSON.stringify(values.fields));

    const f = Array.isArray(values.image) ? values.image[0] : values.image;
    if (f instanceof File) fd.append("image", f);

    onSave(fd);
  };

  /* ------------------------------- Render ------------------------------- */

  return (
    <Form {...rhf}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Form Builder</h2>
            <p className="text-muted-foreground">
              Create a custom registration form for your event
            </p>
          </div>
          <div className="flex items-center gap-4">
            {form ? (
              <CopyButton
                link={
                  form
                    ? form?.eventId
                      ? `https://ieee-bub.org/events/${form?.eventId}/register`
                      : `https://ieee-bub.org/forms/${form?.id}`
                    : ""
                }
              />
            ) : (
              <Button
                type="button"
                disabled
                className="text-wrap flex items-center !max-w-[170px] w-[170px] py-6"
              >
                <Copy />
                <span className="  text-wrap over-flow-hidden">
                  Create then come back and copy
                </span>
              </Button>
            )}
            <div className="flex items-center gap-2">
              <Controller
                control={control}
                name="hasQrCode"
                render={({ field }) => (
                  <>
                    <Switch
                      id="published"
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        if (isRegistrationForm) {
                          toast.error(
                            "You can't disable qr code for event registartion form"
                          );
                          field.onChange(true);
                        } else {
                          field.onChange(checked);
                        }
                      }}
                    />
                    <Label htmlFor="published">QR Code</Label>
                  </>
                )}
              />
            </div>

            <div className="flex items-center gap-2">
              <Controller
                control={control}
                name="isPublished"
                render={({ field }) => (
                  <>
                    <Switch
                      id="published"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label htmlFor="published">Published</Label>
                  </>
                )}
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              Save Form
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Form Builder Panel */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Form Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Form Title</Label>
                  <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <Input id="name" {...field} placeholder="Enter form name" />
                    )}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Controller
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <Textarea
                        id="description"
                        {...field}
                        placeholder="Enter form description"
                        className="min-h-[100px]"
                      />
                    )}
                  />
                </div>

                {/* Image block (same styling) */}
                <FormField
                  control={control}
                  name="image"
                  render={({ field }) => {
                    const value = field.value;
                    return (
                      <FormItem>
                        <FormLabel>form cover image</FormLabel>
                        {value && typeof value === "string" && (
                          <div className="mb-2">
                            <Avatar className="w-16 h-16">
                              <AvatarImage src={value} alt="Current form image" />
                              <AvatarFallback>
                                <User />
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        )}
                        <FileUploadField
                          field={field}
                          form={rhf}
                          fileUploadConfig={{
                            fileType: "image",
                            maxFiles: 1,
                          }}
                        />
                      </FormItem>
                    );
                  }}
                />
              </CardContent>
            </Card>

            <Card className="max-h-[600px] overflow-y-auto">
              <CardHeader className="flex sticky top-0  backdrop-blur-2xl bg-gray-50 py-4 flex-row items-center justify-between">
                <CardTitle>Form Fields</CardTitle>
                <Button type="button" size="sm" onClick={onAddField}>
                  <Plus className="mr-2 h-4 w-4" /> Add Field
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    No fields added yet. Click &quot;Add Field&quot; to start building
                    your form.
                  </p>
                ) : (
                  fields.map((field, index) => {
                    const f = fieldsWatch[index] ?? field; // <-- live values
                    return (
                      <Card
                        key={f.id}
                        className={index === editingIndex ? "border-primary" : ""}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{f.label}</h4>
                              <p className="text-sm text-muted-foreground">
                                {f.type} {f.required && "(Required)"}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                disabled={index === 0}
                                onClick={() => onMoveField(index, "up")}
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                disabled={index === fields.length - 1}
                                onClick={() => onMoveField(index, "down")}
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditingIndex(index)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => onDeleteField(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>

          {/* Field Editor / Preview */}
          <div>
            {editingIndex !== null ? (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Field</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Field Type */}
                  <div>
                    <Label htmlFor="field-type">Field Type</Label>
                    <Controller
                      control={control}
                      name={`fields.${editingIndex}.type`}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(val) => {
                            const t = val as FieldType;
                            field.onChange(t);

                            const needsOptions = ["SELECT", "RADIO", "CHECKBOX"].includes(
                              t
                            );
                            setValue(
                              `fields.${editingIndex}.options`,
                              needsOptions
                                ? currentOptions?.length
                                  ? currentOptions
                                  : ["Option 1"]
                                : undefined,
                              { shouldDirty: true, shouldValidate: false }
                            );
                            // rules are field-type specific, clear on change
                            setValue(`fields.${editingIndex}.rules`, undefined, {
                              shouldDirty: true,
                              shouldValidate: false,
                            });
                          }}
                        >
                          <SelectTrigger id="field-type">
                            <SelectValue placeholder="Select a field type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TEXT">Text</SelectItem>
                            <SelectItem value="FILE">File</SelectItem>
                            <SelectItem value="EMAIL">Email</SelectItem>
                            <SelectItem value="NUMBER">Number</SelectItem>
                            <SelectItem value="TEXTAREA">Text Area</SelectItem>
                            <SelectItem value="SELECT">Dropdown</SelectItem>
                            <SelectItem value="RADIO">Radio Buttons</SelectItem>
                            <SelectItem value="CHECKBOX">Checkboxes</SelectItem>
                            <SelectItem value="DATE">Date</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  {/* Label */}
                  <div>
                    <Label htmlFor="field-label">Label</Label>
                    <Controller
                      control={control}
                      name={`fields.${editingIndex}.label`}
                      render={({ field }) => <Input id="field-label" {...field} />}
                    />
                  </div>

                  {/* Placeholder */}
                  <div>
                    <Label htmlFor="field-placeholder">Placeholder (Optional)</Label>
                    <Controller
                      control={control}
                      name={`fields.${editingIndex}.placeholder`}
                      render={({ field }) => (
                        <Input
                          id="field-placeholder"
                          {...field}
                          value={field.value || ""}
                        />
                      )}
                    />
                  </div>

                  {currentType === "FILE" && (
                    <div>
                      <Label htmlFor="field-maxsize">Max size</Label>
                      <div className="flex gap-2 items-center">
                        <Controller
                          control={control}
                          name={`fields.${editingIndex}.maxFileSize`}
                          render={({ field }) => (
                            <Input
                              id="field-maxsize"
                              type="number"
                              className="max-w-[180px]"
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(e.target.value ? +e.target.value : null)
                              }
                            />
                          )}
                        />
                        <span className="font-semibold">MB</span>
                        <span className="text-sm text-muted-foreground italic">
                          default is 10 mb
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Rules */}
                  {["TEXT", "NUMBER", "TEXTAREA", "EMAIL"].includes(
                    currentType || ""
                  ) && (
                    <div className="space-y-2 pt-2">
                      <Label>Validation Rules</Label>
                      <Controller
                        control={control}
                        name={`fields.${editingIndex}.rules`}
                        render={({ field }) => (
                          <RulesEditor
                            fieldType={
                              getValues(`fields.${editingIndex}.type`) as FieldType
                            }
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </div>
                  )}

                  {/* Required / Min / Max */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Controller
                        control={control}
                        name={`fields.${editingIndex}.required`}
                        render={({ field }) => (
                          <>
                            <Switch
                              id="field-required"
                              checked={!!field.value}
                              onCheckedChange={field.onChange}
                            />
                            <Label htmlFor="field-required">Required Field</Label>
                          </>
                        )}
                      />
                    </div>

                    {["NUMBER", "TEXT", "TEXTAREA"].includes(
                      (getValues(`fields.${editingIndex}.type`) as string) || ""
                    ) && (
                      <>
                        <div>
                          <Label htmlFor="field-min">Min</Label>
                          <Controller
                            control={control}
                            name={`fields.${editingIndex}.min`}
                            render={({ field }) => (
                              <Input
                                id="field-min"
                                type="number"
                                className="max-w-[100px]"
                                value={field.value ?? ""}
                                onChange={(e) =>
                                  field.onChange(e.target.value ? +e.target.value : null)
                                }
                              />
                            )}
                          />
                        </div>
                        <div>
                          <Label htmlFor="field-max">Max</Label>
                          <Controller
                            control={control}
                            name={`fields.${editingIndex}.max`}
                            render={({ field }) => (
                              <Input
                                id="field-max"
                                type="number"
                                className="max-w-[100px]"
                                value={field.value ?? ""}
                                onChange={(e) =>
                                  field.onChange(e.target.value ? +e.target.value : null)
                                }
                              />
                            )}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Options */}
                  {["SELECT", "RADIO", "CHECKBOX"].includes(
                    (getValues(`fields.${editingIndex}.type`) as string) || ""
                  ) && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Options</Label>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const curr =
                              getValues(`fields.${editingIndex}.options`) || [];
                            setValue(`fields.${editingIndex}.options`, [
                              ...curr,
                              `Option ${curr.length + 1}`,
                            ]);
                          }}
                        >
                          <Plus className="mr-2 h-3 w-3" /> Add Option
                        </Button>
                      </div>
                      {(getValues(`fields.${editingIndex}.options`) || []).map(
                        (_opt, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Controller
                              control={control}
                              name={`fields.${editingIndex}.options.${idx}`}
                              render={({ field }) => <Input {...field} />}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const curr =
                                  getValues(`fields.${editingIndex}.options`) || [];
                                if (curr.length <= 1) return;
                                curr.splice(idx, 1);
                                setValue(`fields.${editingIndex}.options`, [...curr]);
                              }}
                              disabled={
                                (getValues(`fields.${editingIndex}.options`) || [])
                                  .length === 1
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )
                      )}
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditingIndex(null)}
                    >
                      Cancel
                    </Button>
                    {/* No separate Update button needed; fields are already bound to RHF */}
                    <Button type="button" onClick={() => setEditingIndex(null)}>
                      Update Field
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Form Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h3 className="text-xl font-bold">{nameVal}</h3>
                  {descVal && <p className="text-muted-foreground">{descVal}</p>}

                  {fields.length === 0 ? (
                    <p className="text-center text-muted-foreground py-12">
                      Add fields to see a preview of your form
                    </p>
                  ) : (
                    <div className="space-y-4 py-4">
                      {fields.map((f) => (
                        <div key={f.id} className="space-y-2">
                          <Label>
                            {f.label}{" "}
                            {f.required && <span className="text-red-500">*</span>}
                          </Label>
                          {f.type === "TEXT" && (
                            <Input placeholder={f.placeholder || ""} />
                          )}
                          {f.type === "EMAIL" && (
                            <Input type="email" placeholder={f.placeholder || ""} />
                          )}
                          {f.type === "NUMBER" && (
                            <Input type="number" placeholder={f.placeholder || ""} />
                          )}
                          {f.type === "TEXTAREA" && (
                            <Textarea placeholder={f.placeholder || ""} />
                          )}
                          {f.type === "SELECT" && (
                            <Select>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={f.placeholder || "Select an option"}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {(f.options || []).map((opt, idx) => (
                                  <SelectItem key={idx} value={opt}>
                                    {opt}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          {f.type === "FILE" && <Input type="file" />}
                          {f.type === "DATE" && <Input type="date" />}
                          {f.type === "RADIO" && (
                            <div className="space-y-2">
                              {(f.options || []).map((opt, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <input type="radio" id={`${f.id}-${idx}`} name={f.id} />
                                  <Label htmlFor={`${f.id}-${idx}`}>{opt}</Label>
                                </div>
                              ))}
                            </div>
                          )}
                          {f.type === "CHECKBOX" && (
                            <div className="space-y-2">
                              {(f.options || []).map((opt, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <input type="checkbox" id={`${f.id}-${idx}`} />
                                  <Label htmlFor={`${f.id}-${idx}`}>{opt}</Label>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                      <Button type="button" className="w-full mt-4">
                        Submit
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
};

export default FormBuilder;
