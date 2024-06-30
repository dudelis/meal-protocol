import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import { DataTable, TMeal } from "./meal-table"
import { MealForm } from './meal-form';
import { redirect } from 'next/navigation'
import { getAuthSession } from '@/app/auth';
import { getMeals } from '@/actions/meal';


const MealPage = async () => {
  const session = await getAuthSession();
  if (!session) redirect("/login");


  const meals = (await getMeals()) as TMeal[];

  return (
    <div className='flex flex-col gap-4 w-full'>
      <section className='w-full'>
        <Card className='w-full'>
          <CardHeader>
            <CardTitle>Прийоми їжі</CardTitle>
          </CardHeader>
          <CardContent>
            <MealForm />
          </CardContent>
        </Card>
      </section>
      <section className='w-full'>
        <DataTable data={meals} />
      </section>
    </div>

  );
};

export default MealPage;