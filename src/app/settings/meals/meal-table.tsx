"use client"
import {
  ColumnDef,
  Row,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { TrashIcon } from '@heroicons/react/24/solid';
import { deleteMeal, getMeals, reorderMeals } from "@/actions/meal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useRouter } from "next/navigation";
import { CSSProperties, use, useEffect, useMemo, useState } from "react";
// needed for table body level scope DnD setup
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  type DragEndEvent,
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

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
}

export type TMeal = {
  id: string;
  name: string;
  order: number;
};

const columns: ColumnDef<TMeal>[] = [
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
          <button className="bg-destructive text-white p-2 rounded" onClick={async () => await deleteMeal({ id: row.original.id })}>
            <TrashIcon className="h-4 w-4" />
          </button>

        </div>
      );
    }
  }
];

export function DataTable({ data }: { data: TMeal[] }) {
  const [meals, setMeals] = useState([] as TMeal[]);
  useEffect(() => {
    setMeals(data);

  }, [data]);
  const dataIds = useMemo(() => meals.map((d) => d.id), [meals]);

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
        return arrayMove(meals, oldIndex, newIndex)
      });
      await reorderMeals({ sourceId: active.id.toString(), destinationId: over.id.toString() });
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
          <TableBody>
            <SortableContext
              items={dataIds}
              strategy={verticalListSortingStrategy}
            >
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <DraggableRow key={row.id} row={row} />
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