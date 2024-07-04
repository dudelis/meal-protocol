"use client"
import React from 'react';
import { UserIcon } from '@heroicons/react/24/solid'; // Ensure you have @heroicons/react installed
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { Moon, Sun } from 'lucide-react';

const Header = () => {
  const { status } = useSession();
  const { theme, setTheme } = useTheme();

  return (
    <header className="bg-gray-800 text-white p-4 fixed top-0 left-0 w-full">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <h1 className="text-xl font-bold">Health Tracker</h1>
        </Link>
        {theme === 'dark' ?
          <button onClick={() => setTheme("light")}> <Sun /></button> : <button onClick={() => setTheme("dark")}><Moon /></button>}
        <div className="flex items-center space-x-4">
          {status === 'authenticated' ? (
            <button className="bg-destructive hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => signOut()}>
              Logout
            </button>
          ) : (
            <Link href={`/login`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;