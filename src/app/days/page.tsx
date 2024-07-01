import { redirect } from "next/navigation";
import { getAuthSession } from "../auth";
import { DayTable, TDay } from "./day-table";
import { getDays } from "@/actions/day";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { DayForm } from "./day-form";
import { Spacer } from "@/components/spacer";




const DaysPage = async () => {
  const session = await getAuthSession();
  if (!session) redirect("/login");

  const days = (await getDays()) as TDay[];
  const lastOrder = days[0] ? days[0].order + 1 : 1;


  return (
    <div className='flex flex-col gap-4 w-full'>
      <section className='w-full flex justify-end'>
        <Sheet>
          <SheetTrigger>
            <PlusCircleIcon className="h-12 w-12 text-primary cursor-pointer rounded-full active:scale-95 active:bg-gray-200 transition duration-150 ease-in-out" />
          </SheetTrigger>
          <SheetContent className="w-full md:w-3/4 lg:w-1/2 md:max-w-lg ">
            <SheetHeader>
              <SheetTitle>Що з&apos;їв - записуй!</SheetTitle>
              <SheetDescription>
                <DayForm order={lastOrder} sportActivity="" id="" />
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </section>
      <section className='w-full'>
        <DayTable data={days} />
      </section>
      <Spacer></Spacer>
      <Spacer></Spacer>
    </div>
  );
};

export default DaysPage;