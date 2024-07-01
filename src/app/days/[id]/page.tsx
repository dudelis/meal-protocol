import { redirect } from "next/navigation";
import { getAuthSession } from "@/app/auth";
import { getDayById } from "@/actions/day";
import { DayForm } from "../day-form";


type TDayPageProps = {
  params: { [key: string]: string | string[] | undefined };
}

const DayPage = async ({ params }: TDayPageProps) => {
  const session = await getAuthSession();
  if (!session) redirect("/login");
  const day = await getDayById({ id: params.id as string });

  return (
    <div className='flex flex-col gap-4 w-full'>
      <section className='w-full'>
        {day &&
          <DayForm order={day.order as number} sportActivity={day.sportActivity as string} id={day.id} />
        }
      </section>
      <section className='w-full'>

      </section>
    </div>

  );
};

export default DayPage;