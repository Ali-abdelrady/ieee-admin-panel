import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { TextRules } from "@/types/forms";

function RulesEditor({
  value,
  onChange,
  fieldType,
}: {
  value: TextRules | undefined;
  onChange: (rules: TextRules | undefined) => void;
  fieldType: "TEXT" | "EMAIL" | string;
}) {
  const rules = value ?? {};

  const set = <K extends keyof TextRules>(key: K, v: TextRules[K]) =>
    onChange({ ...rules, [key]: v });

  const setAllow = (k: keyof NonNullable<TextRules["allowChars"]>, v: boolean) =>
    onChange({
      ...rules,
      allowChars: { ...(rules.allowChars ?? {}), [k]: v },
    });

  function CheckboxRow({
    id,
    label,
    checked,
    onCheckedChange,
  }: {
    id: string;
    label: string;
    checked?: boolean;
    onCheckedChange: (v: boolean) => void;
  }) {
    return (
      <div className="flex items-center gap-2">
        <Switch id={id} checked={!!checked} onCheckedChange={onCheckedChange} />
        <Label htmlFor={id}>{label}</Label>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Preset (optional)</Label>
        <Select
          value={rules.preset ?? ""}
          onValueChange={(v) => set("preset", (v || undefined) as any)}
        >
          <SelectTrigger>
            <SelectValue placeholder="No preset" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">No preset</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="url">URL</SelectItem>
            <SelectItem value="phone">Phone</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Allowed characters */}
      <div className="space-y-2">
        <Label>Allowed characters</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <CheckboxRow
            id="allow-lower"
            label="a–z"
            checked={rules.allowChars?.lower}
            onCheckedChange={(v) => setAllow("lower", v)}
          />
          <CheckboxRow
            id="allow-upper"
            label="A–Z"
            checked={rules.allowChars?.upper}
            onCheckedChange={(v) => setAllow("upper", v)}
          />
          <CheckboxRow
            id="allow-digits"
            label="0–9"
            checked={rules.allowChars?.digits}
            onCheckedChange={(v) => setAllow("digits", v)}
          />
          <CheckboxRow
            id="allow-space"
            label="Space"
            checked={rules.allowChars?.space}
            onCheckedChange={(v) => setAllow("space", v)}
          />
          <CheckboxRow
            id="allow-underscore"
            label="_"
            checked={rules.allowChars?.underscore}
            onCheckedChange={(v) => setAllow("underscore", v)}
          />
          <CheckboxRow
            id="allow-dash"
            label="-"
            checked={rules.allowChars?.dash}
            onCheckedChange={(v) => setAllow("dash", v)}
          />
          <CheckboxRow
            id="allow-dot"
            label="."
            checked={rules.allowChars?.dot}
            onCheckedChange={(v) => setAllow("dot", v)}
          />
          <CheckboxRow
            id="allow-at"
            label="@"
            checked={rules.allowChars?.at}
            onCheckedChange={(v) => setAllow("at", v)}
          />
        </div>
      </div>

      {/* Content constraints */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="startsWith">Must start with</Label>
          <Input
            id="startsWith"
            value={rules.startsWith ?? ""}
            onChange={(e) => set("startsWith", e.target.value || undefined)}
            placeholder="Optional"
          />
        </div>
        <div>
          <Label htmlFor="endsWith">Must end with</Label>
          <Input
            id="endsWith"
            value={rules.endsWith ?? ""}
            onChange={(e) => set("endsWith", e.target.value || undefined)}
            placeholder="Optional"
          />
        </div>
        <div>
          <Label htmlFor="mustContain">Must contain</Label>
          <Input
            id="mustContain"
            value={rules.mustContain ?? ""}
            onChange={(e) => set("mustContain", e.target.value || undefined)}
            placeholder="Optional"
          />
        </div>
        <div>
          <Label htmlFor="disallow">Disallow</Label>
          <Input
            id="disallow"
            value={rules.disallow ?? ""}
            onChange={(e) => set("disallow", e.target.value || undefined)}
            placeholder="Optional"
          />
        </div>
      </div>
    </div>
  );
}

export default RulesEditor;
