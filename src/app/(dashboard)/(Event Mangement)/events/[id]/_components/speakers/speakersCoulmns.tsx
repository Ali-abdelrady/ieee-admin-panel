import ActionCell from "@/components/table/actionCell";
import { Checkbox } from "@/components/ui/checkbox";
import { SpeakerType } from "@/types/speakers";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

interface SpeakerColumnsProps {
  onEdit?: (row: SpeakerType) => React.ReactNode;
  onDelete: (row: SpeakerType) => React.ReactNode;
  onPreview?: (row: SpeakerType) => React.ReactNode;
}

export const speakerColumns = ({
  onEdit,
  onDelete,
  onPreview,
}: SpeakerColumnsProps): ColumnDef<SpeakerType>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    size: 28,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "id",
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.name}
        {row.original.title && (
          <p className="text-sm text-muted-foreground">{row.original.title}</p>
        )}
      </div>
    ),
  },
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => (
      <div>
        {row.original.company || "-"}
        {row.original.job && (
          <p className="text-sm text-muted-foreground">{row.original.job}</p>
        )}
      </div>
    ),
  },
  {
    accessorKey: "socialLinks",
    header: "Social Links",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.socialLinks?.map((link, index) => (
          <Badge key={index} variant="outline" className="capitalize">
            {link.name}
          </Badge>
        ))}
        {!row.original.socialLinks?.length && "-"}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ActionCell<SpeakerType>
        row={row.original}
        onEdit={onEdit}
        onDelete={onDelete}
        onPreview={onPreview}
        label="Speaker"
      />
    ),
  },
];
