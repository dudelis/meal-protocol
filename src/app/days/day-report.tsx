import { deleteDay, getDayById } from "@/actions/day";
import { Spacer } from "@/components/spacer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { groupDayFoodsByMeal } from "@/lib/utils";
import { DayFood, Prisma } from "@prisma/client";
import { set } from "date-fns";
import { MessageSquareWarning, Clipboard } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";


export type TDayWithDayFoods = Prisma.DayGetPayload<{ include: { dayFoods: true } }>;

export const DayReportDialog = ({ dayId }: { dayId: string }) => {
  const [open, setOpen] = useState(false);
  const [day, setDay] = useState<TDayWithDayFoods | null>(null);
  const [dayFoods, setDayFoods] = useState<Record<string, DayFood[]>>({});
  const [report, setReport] = useState<string | null>(null);

  useEffect(() => {
    getDayById({ id: dayId }).then((day) => {
      setDay(day as TDayWithDayFoods);
      if (day) {
        setDayFoods(groupDayFoodsByMeal(day.dayFoods));
        setReport(
          `
            День ${day.order}<br />
            Спортивна активність: <br />
            ${day.sportActivity}
            <br />
            <br />
            <ul>
              ${Object.keys(dayFoods).map((key) => {
            return (
              `<li key="${key}">${key}
                <ul>
                  ${dayFoods[key].map((dayFood) => {
                return (
                  `<li key="${dayFood.id}">&nbsp; ${`${dayFood.letter}) ${dayFood.food}`}</li>`
                )
              }).join("")}
                </ul>
              </li>`
            )
          }).join("")
          }
            </ul>`
        );
      }
    });
    return () => {
      // Cleanup logic here if needed
    };
  }, [open, dayId]);

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger>
        <div className="bg-destructive text-white p-2 rounded flex">
          <MessageSquareWarning className="h-6 w-6" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Звіт для тренера</DialogTitle>
          <Spacer />
          {day &&
            <DialogDescription>
              <div dangerouslySetInnerHTML={{ __html: report as string }} />
            </DialogDescription>}
        </DialogHeader>
        <Spacer />
        <DialogFooter className="flex flex-row sm:justify-between justify-between">
          <Button variant="default" onClick={() => navigator.clipboard.writeText(report?.toString() as string)}><Clipboard /></Button>
          <Button variant="outline" onClick={() => setOpen(false)} >Зачинити</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}