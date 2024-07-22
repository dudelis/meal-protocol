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
import Link from "next/link"
import { DayDialog } from "./day-dialog"
import { Spinner } from "@/components/Spinner"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"

export type TDay = {
  id: string,
  order: number,
  sportActivity: string
}



export function DayTable({ data }: { data: TDay[] }) {
  const router = useRouter();
  const [spinner, setSpinner] = useState(false);

  const columns: ColumnDef<TDay>[] = useMemo(() => [
    {
      id: "day-order",
      header: "",
      size: 300,
      cell: ({ row }) => {
        // <span>{`День ${row.original.order}`}</span>
        return (
          <div className="flex gap-2 justify-start w-full">
            <button onClick={() => {
              router.push(`/days/${row.original.id}`)
            }}
              className="w-full  p-4 text-left">
              {`День ${row.original.order}`}
            </button>
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
  ], []);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <div className="rounded-md border w-full">
      <Spinner show={spinner} />
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