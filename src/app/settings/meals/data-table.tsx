"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { TrashIcon } from '@heroicons/react/24/solid';
import { deleteMeal } from "@/actions/meal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useRouter } from "next/navigation";
import { useMemo } from "react";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
}

export type TMeal = {
  id: string;
  name: string;
  order: number;
};

export function DataTable({ data }: { data: TMeal[] }) {
  const router = useRouter();
  const columns = useMemo<ColumnDef<TMeal>[]>(() => [
    {
      accessorKey: "name",
      header: "Назва"
    },
    {
      accessorKey: "order",
      header: "порядок",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <button className="bg-destructive text-white p-2 rounded" onClick={async () => {
              const meal = await deleteMeal({ id: row.original.id });
              router.refresh();
            }}>
              <TrashIcon className="h-4 w-4" />
            </button>

          </div>
        );
      }
    }
  ], [router]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="rounded-md border w-full">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
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
  )
}