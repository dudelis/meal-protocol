"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/solid"
import { deleteDay } from "@/actions/day"
import Link from "next/link"
import { DayDialog } from "./day-dialog"

export type TDay = {
  id: string,
  order: number,
  sportActivity: string
}

export const columns: ColumnDef<TDay>[] = [
  {
    id: "day-order",
    header: "",
    size: 300,
    cell: ({ row }) => {
      // <span>{`День ${row.original.order}`}</span>
      return (
        <div className="flex gap-2 justify-start w-full">
          <Link href={`/days/${row.original.id}`} className="w-full  p-4">
            {`День ${row.original.order}`}
          </Link>
        </div>
      )
    }
  },
  {
    id: "action-delete",
    size: 10,
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 justify-end p-4 ">
          <DayDialog id={row.original.id} />
        </div>
      );
    }
  }
]

export function DayTable({ data }: { data: TDay[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <div className="rounded-md border w-full">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} style={{ width: `${header.getSize()}px !important` }}>
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
                  <TableCell key={cell.id} className="p-0">
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
  );
}