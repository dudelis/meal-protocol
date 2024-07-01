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

export type TDayFood = {
  id: string,
  meal: string,
  letter: string
  food: string,
  weight: string,
  userId: string,
  dayId: string,
  createdAt: Date;
  updatedAt: Date;
}


const columns: ColumnDef<TDayFood>[] = [
  {
    accessorKey: "letter",
    header: "",
    size: 10
  },
  {
    header: "Їжа",
    accessorKey: "food",
  },
  {
    header: "Вага",
    accessorKey: "weight",
    size: 10
  }
]

export function DayFoodTable({ data }: { data: TDayFood[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

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