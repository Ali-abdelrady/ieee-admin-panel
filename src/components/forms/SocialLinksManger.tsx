import React from "react";
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

interface SocialLink {
  platform: string;
  url: string;
}

interface SocialLinksManagerProps {
  name: string;
  disabled?: boolean;
  defaultValues?: SocialLink[] | string;
}

const SocialLinksManager = ({
  name,
  disabled = false,
  defaultValues,
}: SocialLinksManagerProps) => {
  const { control, setValue } = useFormContext();

  // Parse and normalize default values
  const parsedDefaultValues = React.useMemo(() => {
    if (!defaultValues) return [];

    try {
      // Handle string input
      if (typeof defaultValues === "string") {
        const parsed = JSON.parse(defaultValues);
        return parsed.map((item: any) => ({
          platform: item.icon || item.platform || "",
          url: item.url || "",
        }));
      }

      // Handle object array input
      return defaultValues.map((item: any) => ({
        platform: item.icon || item.platform || "",
        url: item.url || "",
      }));
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
    }
  }, [name, parsedDefaultValues, setValue, fields.length]);

  const socialPlatforms = [
    { value: "facebook", label: "Facebook" },
    { value: "twitter", label: "Twitter" },
    { value: "instagram", label: "Instagram" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "youtube", label: "YouTube" },
    { value: "pinterest", label: "Pinterest" },
    { value: "tiktok", label: "TikTok" },
  ];

  const addNewLink = () => {
    append({ platform: "", url: "" });
  };

  // Preview mode
  if (disabled) {
    const values = fields.length > 0 ? fields : parsedDefaultValues;
    return (
      <div className="space-y-3">
        {values.map((link: any, index: number) => {
          const platform = socialPlatforms.find(
            (p) => p.value === link.platform
          );
          return (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {platform?.label || "Unknown Platform"}
                </p>
                <p className="text-sm text-gray-600">{link.url}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-3 items-end justify-center">
            {/* Platform Select with Controller */}
            <div className="grid gap-2 flex-1">
              <label className="text-sm font-medium">Platform</label>
              <Controller
                name={`${name}.${index}.platform`}
                control={control}
                render={({ field: controllerField }) => (
                  <Select
                    value={controllerField.value}
                    onValueChange={controllerField.onChange}
                  >
                    
                    <SelectTrigger className="w-full">
                      <SelectValue defaultValue={controllerField.value}>
                        {socialPlatforms.find(
                          (option) => option.value === controllerField.value
                        )?.label ?? "Select platform"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {socialPlatforms.map((platform) => (
                        <SelectItem
                          key={platform.value}
                          value={platform.value}
                          defaultValue={controllerField.value}
                        >
                          {platform.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* URL Input */}
            <div className="grid gap-2 flex-1">
              <label className="text-sm font-medium">URL</label>
              <Controller
                name={`${name}.${index}.url`}
                control={control}
                render={({ field: controllerField }) => (
                  <Input
                    type="url"
                    placeholder="https://example.com/profile"
                    {...controllerField}
                  />
                )}
              />
            </div>

            <Button
              type="button"
              onClick={() => remove(index)}
              variant="destructive"
              size="icon"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        onClick={addNewLink}
        variant="outline"
        className="mb-4"
      >
        Add Social Link
      </Button>
    </div>
  );
};

export default SocialLinksManager;
