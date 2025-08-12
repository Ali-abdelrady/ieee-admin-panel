"use client";
import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  ChevronDownIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CircleXIcon,
  Columns3Icon,
  FileJson,
  FileSpreadsheet,
  FileText,
  FileX,
  ListFilterIcon,
  MoreHorizontalIcon,
  Upload,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { exportToCSV, exportToExcel, exportToJSON, exportToPDF } from "@/lib/exportUtils";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  addDialogContent?: React.ReactNode;
  onDeleteRows?: (rows: TData[]) => React.ReactNode;
  importDialogContent?: React.ReactNode;
  label?: string;
  filterKey?: string;
  hasExportFeature?: boolean;
  pageSizes?: number[];
}
export default function DataTable<TData, TValue>({
  columns,
  data,
  addDialogContent,
  onDeleteRows,
  label,
  filterKey,
  importDialogContent,
  hasExportFeature = true,
  pageSizes,
}: DataTableProps<TData, TValue>) {
  console.log(data);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const id = useId();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSizes ? pageSizes[0] : 15,
  });
  const pageSizesArr = pageSizes ?? [5, 15, 25, 50];
  const inputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const defaultFilterKey =
    filterKey && columns.some((col) => col.id === filterKey) ? filterKey : undefined;

  const [sorting, setSorting] = useState<SortingState>();
  // defaultFilterKey ? [{ id: defaultFilterKey, desc: true }] : []
  // [{ id: "id", desc: true }] // this assumes your rows have an "id" field
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },
  });
  const selectedRows = table.getSelectedRowModel().rows.map((row) => row.original);
  return (
    <div className="space-y-4 ">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {filterKey && (
            <div className="relative">
              <Input
                id={`${id}-input`}
                ref={inputRef}
                className={cn(
                  "peer min-w-60 ps-9",
                  Boolean(table.getColumn(filterKey)?.getFilterValue()) && "pe-9"
                )}
                value={(table.getColumn(filterKey)?.getFilterValue() ?? "") as string}
                onChange={(e) =>
                  table.getColumn(filterKey)?.setFilterValue(e.target.value)
                }
                placeholder={`Filter by ${filterKey}...`}
                type="text"
                aria-label={`Filter by ${filterKey}`}
              />
              <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                <ListFilterIcon size={16} aria-hidden="true" />
              </div>

              {Boolean(table.getColumn(filterKey)?.getFilterValue()) && (
                <button
                  className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Clear filter"
                  onClick={() => {
                    table.getColumn(filterKey)?.setFilterValue("");
                    inputRef.current?.focus();
                  }}
                >
                  <CircleXIcon size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          )}

          {/* Toggle columns visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Columns3Icon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide() && column.id !== "actions")
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      onSelect={(event) => event.preventDefault()}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Actions Buttons Add - Delete - Import Export */}
        {hasExportFeature && (
          <div className="flex items-center gap-3">
            {isMobile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center">
                    <MoreHorizontalIcon className="-ms-1 opacity-60" size={16} />
                    Actions
                  </Button>
                </DropdownMenuTrigger>
                {/*here*/}

                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>

                  {addDialogContent && (
                    <DropdownMenuItem asChild>{addDialogContent}</DropdownMenuItem>
                  )}

                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Upload size={16} className="opacity-60 mr-2" />
                      Export
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => exportToPDF(data, label)}>
                        <FileText size={16} className="mr-2" />
                        PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => exportToCSV(data, label)}>
                        <FileSpreadsheet size={16} className="mr-2" />
                        CSV
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => exportToJSON(data, label)}>
                        <FileJson size={16} className="mr-2" />
                        JSON
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => exportToExcel(data, label)}>
                        <FileX size={16} className="mr-2" />
                        Excel
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>

                  {importDialogContent && (
                    <DropdownMenuItem asChild>{importDialogContent}</DropdownMenuItem>
                  )}

                  {table.getSelectedRowModel().rows.length > 0 &&
                    onDeleteRows?.(selectedRows)}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                {/* Normal buttons for larger screens */}
                {table.getSelectedRowModel().rows.length > 0 &&
                  onDeleteRows?.(selectedRows)}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center">
                      <Upload className="-ms-1 opacity-60" size={16} />
                      Export
                      <ChevronDownIcon className="mt-0.5 ml-1.5 opacity-60" size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => exportToPDF(data, label)}>
                      <FileText className="-ms-1 opacity-60" size={16} />
                      PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportToCSV(data, label)}>
                      <FileSpreadsheet className="-ms-1 opacity-60" size={16} />
                      CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportToJSON(data, label)}>
                      <FileJson className="-ms-1 opacity-60" size={16} />
                      JSON
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportToExcel(data, label)}>
                      <FileX className="-ms-1 opacity-60" size={16} />
                      Excel Sheet
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {importDialogContent}
                {addDialogContent && <div>{addDialogContent}</div>}
              </>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-background w-full overflow-auto rounded-md border">
        <Table className="w-full table-fixed overflow-auto">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header, index) => {
                  const isActions = header.column.id === "actions";
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "h-11 overflow-hidden text-ellipsis whitespace-nowrap sticky top-0",
                        index === 0
                          ? "w-[50px]"
                          : isActions
                          ? "w-[200px] min-w-[200px] max-w-[200px]"
                          : "w-[200px] min-w-[200px] max-w-[200px]"
                      )}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={cn(
                            "flex items-center gap-2",
                            header.column.getCanSort() && "cursor-pointer select-none"
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          onKeyDown={(e) => {
                            if (
                              header.column.getCanSort() &&
                              (e.key === "Enter" || e.key === " ")
                            ) {
                              e.preventDefault();
                              header.column.getToggleSortingHandler()?.(e);
                            }
                          }}
                          tabIndex={header.column.getCanSort() ? 0 : undefined}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}

                          {/* Always show sort icons if column is sortable */}
                          {header.column.getCanSort() && (
                            <span className="flex flex-col items-center justify-center">
                              <ChevronUpIcon
                                className={cn(
                                  "shrink-0 h-3 w--black",
                                  header.column.getIsSorted() === "asc"
                                    ? "opacity-100 "
                                    : "opacity-60 "
                                )}
                                aria-hidden="true"
                              />
                              <ChevronDownIcon
                                className={cn(
                                  "shrink-0 h-3 w-3 -mt-1",
                                  header.column.getIsSorted() === "desc"
                                    ? "opacity-100"
                                    : "opacity-60"
                                )}
                                aria-hidden="true"
                              />
                            </span>
                          )}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => {
                    const isActions = cell.column.id === "actions";
                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          "overflow-hidden text-ellipsis whitespace-nowrap last:py-0",
                          index === 0
                            ? "w-[50px]"
                            : isActions
                            ? "w-[200px] min-w-[100px] max-w-[200px]"
                            : "w-[200px] min-w-[100px] max-w-[200px]"
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-8">
        {/* Results per page */}
        <div className="flex items-center gap-3">
          <Label htmlFor={id} className="max-sm:sr-only">
            Rows per page
          </Label>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger id={id} className="w-fit whitespace-nowrap">
              <SelectValue placeholder="Select number of results" />
            </SelectTrigger>
            <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
              {pageSizesArr.map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Page number information */}
        <div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
          <p
            className="text-muted-foreground text-sm whitespace-nowrap"
            aria-live="polite"
          >
            <span className="text-foreground">
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}
              -
              {Math.min(
                Math.max(
                  table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                    table.getState().pagination.pageSize,
                  0
                ),
                table.getRowCount()
              )}
            </span>{" "}
            of <span className="text-foreground">{table.getRowCount().toString()}</span>
          </p>
        </div>

        {/* Pagination buttons */}
        <div>
          <Pagination>
            <PaginationContent>
              {/* First page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to first page"
                >
                  <ChevronFirstIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Previous page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to previous page"
                >
                  <ChevronLeftIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Next page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to next page"
                >
                  <ChevronRightIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Last page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to last page"
                >
                  <ChevronLastIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
