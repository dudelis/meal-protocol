import { DayFood } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function groupDayFoodsByMeal(data: DayFood[]) {
  const groupedByMeal: Record<string, DayFood[]> = data.reduce((acc, item) => {
    const key = item.meal; // Assuming [`meal`](command:_github.copilot.openSymbolFromReferences?%5B%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22c%3A%5C%5C_dev%5C%5Cmeal-protocol%5C%5Csrc%5C%5Capp%5C%5Cdays%5C%5C%5Bid%5D%5C%5Cdayfood-table.tsx%22%2C%22_sep%22%3A1%2C%22external%22%3A%22file%3A%2F%2F%2Fc%253A%2F_dev%2Fmeal-protocol%2Fsrc%2Fapp%2Fdays%2F%255Bid%255D%2Fdayfood-table.tsx%22%2C%22path%22%3A%22%2FC%3A%2F_dev%2Fmeal-protocol%2Fsrc%2Fapp%2Fdays%2F%5Bid%5D%2Fdayfood-table.tsx%22%2C%22scheme%22%3A%22file%22%7D%2C%7B%22line%22%3A36%2C%22character%22%3A62%7D%5D "src/app/days/[id]/dayfood-table.tsx") is a property of [`DayFood`](command:_github.copilot.openSymbolFromReferences?%5B%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22c%3A%5C%5C_dev%5C%5Cmeal-protocol%5C%5Cnode_modules%5C%5C.prisma%5C%5Cclient%5C%5Cindex.d.ts%22%2C%22_sep%22%3A1%2C%22external%22%3A%22file%3A%2F%2F%2Fc%253A%2F_dev%2Fmeal-protocol%2Fnode_modules%2F.prisma%2Fclient%2Findex.d.ts%22%2C%22path%22%3A%22%2Fc%3A%2F_dev%2Fmeal-protocol%2Fnode_modules%2F.prisma%2Fclient%2Findex.d.ts%22%2C%22scheme%22%3A%22file%22%7D%2C%7B%22line%22%3A59%2C%22character%22%3A0%7D%5D "node_modules/.prisma/client/index.d.ts") and is of type `string`
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<string, DayFood[]>);
  return groupedByMeal;
}
