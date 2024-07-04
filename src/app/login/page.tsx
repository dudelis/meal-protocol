'use client'
import * as React from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const LoginPage = () => {
  const handleLogin = (provider: string) => {


    // Here, you would call your authentication service to handle the login.
  };
  const buttonClass = "rounded-[5px] cursor-pointer font-bold border-none text-center py-8 px-10 text-xs md:py-6 md:px-8 md:text-base"

  return (
    <section className="flex items-center justify-center mt-20 justify">
      <div className="flex gap-20 flex-col items-center py-20  md:py-14 rounded-[5px]">
        <div className={cn(buttonClass, "bg-[#db4437]")}
          onClick={() => signIn("google")}>Sign in with Google</div>
        {/* <div className={cn(buttonClass, "bg-[#333]")} onClick={()=>signIn("github")}>Sign in with GitHub</div>
        <div className={cn(buttonClass, "bg-[#00a1f1]")} onClick={()=>signIn("azure-ad")}>Sign in with Microsoft</div> */}
      </div>
    </section>
  );
};

export default LoginPage;