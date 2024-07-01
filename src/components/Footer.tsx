'use client'
import { ArrowLeftIcon, CalendarIcon, CogIcon, UserIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from '@/lib/utils';
import { useState } from 'react';

const buttonClass = "rounded-[5px] cursor-pointer font-bold border-none text-center py-8 px-10 text-md "


const FooterMenu = () => {
  const router = useRouter();

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800  dark:border-gray-700">
      <div className="flex justify-around items-center h-16">
        <button onClick={() => router.back()} className="focus:outline-none w-[25%] flex justify-center hover:bg-popover h-[100%] items-center">
          <ArrowLeftIcon className="h-6 w-6 text-gray-800 dark:text-white" />
        </button>
        <Link href="/days" className="focus:outline-none w-[25%] flex justify-center hover:bg-popover h-[100%] items-center">
          <CalendarIcon className="h-6 w-6 text-gray-800 dark:text-white" />
        </Link>

        <Popover>
          <PopoverTrigger className="focus:outline-none w-[25%] flex justify-center hover:bg-popover h-[100%] items-center">
            <CogIcon className="h-6 w-6 text-gray-800 dark:text-white" />
          </PopoverTrigger>
          <PopoverContent>
            <div className='h-96 flex flex-col gap-16'>
              <Link href="/settings/meals" className={cn(buttonClass, "bg-destructive")}>Прийоми їжі</Link>
              <Link href="/settings/food" className={cn(buttonClass, "bg-destructive")}>Що можна їсти</Link>
            </div>
          </PopoverContent>
        </Popover>
        <Link href="/settings" className="focus:outline-none w-[25%] flex justify-center hover:bg-popover h-[100%] items-center">
          <UserIcon className="h-6 w-6 text-gray-800 dark:text-white" />
        </Link>
      </div>
    </div>
  );
};

export default FooterMenu;