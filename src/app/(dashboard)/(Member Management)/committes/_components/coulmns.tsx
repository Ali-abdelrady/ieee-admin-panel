// src/app/committee/_components/columns.tsx
import ActionCell from "@/components/table/actionCell";
import { ImageCell } from "@/components/table/imageCell";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CommitteeType } from "@/types/committee";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

export const committeeColumns = (
  onEdit: (row: CommitteeType) => React.ReactNode,
  onDelete: (row: CommitteeType) => React.ReactNode,
  onPreview: (row: CommitteeType) => React.ReactNode
): ColumnDef<CommitteeType>[] => [
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
    accessorKey: "leaders",
    header: "Leaders",
    cell: ({ row }) => {
      const leaders = row.original.leaders;
      if (!leaders) {
        return "No Leaders";
      }
      return (
        <div className="flex flex-wrap ">
          {leaders.map((leader, index) => (
            <Badge key={index}>{leader.name}</Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="line-clamp-2">
        {row.original.description.length > 50
          ? `${row.original.description.slice(0, 50)}...`
          : row.original.description}
      </div>
    ),
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const imageUrl = row.original.image?.toString();
      return <ImageCell imageUrl={imageUrl} label={row.original.name} />;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ActionCell<CommitteeType>
        row={row.original}
        onEdit={onEdit}
        onDelete={onDelete}
        onPreview={onPreview}
        label="Committee"
      />
    ),
  },
];
