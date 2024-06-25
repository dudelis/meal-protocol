import { ArrowLeftIcon, CalendarIcon, CogIcon, UserIcon } from '@heroicons/react/24/solid';

const FooterMenu = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 border-t dark:border-gray-700">
      <div className="flex justify-around items-center h-16">
        <button aria-label="Back" className="focus:outline-none">
          <ArrowLeftIcon className="h-6 w-6 text-gray-800 dark:text-white" />
        </button>
        <button aria-label="Log Meal for the Day" className="focus:outline-none">
          <CalendarIcon className="h-6 w-6 text-gray-800 dark:text-white" />
        </button>
        <button aria-label="Settings" className="focus:outline-none">
          <CogIcon className="h-6 w-6 text-gray-800 dark:text-white" />
        </button>
        <button aria-label="Profile" className="focus:outline-none">
          <UserIcon className="h-6 w-6 text-gray-800 dark:text-white" />
        </button>
      </div>
    </div>
  );
};

export default FooterMenu;