import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy } from "lucide-react";

interface CopyButtonProps {
  link: string;
}

export function CopyButton({ link }: CopyButtonProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link copied!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="flex items-center gap-2"
    >
      <Copy className="h-4 w-4" />
      Copy
    </Button>
  );
}
