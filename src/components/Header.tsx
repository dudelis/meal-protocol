import React from 'react';
import { UserIcon } from '@heroicons/react/24/solid'; // Ensure you have @heroicons/react installed

const Header = () => {
  const isAuthenticated = false; // Placeholder for authentication logic

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Meal Protocol</h1>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Logout
            </button>
          ) : (
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Login
            </button>
          )}
          <UserIcon className="h-6 w-6" />
        </div>
      </div>
    </header>
  );
};

export default Header;