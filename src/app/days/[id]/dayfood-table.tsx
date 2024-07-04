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
import { DayReportDialog } from "../day-report"
import { groupDayFoodsByMeal } from "@/lib/utils"
import { Spinner } from "@/components/Spinner"




export function DayFoodTable({ data, dayId }: { data: DayFood[], dayId: string }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [dayFood, setDayFood] = useState<DayFood | null>(null);
  const [groupedData, setGroupedData] = useState<Record<string, DayFood[]>>({});
  const [spinner, setSpinner] = useState(false);
  useEffect(() => {
    const groupedByMeal: Record<string, DayFood[]> = groupDayFoodsByMeal(data);
    setGroupedData(groupedByMeal);
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
      <Spinner show={spinner} />
      <div className="w-full flex justify-between p-6">
        <Button onClick={createEmptyDayFood}>
          <Pizza className="mr-2" /> Додати їжу
        </Button>
        <DayReportDialog dayId={dayId} />
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