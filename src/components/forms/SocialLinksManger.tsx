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
import { SocialLinksType } from "@/types/forms";

interface SocialLinksManagerProps {
  name: string;
  disabled?: boolean;
}
export function parseSocialLinks(
  socialLinks?: SocialLinksType[]
): { platform: string; url: string }[] {
  if (!Array.isArray(socialLinks)) return [];

  return socialLinks.map((item) => ({
    platform: item.icon.toLowerCase(),
    url: item.url,
  }));
}

const SocialLinksManager = ({
  name,
  disabled = false,
}: SocialLinksManagerProps) => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: name,
    keyName: "id",
  });

  const socialPlatforms = [
    { value: "facebook", label: "Facebook" },
    { value: "twitter", label: "Twitter" },
    { value: "instagram", label: "Instagram" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "behance", label: "Behance" },
  ];

  const addNewLink = () => {
    append({ platform: "", url: "" });
  };

  // Preview mode
  if (disabled) {
    return (
      <div className="space-y-3">
        {fields.map((link: any, index: number) => {
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
            {/* Platform Select */}
            <div className="grid gap-2 flex-1">
              <Controller
                name={`${name}.${index}.platform`}
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <div>fieldValue:{field.value}</div>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Platform">
                        {socialPlatforms.find(
                          (option) => option.value === field.value
                        )?.label ?? "Select platform"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {socialPlatforms.map((platform) => (
                        <SelectItem key={platform.value} value={platform.value}>
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
              <Controller
                name={`${name}.${index}.url`}
                control={control}
                render={({ field: field }) => (
                  <Input
                    type="url"
                    placeholder="https://example.com/profile"
                    {...field}
                  />
                )}
              />
            </div>

            <Button
              type="button"
              onClick={() => remove(index)}
              variant="ghost"
              size="icon"
            >
              <Trash2 size={16} className="text-destructive" />
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
