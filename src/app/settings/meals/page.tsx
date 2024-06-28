import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import useSWR from 'swr';
import { DataTable } from "./data-table"
import { TMeal, columns } from "./columns"



const meals: TMeal[] = [{ id: '1', name: 'Сніданок', order: 1 }, { id: '2', name: 'Обід', order: 2 }, { id: '3', name: 'Полудень', order: 3 }, { id: '4', name: 'Вечеря', order: 4 }, { id: '5', name: 'Перекус', order: 5 }, { id: '6', name: 'Пізній перекус', order: 6 }, { id: '7', name: 'Інше', order: 7 }];


const MealPage = () => {

  return (
    <div className='flex flex-col gap-4 w-full'>
      <section className='w-full'>
        <Card className='w-full'>
          <CardHeader>
            <CardTitle>Їжа</CardTitle>
            <CardDescription>Можна вказати прийоми їжі</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      </section>
      <section className='w-full'>
        <DataTable columns={columns} data={meals} />
      </section>
    </div>

  );
};

export default MealPage;