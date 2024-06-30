import { redirect } from "next/navigation";
import { getAuthSession } from "@/app/auth";

const DaysPage = async () => {
  const session = await getAuthSession();
  if (!session) redirect("/login");


  return (
    <div className='flex flex-col gap-4 w-full'>
      <section className='w-full'>
        This is with ID
      </section>
      <section className='w-full'>

      </section>
    </div>

  );
};

export default DaysPage;