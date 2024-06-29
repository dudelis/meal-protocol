// "use client"

// import { ColumnDef } from "@tanstack/react-table";
// import { TrashIcon } from '@heroicons/react/24/solid';
// import { deleteMeal } from "@/actions/meal";




// const onRowDeleteClick = async (id: string) => {
//   const meal = await deleteMeal({ id });

// }



// export const columns: ColumnDef<TMeal>[] = [
//   {
//     accessorKey: "name",
//     header: "Назва"
//   },
//   {
//     accessorKey: "order",
//     header: "порядок",
//   },
//   {
//     id: "actions",
//     cell: ({ row }) => {
//       return (
//         <div className="flex gap-2">
//           <button className="bg-destructive text-white p-2 rounded" onClick={() => onRowDeleteClick(row.original.id)}>
//             <TrashIcon className="h-4 w-4" />
//           </button>

//         </div>
//       );
//     }
//   }
// ]
