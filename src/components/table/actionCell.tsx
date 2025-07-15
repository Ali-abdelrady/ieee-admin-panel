interface ActionCellProps<T> {
  row?: T;
  onEdit?: (row: T) => React.ReactNode;
  onDelete?: (row: T) => React.ReactNode;
  onPreview?: (row: T) => React.ReactNode;
  onAdd?: (row: T) => React.ReactNode;
  label: string;
}
export default function ActionCell<T>({
  row,
  onEdit,
  onDelete,
  onPreview,
  onAdd,
  label,
}: ActionCellProps<T>) {
  return (
    <div className="flex gap-2">
      {/* Preview Acion */}
      {row && onPreview?.(row)}

      {/* Edit Button */}
      {row && onEdit?.(row)}

      {/* Delete Action */}
      {row && onDelete?.(row)}

      {row && onAdd?.(row)}
    </div>
  );
}
