export function convertToSelectOptions(
  data: Array<any>
): { label: string; value: number | string }[] | [] {
  return (
    data?.map((item) => ({
      label: item.equipment_name,
      value: item.id,
    })) || []
  );
}
