import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CogIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

const buttonClass = "rounded-[5px] cursor-pointer font-bold border-none text-center py-4 px-10 text-md "

const FooterSettingsPopover = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <Popover open={open} onOpenChange={() => setOpen(!open)}>
      <PopoverTrigger className="focus:outline-none w-[25%] flex justify-center hover:bg-popover h-[100%] items-center">
        <CogIcon className="h-6 w-6 text-gray-800 dark:text-white" />
      </PopoverTrigger>
      <PopoverContent>
        <div className='h-96 flex flex-col gap-8'>
          <button onClick={() => { router.push("/settings/meals"); setOpen(false); }} className={cn(buttonClass, "bg-destructive")}>Прийоми їжі</button>
          <button onClick={() => { router.push("/settings/food"); setOpen(false); }} className={cn(buttonClass, "bg-destructive")}>Що можна їсти</button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default FooterSettingsPopover