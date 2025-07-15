import ActionCell from "@/components/table/actionCell";
import { ImageCell } from "@/components/table/imageCell";
import { Checkbox } from "@/components/ui/checkbox";
import { AwardType } from "@/types/awards";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

export const awardColumns = (
  onEdit: (row: AwardType) => React.ReactNode,
  onDelete: (row: AwardType) => React.ReactNode,
  onPreview: (row: AwardType) => React.ReactNode
): ColumnDef<AwardType>[] => [
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
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "winningDate",
    header: "Winning Date",
  },
  {
    accessorKey: "place",
    header: "Place",
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: (row) => {
      const imageUrl = row.getValue() as string;
      return <ImageCell imageUrl={imageUrl} label="award Image" />;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <ActionCell<AwardType>
          row={row.original}
          onEdit={onEdit}
          onDelete={onDelete}
          onPreview={onPreview}
          label="Awards"
        />
      );
    },
  },
];
