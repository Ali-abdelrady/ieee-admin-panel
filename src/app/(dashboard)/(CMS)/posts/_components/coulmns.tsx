// src/app/posts/_components/columns.tsx
import ActionCell from "@/components/table/actionCell";
import { Checkbox } from "@/components/ui/checkbox";
import { PostType } from "@/types/post";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import GreenBagde from "@/components/badges/greenBadge";
import RedBadge from "@/components/badges/redBadge";
import { formatDate, formatDateString } from "@/services/helpers/dateHelpers";

export const postColumns = (
  onEdit: (row: PostType) => React.ReactNode,
  onDelete: (row: PostType) => React.ReactNode,
  onPreview: (row: PostType) => React.ReactNode
): ColumnDef<PostType>[] => [
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
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "content",
    header: "Content",
  },
  {
    accessorKey: "authorId",
    header: "Author ID",
  },
  {
    accessorKey: "private",
    header: "Visibility",
    cell: (row) => {
      const value = row.getValue();
      return value ? <GreenBagde text="public" /> : <RedBadge text="private" />;
    },
  },
  {
    accessorKey: "createdAt",
    header: "CreatedAt",
    cell: ({ row }) =>
      formatDateString(row?.original?.createdAt as string) ?? "N/A",
  },
  {
    accessorKey: "updatedAt",
    header: "UpdatedAt",
    cell: ({ row }) =>
      formatDateString(row?.original?.updatedAt as string) ?? "N/A",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ActionCell<PostType>
        row={row.original}
        onEdit={onEdit}
        onDelete={onDelete}
        onPreview={onPreview}
        label="Post"
      />
    ),
  },
];
