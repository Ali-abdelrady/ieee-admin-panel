// src/app/users/_components/columns.tsx
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import ActionCell from "@/components/table/actionCell";
import { ColumnDef } from "@tanstack/react-table";
import { MemberType } from "@/types/member"; // adjust path if needed
import GreenBagde from "@/components/badges/greenBadge";
import RedBadge from "@/components/badges/redBadge";

export const memberColumns = (
  onEdit: (row: MemberType) => React.ReactNode,
  onDelete: (row: MemberType) => React.ReactNode,
  onPreview: (row: MemberType) => React.ReactNode
): ColumnDef<MemberType>[] => [
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
    accessorKey: "id", // matches your data key
    header: "ID",
    enableHiding: true, // allows it to be hidden
    cell: () => null,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "personalEmail",
    header: "Personal Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "roles",
    header: "Roles",
    cell: ({ row }) => <Badge variant="outline">{row.original.roles}</Badge>,
  },
  {
    accessorKey: "university",
    header: "University",
  },
  {
    accessorKey: "faculty",
    header: "Faculty",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) =>
      row.original.status == "ACTIVE" ? (
        <GreenBagde text="ACTIVE" />
      ) : (
        <RedBadge text="INACTIVE" />
      ),
  },
  {
    accessorKey: "committee?.name",
    header: "Committee",
    cell: ({ row }) => row.original.committee?.name || "—",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ActionCell<MemberType>
        row={row.original}
        onEdit={onEdit}
        onDelete={onDelete}
        onPreview={onPreview}
        label="Member"
      />
    ),
  },
];
