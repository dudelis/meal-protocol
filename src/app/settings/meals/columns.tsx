"use client"

import { ColumnDef } from "@tanstack/react-table";



export type TMeal = {
  id: string;
  name: string;
  order: number;
};


export const columns: ColumnDef<TMeal>[] = [
  {
    accessorKey: "name",
    header: "Назва"
  },
  {
    accessorKey: "order",
    header: "порядок",
  }
]