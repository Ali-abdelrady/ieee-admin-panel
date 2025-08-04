// src/app/partners/_components/columns.tsx
import ActionCell from "@/components/table/actionCell";
import { Checkbox } from "@/components/ui/checkbox";
import { SponsorType } from "@/types/sponsors";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ImageCell } from "@/components/table/imageCell";
import GreenBagde from "@/components/badges/greenBadge";
import RedBadge from "@/components/badges/redBadge";

export const partnerColumns = (
  onEdit: (row: SponsorType) => React.ReactNode,
  onDelete: (row: SponsorType) => React.ReactNode,
  onPreview?: (row: SponsorType) => React.ReactNode
): ColumnDef<SponsorType>[] => [
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
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <ImageCell
        imageUrl={row.original.images[0].url}
        width={100}
        height={100}
        label="Sponsor Image"
      />
    ),
  },

  {
    accessorKey: "isSeasonPartner",
    header: "Season Partner",
    cell: ({ row }) =>
      row.original.isSeasonPartner ? (
        <GreenBagde text="Yes" />
      ) : (
        <RedBadge text="No" />
      ),
  },
  {
    accessorKey: "isSeasonSponsor",
    header: "Season Sponsor",
    cell: ({ row }) =>
      row.original.isSeasonSponsor ? (
        <GreenBagde text="Yes" />
      ) : (
        <RedBadge text="No" />
      ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ActionCell<SponsorType>
        row={row.original}
        onEdit={onEdit}
        onDelete={onDelete}
        onPreview={onPreview}
        label="Partner"
      />
    ),
  },
];
