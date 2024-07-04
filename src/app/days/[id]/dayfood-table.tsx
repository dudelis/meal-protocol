"use client"

import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"
import { TrashIcon } from "@heroicons/react/24/solid"
import { DayFood } from "@prisma/client";
import { deleteDayFood } from "@/actions/dayfood"
import { DayFoodForm } from "./dayfood-form"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Pizza } from "lucide-react"




export function DayFoodTable({ data, dayId }: { data: DayFood[], dayId: string }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [dayFood, setDayFood] = useState<DayFood | null>(null);
  const [groupedData, setGroupedData] = useState<Record<string, DayFood[]>>({});
  useEffect(() => {
    // const grouped: Record<string, DayFood[]> = Object.groupBy(data, ({ meal }) => meal);
    // console.log(grouped);
    // setGroupedData(grouped);
    const groupedByMeal: Record<string, DayFood[]> = data.reduce((acc, item) => {
      const key = item.meal; // Assuming [`meal`](command:_github.copilot.openSymbolFromReferences?%5B%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22c%3A%5C%5C_dev%5C%5Cmeal-protocol%5C%5Csrc%5C%5Capp%5C%5Cdays%5C%5C%5Bid%5D%5C%5Cdayfood-table.tsx%22%2C%22_sep%22%3A1%2C%22external%22%3A%22file%3A%2F%2F%2Fc%253A%2F_dev%2Fmeal-protocol%2Fsrc%2Fapp%2Fdays%2F%255Bid%255D%2Fdayfood-table.tsx%22%2C%22path%22%3A%22%2FC%3A%2F_dev%2Fmeal-protocol%2Fsrc%2Fapp%2Fdays%2F%5Bid%5D%2Fdayfood-table.tsx%22%2C%22scheme%22%3A%22file%22%7D%2C%7B%22line%22%3A36%2C%22character%22%3A62%7D%5D "src/app/days/[id]/dayfood-table.tsx") is a property of [`DayFood`](command:_github.copilot.openSymbolFromReferences?%5B%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22c%3A%5C%5C_dev%5C%5Cmeal-protocol%5C%5Cnode_modules%5C%5C.prisma%5C%5Cclient%5C%5Cindex.d.ts%22%2C%22_sep%22%3A1%2C%22external%22%3A%22file%3A%2F%2F%2Fc%253A%2F_dev%2Fmeal-protocol%2Fnode_modules%2F.prisma%2Fclient%2Findex.d.ts%22%2C%22path%22%3A%22%2Fc%3A%2F_dev%2Fmeal-protocol%2Fnode_modules%2F.prisma%2Fclient%2Findex.d.ts%22%2C%22scheme%22%3A%22file%22%7D%2C%7B%22line%22%3A59%2C%22character%22%3A0%7D%5D "node_modules/.prisma/client/index.d.ts") and is of type `string`
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {} as Record<string, DayFood[]>);
    setGroupedData(groupedByMeal);
    console.log(groupedByMeal);
  }, [data, data.length]);

  const columns: ColumnDef<DayFood>[] = useMemo(() => {
    return [
      {
        accessorKey: "letter",
        header: "",
        size: 10,
        cell: ({ row }) => {
          return (
            <span className="flex w-full cursor-pointer p-4 " onClick={() => {
              setDayFood(row.original);
              setSheetOpen(true);
            }}>
              {row.original.letter.toUpperCase() + ") " + row.original.food}
            </span>
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
  }, []);
  const createEmptyDayFood = useCallback(() => {
    setDayFood({
      id: "",
      dayId: dayId,
      food: "",
      letter: "",
      meal: "",
      updatedAt: new Date(),
      createdAt: new Date()
    } as DayFood);
    setSheetOpen(true);
  }, [dayId])


  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <div className="rounded-md border w-full flex flex-col">
      <div className="w-full flex justify-start p-6">
        <Button onClick={createEmptyDayFood}>
          <Pizza className="mr-2" /> Додати їжу
        </Button>
      </div>

      <Sheet open={sheetOpen} onOpenChange={() => setSheetOpen(!sheetOpen)} >
        <SheetContent className="w-full sm:3/4 md:w-3/4 lg:w-3/4 sm:max-w-lg md:max-w-lg ">
          <SheetHeader>
            <SheetTitle>Що з&apos;їв - записуй!</SheetTitle>
          </SheetHeader>
          <DayFoodForm data={dayFood as DayFood} closeSheet={() => setSheetOpen(false)} />
        </SheetContent>
      </Sheet >
      <Table>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            Object.keys(groupedData).map((key) => (
              <>
                <TableRow key={key}>
                  <TableCell colSpan={columns.length} className="py-0">
                    <span className="text-lg font-bold">{key}</span>
                  </TableCell>
                </TableRow>

                {groupedData[key].map((row: DayFood) => {
                  return (
                    <TableRow key={row.id} data-state={row.id === dayFood?.id ? "selected" : ""}>
                      <TableCell key={row.id + row.letter + "0"} className="py-0">
                        <span className="flex w-full cursor-pointer p-4 " onClick={() => {
                          setDayFood(row);
                          setSheetOpen(true);
                        }}>
                          {row.letter.toUpperCase() + ") " + row.food}
                        </span>
                      </TableCell>
                      <TableCell key={row.id + row.letter + "1"} className="py-0">
                        <div className="flex gap-2 justify-end">
                          <button
                            className="bg-destructive text-white p-2 rounded"
                            onClick={async () => await deleteDayFood({ id: row.id })}>
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
                }
              </>
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