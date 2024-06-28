'use client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import useSWR from 'swr'

const FoodPage = () => {


  const [foodList, setFoodList] = useState([]);
  const [foodForm, setFoodForm] = useState({ id: '', foodName: '', weight: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFoodForm({ ...foodForm, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!foodForm.id || !foodForm.foodName || !foodForm.weight) {
      alert('Please fill out all fields.');
      return;
    }
    // setFoodList([...foodList, foodForm]);
    setFoodForm({ id: '', foodName: '', weight: '' }); // Reset form
  };

  return (
    <section className='w-full'>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>Їжа</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </section>
  );
};

export default FoodPage;