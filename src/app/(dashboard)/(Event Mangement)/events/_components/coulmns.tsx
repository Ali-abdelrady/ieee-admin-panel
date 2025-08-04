// src/app/events/_components/columns.tsx
import ActionCell from "@/components/table/actionCell";
import { Checkbox } from "@/components/ui/checkbox";
import { EventType } from "@/types/events";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { formatDate } from "@/services/helpers/dateHelpers";
import { ImageCell } from "@/components/table/imageCell";

export const eventColumns = (
  onEdit: (row: EventType) => React.ReactNode,
  onDelete: (row: EventType) => React.ReactNode,
  onPreview: (row: EventType) => React.ReactNode
): ColumnDef<EventType>[] => [
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
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.original.category}
      </Badge>
    ),
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => formatDate(row.original.startDate),
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => formatDate(row.original.endDate),
  },
  {
    accessorKey: "private",
    header: "Visibility",
    cell: ({ row }) => (
      <Badge variant={row.original.private ? "destructive" : "default"}>
        {row.original.private ? "Private" : "Public"}
      </Badge>
    ),
  },
  {
    accessorKey: "coverImage",
    header: "Image",
    cell: ({ row }) => {
      const imageUrl = row.original?.coverImage?.toString();
      return <ImageCell imageUrl={imageUrl} label={row.original.name} />;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ActionCell<EventType>
        row={row.original}
        onEdit={onEdit}
        onDelete={onDelete}
        onPreview={onPreview}
        label="Event"
      />
    ),
  },
];
