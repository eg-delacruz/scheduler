'use client';
import Image from 'next/image';

import {
  LogoutLink,
  useKindeBrowserClient,
} from '@kinde-oss/kinde-auth-nextjs';
import { ChevronDown } from 'lucide-react';

//Shadcn UI components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@shadcnComponents/dropdown-menu';
import { Skeleton } from '@shadcnComponents/skeleton';

function DashboardHeader() {
  const { user } = useKindeBrowserClient();
  return (
    <div className='p-4 px-10'>
      {user?.picture ? (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger className='flex items-center float-right'>
              <Image
                src={String(user?.picture)}
                alt='User picture'
                width={40}
                height={40}
                className='rounded-full'
              />
              <ChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>
                <LogoutLink>Logout</LogoutLink>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <div className='float-right flex items-center justify-between'>
          <Skeleton className='w-[40px] h-[40px] rounded-full mr-1' />
          <Skeleton className='w-[20px] h-[10px] rounded-sm' />
        </div>
      )}
    </div>
  );
}

export default DashboardHeader;
