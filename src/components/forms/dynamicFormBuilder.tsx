import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface KeyValuePair {
  key: string;
  value: string;
}

interface ParentGroup {
  parentName: string;
  children: KeyValuePair[];
}

export const DynamicKeyValueForm = ({
  value,
  onChange,
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) => {
  const [groups, setGroups] = useState<ParentGroup[]>([]);

  // Initialize form data from JSON string
  useEffect(() => {
    try {
      if (value) {
        const parsed = JSON.parse(value);
        const initialGroups = Object.entries(parsed).map(
          ([parentName, children]) => ({
            parentName,
            children: Object.entries(children as Record<string, string>).map(
              ([key, value]) => ({ key, value })
            ),
          })
        );
        setGroups(
          initialGroups.length > 0 ? initialGroups : [createNewGroup()]
        );
      } else {
        setGroups([createNewGroup()]);
      }
    } catch (e) {
      setGroups([createNewGroup()]);
    }
  }, [value]);

  const createNewGroup = (): ParentGroup => ({
    parentName: "",
    children: [{ key: "", value: "" }],
  });

  const createNewKeyValuePair = (): KeyValuePair => ({
    key: "",
    value: "",
  });

  const updateOutput = (updatedGroups: ParentGroup[]) => {
    const jsonObj = updatedGroups.reduce((acc, group) => {
      if (group.parentName) {
        acc[group.parentName] = group.children.reduce((childAcc, child) => {
          if (child.key) {
            childAcc[child.key] = child.value;
          }
          return childAcc;
        }, {} as Record<string, string>);
      }
      return acc;
    }, {} as Record<string, Record<string, string>>);

    onChange(JSON.stringify(jsonObj));
  };

  // Handler functions...
  const handleAddGroup = () => {
    const updated = [...groups, createNewGroup()];
    setGroups(updated);
    updateOutput(updated);
  };

  const handleRemoveGroup = (index: number) => {
    if (groups.length <= 1) return;
    const updated = groups.filter((_, i) => i !== index);
    setGroups(updated);
    updateOutput(updated);
  };

  const handleGroupNameChange = (index: number, name: string) => {
    const updated = [...groups];
    updated[index].parentName = name;
    setGroups(updated);
    updateOutput(updated);
  };

  const handleAddKeyValue = (groupIndex: number) => {
    const updated = [...groups];
    updated[groupIndex].children.push(createNewKeyValuePair());
    setGroups(updated);
    updateOutput(updated);
  };

  const handleRemoveKeyValue = (groupIndex: number, kvIndex: number) => {
    const updated = [...groups];
    if (updated[groupIndex].children.length > 1) {
      updated[groupIndex].children.splice(kvIndex, 1);
      setGroups(updated);
      updateOutput(updated);
    }
  };

  const handleKeyChange = (
    groupIndex: number,
    kvIndex: number,
    key: string
  ) => {
    const updated = [...groups];
    updated[groupIndex].children[kvIndex].key = key;
    setGroups(updated);
    updateOutput(updated);
  };

  const handleValueChange = (
    groupIndex: number,
    kvIndex: number,
    value: string
  ) => {
    const updated = [...groups];
    updated[groupIndex].children[kvIndex].value = value;
    setGroups(updated);
    updateOutput(updated);
  };

  return (
    <div className="space-y-4">
      {groups.map((group, groupIndex) => (
        <div key={groupIndex} className="border rounded-lg p-4 space-y-3">
          <div className="flex flex-col gap-2">
            <h4 className="font-semibold text-sm">Parent Name</h4>
            <div className="flex items-center gap-2">
              <Input
                value={group.parentName}
                onChange={(e) =>
                  handleGroupNameChange(groupIndex, e.target.value)
                }
                placeholder="Parent name"
                disabled={disabled}
                className="flex-1"
              />
              <Button
                disabled={disabled}
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveGroup(groupIndex)}
                className={cn(
                  "col-span-2",
                  (disabled || group.children.length <= 1) &&
                    "cursor-not-allowed opacity-50"
                )}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>

          <div className="space-y-2 ">
            <div className="grid grid-cols-12 gap-2 items-center">
              <span className="col-span-5 font-medium text-sm">Key</span>
              <span className="col-span-5 font-medium text-sm">Value</span>
              <span className="col-span-2"></span>
            </div>

            {group.children.map((kv, kvIndex) => (
              <div
                key={kvIndex}
                className="grid grid-cols-12 gap-2 items-center"
              >
                <Input
                  value={kv.key}
                  onChange={(e) =>
                    handleKeyChange(groupIndex, kvIndex, e.target.value)
                  }
                  placeholder="Enter key"
                  className={cn(
                    "col-span-5",
                    disabled && "cursor-not-allowed opacity-50"
                  )}
                  disabled={disabled}
                />
                <Input
                  value={kv.value}
                  onChange={(e) =>
                    handleValueChange(groupIndex, kvIndex, e.target.value)
                  }
                  placeholder="Enter value"
                  disabled={disabled}
                  className={cn(
                    "col-span-5",
                    disabled && "cursor-not-allowed opacity-50"
                  )}
                />
                <Button
                  disabled={disabled}
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveKeyValue(groupIndex, kvIndex)}
                  className={cn(
                    "col-span-2",
                    (disabled || group.children.length <= 1) &&
                      "cursor-not-allowed opacity-50"
                  )}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}

            <Button
              disabled={disabled}
              variant="outline"
              size="sm"
              onClick={() => handleAddKeyValue(groupIndex)}
              className={cn(
                "w-full",
                disabled && "cursor-not-allowed opacity-50"
              )}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Child
            </Button>
          </div>
        </div>
      ))}

      <Button
        disabled={disabled}
        variant="outline"
        onClick={handleAddGroup}
        className={cn("w-full", disabled && "cursor-not-allowed opacity-50")}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Parent
      </Button>
    </div>
  );
};
