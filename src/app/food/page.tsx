'use client'
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import useSWR from 'swr'

const FoodPage = () => {
  const { data, isLoading, mutate, error } = useSWR(`/api/settingsfood`);
  console.log(data);



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
    <div>
      <h1 className="bg-blue-500 text-white p-4 text-xl">Food</h1>
      <section className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="id" className="block">ID</label>
            <input type="text" id="id" name="id" value={foodForm.id} onChange={handleInputChange} className="border p-2 w-full" />
          </div>
          <div>
            <label htmlFor="foodName" className="block">Food Name</label>
            <input type="text" id="foodName" name="foodName" value={foodForm.foodName} onChange={handleInputChange} className="border p-2 w-full" />
          </div>
          <div>
            <label htmlFor="weight" className="block">Weight</label>
            <input type="text" id="weight" name="weight" value={foodForm.weight} onChange={handleInputChange} className="border p-2 w-full" />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Food</button>
        </form>
      </section>
      <section className="p-4">
        <h2 className="text-lg font-bold mb-4">List of added food</h2>
        <ul>
          {foodList.map((food, index) => (
            <li key={index} className="mb-2">
              {/* ID: {food.id}, Food Name: {food.foodName}, Weight: {food.weight} */}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default FoodPage;