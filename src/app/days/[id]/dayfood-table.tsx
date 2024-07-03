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
//import { DayDialog } from "./day-dialog"
import { DayFood } from "@prisma/client";
import { deleteDayFood } from "@/actions/dayfood"
import { DayFoodForm } from "./dayfood-form"




const columns: ColumnDef<DayFood>[] = [
  {
    accessorKey: "letter",
    header: "",
    size: 10,
    cell: ({ row }) => {
      return (
        <DayFoodForm data={row.original}>
          <span className="w-auto">
            {row.original.letter.toUpperCase() + ") " + row.original.food}
          </span>
        </DayFoodForm>
      )
    }
  },

  {
    id: "actions",
    size: 10,
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 justify-end">
          <button className="bg-destructive text-white p-2 rounded" onClick={async () => await deleteDayFood({ id: row.original.id })}>
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      );
    }
  }
]

export function DayFoodTable({ data }: { data: DayFood[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <div className="rounded-md border w-full">
      <Table>
        {/* <TableHeader>
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
        </TableHeader> */}
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