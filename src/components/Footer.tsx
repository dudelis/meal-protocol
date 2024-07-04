'use client'
import { ArrowLeftIcon, CalendarIcon, CogIcon, UserIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import FooterSettingsPopover from './FooterPopover';


const navigateBack = (path: string) => {
  const lastSlashIndex = path.lastIndexOf('/');
  if (lastSlashIndex >= 0 && path.length > 1) { // Ensure it's not the first character
    return path.substring(0, lastSlashIndex + 1);
  } else {
    return "/";
  }
};

const FooterMenu = () => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800  dark:border-gray-700">
      <div className="flex justify-around items-center h-16">
        <button onClick={() => { router.push(navigateBack(pathname)) }} className="focus:outline-none w-[25%] flex justify-center hover:bg-popover h-[100%] items-center">
          <ArrowLeftIcon className="h-6 w-6 text-gray-800 dark:text-white" />
        </button>
        <Link href="/days" className="focus:outline-none w-[25%] flex justify-center hover:bg-popover h-[100%] items-center">
          <CalendarIcon className="h-6 w-6 text-gray-800 dark:text-white" />
        </Link>
        <FooterSettingsPopover />
      </div>
    </div>
  );
};

export default FooterMenu;