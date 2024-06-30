"use client"

import {
  ColumnDef,
  Row,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { TrashIcon } from '@heroicons/react/24/solid';
import { deleteMeal, reorderMeals } from "@/actions/meal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useRouter } from "next/navigation";
import { CSSProperties, useMemo, useState } from "react";
// needed for table body level scope DnD setup
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  type DragEndEvent,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const RowDragHandleCell = ({ rowId }: { rowId: string }) => {
  const { attributes, listeners } = useSortable({
    id: rowId,
  })
  return (
    // Alternatively, you could set these attributes on the rows themselves
    <button {...attributes} {...listeners}>
      🟰
    </button>
  )
}

// Row Component
const DraggableRow = ({ row }: { row: Row<TMeal> }) => {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform), //let dnd-kit do its thing
    transition: transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative',
  }
  return (
    // connect row ref to dnd-kit, apply important styles
    <tr ref={setNodeRef} style={style}>
      {row.getVisibleCells().map((cell) => (
        <TableCell draggable key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </tr>
  )
}
// {
//   row.getVisibleCells().map((cell) => (
//     <TableCell key={cell.id}>
//       {flexRender(cell.column.columnDef.cell, cell.getContext())}
//     </TableCell>
//   ))
// }

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
  const [meals, setMeals] = useState(data)
  const dataIds = useMemo(() => data.map((d) => d.id), [data]);
  const router = useRouter();
  const columns = useMemo<ColumnDef<TMeal>[]>(() => [
    {
      id: 'drag-handle',
      header: '',
      cell: ({ row }) => <RowDragHandleCell rowId={row.id} />,
      size: 10,
      enableResizing: true,
    },
    {
      accessorKey: "name",
      header: "Назва"
    },
    {
      id: "actions",
      size: 10,
      cell: ({ row }) => {
        return (
          <div className="flex gap-2 justify-end">
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
    data: meals,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  })

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )
  async function handleDragEnd(event: DragEndEvent) {
    console.log('drag end', event);
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setMeals(meals => {
        const oldIndex = dataIds.indexOf(active.id.toString())
        const newIndex = dataIds.indexOf(over.id.toString())
        return arrayMove(data, oldIndex, newIndex) //this is just a splice util
      });
      await reorderMeals({ sourceId: active.id.toString(), destinationId: over.id.toString() });
      router.refresh();
    }
  }

  return (
    <div className="rounded-md border w-full">
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
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
            <SortableContext
              items={dataIds}
              strategy={verticalListSortingStrategy}
            >
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <DraggableRow key={row.id} row={row} />
                  // <TableRow
                  //   key={row.id}
                  //   data-state={row.getIsSelected() && "selected"}
                  // >
                  //   {row.getVisibleCells().map((cell) => (
                  //     <TableCell key={cell.id}>
                  //       {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  //     </TableCell>
                  //   ))}
                  // </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </SortableContext>
          </TableBody>
        </Table>
      </DndContext>
    </div>
  )
}