import React, { useEffect } from "react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { CommitteTopicType } from "@/types/committee";
import { Textarea } from "../ui/textarea";

interface TopicsBuilderProps {
  name: string;
  disabled?: boolean;
  defaultValues?: CommitteTopicType[] | string;
}

const TopicsBuilder = ({
  name,
  disabled = false,
  defaultValues,
}: TopicsBuilderProps) => {
  const { control, setValue } = useFormContext();

  // Parse and normalize default values
  const parsedDefaultValues = React.useMemo(() => {
    if (!defaultValues) return [];

    try {
      if (typeof defaultValues === "string") {
        return JSON.parse(defaultValues);
      }
      return defaultValues;
    } catch (e) {
      console.error("Error parsing social links:", e);
      return [];
    }
  }, [defaultValues]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: name,
    keyName: "id",
  });

  // Initialize with parsed default values
  React.useEffect(() => {
    if (parsedDefaultValues.length > 0 && fields.length === 0) {
      setValue(name, parsedDefaultValues);
    } else {
      console.log("hi");
      setValue(name, [{ title: "", content: "" }]);
      // append({ title: "", content: "" });
    }
  }, []);

  const addNewTopic = () => {
    append({ title: "", content: "" });
  };
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="flex  flex-col gap-3 ">
            <div className="grid gap-2 flex-1">
              <label className="text-sm font-medium">Title</label>
              <Controller
                name={`${name}.${index}.title`}
                control={control}
                render={({ field: controllerField }) => (
                  <Input
                    type="text"
                    placeholder="Topic Title"
                    {...controllerField}
                  />
                )}
              />
            </div>
            <div className="grid gap-2 flex-1">
              <label className="text-sm font-medium">Contnet</label>
              <Controller
                name={`${name}.${index}.content`}
                control={control}
                render={({ field: controllerField }) => (
                  <Textarea placeholder="Topic Content" {...controllerField} />
                )}
              />
            </div>
            {index > 0 && (
              <Button
                type="button"
                onClick={() => remove(index)}
                variant="destructive"
                size="icon"
                className="w-full"
                disabled={index == 0}
              >
                Delete
                <Trash2 size={16} />
              </Button>
            )}
          </div>
        ))}
      </div>
      <Button
        type="button"
        onClick={addNewTopic}
        variant="outline"
        className="mb-4"
      >
        Add Topic
      </Button>
    </div>
  );
};

export default TopicsBuilder;
