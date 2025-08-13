import React, { useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown, Edit } from "lucide-react";
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

interface FormBuilderProps {
  form?: EventForm;
  onSave: (form: EventForm) => void;
}

const FormBuilder: React.FC<FormBuilderProps> = ({ form, onSave }) => {
  const [name, setName] = useState(form?.name || "Registration Form");
  const [description, setDescription] = useState(form?.description || "");
  const [fields, setFields] = useState<EventFormField[]>(form?.fields || []);
  const [isPublished, setIsPublished] = useState(form?.isPublished || false);
  const [type, setType] = useState(form?.type || "ANY");
  const [startDate, setStartDate] = useState(form?.startDate || new Date().toISOString());
  const [endDate, setEndDate] = useState(
    form?.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  ); //start date + week
  const [isPublic, setIsPublic] = useState(form?.isPublic || false);
  const [editingField, setEditingField] = useState<EventFormField | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddField = () => {
    const newField: EventFormField = {
      name: "",
      id: `field-${Date.now()}`,
      type: "TEXT",
      label: "New Field",
      placeholder: "",
      required: false,
    };

    setFields([...fields, newField]);
    setEditingField(newField);
    setEditingIndex(fields.length);
  };

  const handleEditField = (field: EventFormField, index: number) => {
    setEditingField({ ...field });
    setEditingIndex(index);
  };

  const handleUpdateField = () => {
    if (editingField && editingIndex !== null) {
      const updatedFields = [...fields];
      updatedFields[editingIndex] = editingField;
      setFields(updatedFields);
      setEditingField(null);
      setEditingIndex(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditingIndex(null);
  };

  const handleDeleteField = (index: number) => {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);

    if (editingIndex === index) {
      setEditingField(null);
      setEditingIndex(null);
    }
  };

  const handleMoveField = (index: number, direction: "up" | "down") => {
    const updatedFields = [...fields];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < fields.length) {
      [updatedFields[index], updatedFields[newIndex]] = [
        updatedFields[newIndex],
        updatedFields[index],
      ];
      setFields(updatedFields);

      if (editingIndex === index) {
        setEditingIndex(newIndex);
      } else if (editingIndex === newIndex) {
        setEditingIndex(index);
      }
    }
  };

  const handleSaveForm = () => {
    if (!name.trim()) {
      toast.error("Form Title Required", {
        description: "Please enter a title for the form.",
      });
      return;
    }

    if (fields.length === 0) {
      toast.error("Fields Required", {
        description: "Please add at least one field to the form.",
      });
      return;
    }

    const newForm: EventForm = {
      id: form?.id || `form-${Date.now()}`,
      name,
      type,
      isPublic,
      startDate,
      endDate,
      description,
      fields,
      isPublished,
      isRegistrationForm: form?.isRegistrationForm || false,

      createdAt: form?.createdAt || new Date().toISOString(),
    };

    onSave(newForm);
  };

  const handleFieldTypeChange = (type: FieldType) => {
    if (editingField) {
      setEditingField({
        ...editingField,
        type,
        options:
          type === "SELECT" || type === "RADIO" || type === "CHECKBOX"
            ? editingField.options || ["Option 1"]
            : undefined,
      });
    }
  };

  const handleAddOption = () => {
    if (editingField && editingField.options) {
      setEditingField({
        ...editingField,
        options: [...editingField.options, `Option ${editingField.options.length + 1}`],
      });
    }
  };

  const handleUpdateOption = (index: number, value: string) => {
    if (editingField && editingField.options) {
      const updatedOptions = [...editingField.options];
      updatedOptions[index] = value;
      setEditingField({
        ...editingField,
        options: updatedOptions,
      });
    }
  };

  const handleDeleteOption = (index: number) => {
    if (editingField && editingField.options) {
      const updatedOptions = [...editingField.options];
      updatedOptions.splice(index, 1);
      setEditingField({
        ...editingField,
        options: updatedOptions,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Form Builder</h2>
          <p className="text-muted-foreground">
            Create a custom registration form for your event
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="published"
              checked={isPublished}
              onCheckedChange={setIsPublished}
            />
            <Label htmlFor="published">Published</Label>
          </div>
          <Button onClick={handleSaveForm}>Save Form</Button>
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
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter form name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter form description"
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="max-h-[600px] overflow-y-auto">
            <CardHeader className="flex sticky top-0  backdrop-blur-2xl bg-gray-50 py-4 flex-row items-center justify-between">
              <CardTitle>Form Fields</CardTitle>
              <Button size="sm" onClick={handleAddField}>
                <Plus className="mr-2 h-4 w-4" /> Add Field
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No fields added yet. Click &quot;Add Field&quot; to start building your
                  form.
                </p>
              ) : (
                fields.map((field, index) => (
                  <Card
                    key={field.id}
                    className={index === editingIndex ? "border-primary" : ""}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{field.label}</h4>
                          <p className="text-sm text-muted-foreground">
                            {field.type} {field.required && "(Required)"}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={index === 0}
                            onClick={() => handleMoveField(index, "up")}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={index === fields.length - 1}
                            onClick={() => handleMoveField(index, "down")}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditField(field, index)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteField(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Field Editor / Preview */}
        <div>
          {editingField ? (
            <Card>
              <CardHeader>
                <CardTitle>Edit Field</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="field-type">Field Type</Label>
                  <Select
                    value={editingField.type}
                    onValueChange={(value) => handleFieldTypeChange(value as FieldType)}
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
                </div>

                <div>
                  <Label htmlFor="field-label">Label</Label>
                  <Input
                    id="field-label"
                    value={editingField.label}
                    onChange={(e) =>
                      setEditingField({ ...editingField, label: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="field-placeholder">Placeholder (Optional)</Label>
                  <Input
                    id="field-placeholder"
                    value={editingField.placeholder || ""}
                    onChange={(e) =>
                      setEditingField({ ...editingField, placeholder: e.target.value })
                    }
                  />
                </div>
                {editingField.type === "FILE" && (
                  <div>
                    <Label htmlFor="field-placeholder">Max size</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        id="field-placeholder"
                        type="number"
                        className="max-w-[180px]"
                        value={editingField.maxFileSize || ""}
                        onChange={(e) =>
                          setEditingField({
                            ...editingField,
                            maxFileSize: +e.target.value,
                          })
                        }
                      />
                      <span className="font-semibold">MB</span>{" "}
                      <span className="text-sm text-muted-foreground italic">
                        {" "}
                        default is 10 mb
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="field-required"
                      checked={editingField.required}
                      onCheckedChange={(value) =>
                        setEditingField({ ...editingField, required: value })
                      }
                    />
                    <Label htmlFor="field-required">Required Field</Label>
                  </div>
                  {["NUMBER", "TEXT", "TEXTAREA", "PARAGRAPH"].includes(
                    editingField.type
                  ) && (
                    <div>
                      <Label htmlFor="field-placeholder">Min</Label>
                      <Input
                        id="field-placeholder"
                        type="number"
                        className="max-w-[100px]"
                        value={editingField.min || ""}
                        onChange={(e) =>
                          setEditingField({ ...editingField, min: e.target.value })
                        }
                      />
                    </div>
                  )}
                  {["NUMBER", "TEXT", "TEXTAREA", "PARAGRAPH"].includes(
                    editingField.type
                  ) && (
                    <div>
                      <Label htmlFor="field-placeholder">Max</Label>
                      <Input
                        id="field-placeholder"
                        type="number"
                        className="max-w-[100px]"
                        value={editingField.max || ""}
                        onChange={(e) =>
                          setEditingField({ ...editingField, max: e.target.value })
                        }
                      />
                    </div>
                  )}
                </div>

                {["SELECT", "RADIO", "CHECKBOX"].includes(editingField.type) && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Options</Label>
                      <Button size="sm" variant="outline" onClick={handleAddOption}>
                        <Plus className="mr-2 h-3 w-3" /> Add Option
                      </Button>
                    </div>
                    {editingField.options?.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={option}
                          onChange={(e) => handleUpdateOption(index, e.target.value)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteOption(index)}
                          disabled={editingField.options?.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateField}>Update Field</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Form Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-xl font-bold">{name}</h3>
                {description && <p className="text-muted-foreground">{description}</p>}

                {fields.length === 0 ? (
                  <p className="text-center text-muted-foreground py-12">
                    Add fields to see a preview of your form
                  </p>
                ) : (
                  <div className="space-y-4 py-4">
                    {fields.map((field) => (
                      <div key={field.id} className="space-y-2">
                        <Label>
                          {field.label}{" "}
                          {field.required && <span className="text-red-500">*</span>}
                        </Label>
                        {field.type === "TEXT" && (
                          <Input placeholder={field.placeholder} />
                        )}
                        {field.type === "EMAIL" && (
                          <Input type="email" placeholder={field.placeholder} />
                        )}
                        {field.type === "NUMBER" && (
                          <Input type="number" placeholder={field.placeholder} />
                        )}
                        {field.type === "TEXTAREA" && (
                          <Textarea placeholder={field.placeholder} />
                        )}
                        {field.type === "SELECT" && (
                          <Select>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={field.placeholder || "Select an option"}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options?.map((option, index) => (
                                <SelectItem key={index} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        {field.type === "FILE" && <Input type="file" />}
                        {field.type === "DATE" && <Input type="date" />}
                        {field.type === "RADIO" && (
                          <div className="space-y-2">
                            {field.options?.map((option, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  id={`${field.id}-${index}`}
                                  name={field.id}
                                />
                                <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
                              </div>
                            ))}
                          </div>
                        )}
                        {field.type === "CHECKBOX" && (
                          <div className="space-y-2">
                            {field.options?.map((option, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <input type="checkbox" id={`${field.id}-${index}`} />
                                <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    <Button className="w-full mt-4">Submit</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
