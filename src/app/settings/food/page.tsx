import { getFood } from '@/actions/food';
import { getAuthSession } from '@/app/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { useState } from 'react';
import { FoodForm } from './food-form';
import { FoodTable } from './food-table';
import { Spacer } from '@/components/spacer';

const FoodPage = async () => {
  const session = await getAuthSession();
  if (!session) redirect("/login");
  const foods = await getFood();


  return (
    <div className='flex flex-col gap-4 w-full'>
      <section className='w-full'>
        <Card className='w-full'>
          <CardHeader>
            <CardTitle>Що можна їсти?</CardTitle>
          </CardHeader>
          <CardContent>
            <FoodForm />
          </CardContent>
        </Card>
      </section>
      <section className='w-full'>
        <FoodTable data={foods} />
      </section>
      <Spacer />
      <Spacer />
    </div>
  );
};

export default FoodPage;