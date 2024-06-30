import { redirect } from "next/navigation";
import { getAuthSession } from "../auth";
import { DayTable } from "./day-table";
import { getDays } from "@/actions/day";





const DaysPage = async () => {
  const session = await getAuthSession();
  if (!session) redirect("/login");

  const days = (await getDays()) as TDay[];


  return (
    <div className='flex flex-col gap-4 w-full'>
      <section className='w-full'>
        <DayTable data={days} />
      </section>
      <section className='w-full'>

      </section>
    </div>

  );
};

export default DaysPage;