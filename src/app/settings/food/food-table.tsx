"use client"
import { deleteFood } from "@/actions/food";
import { TrashIcon } from "@heroicons/react/24/solid";

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


export type TFood = {
  id: string;
  name: string;
  letter: string;
}

export const columns: ColumnDef<TFood>[] = [
  {
    accessorKey: "letter",
    header: "",
    size: 10,
    enableSorting: false,
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center text-xl">
          {row.original.letter.toUpperCase() + ")"}
        </div>
      );
    }
  },
  {
    header: "Назва",
    accessorKey: "name",
  },
  {
    id: "actions",
    size: 10,
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 justify-end">
          <button className="bg-destructive text-white p-2 rounded" onClick={async () => await deleteFood({ id: row.original.id })}>
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      );
    }
  }
];

export function FoodTable({ data }: { data: TFood[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <div className="rounded-md border w-full">
      <Table>
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
  );
}



