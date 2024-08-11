'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

//Shadcn UI components
import { Button } from '@shadcnComponents/button';

//This library is installed when we install the shadcn UI lib
import { Calendar, Plus, Building } from 'lucide-react';

//Hooks
import useSetSchedulerUser from '@hooks/useSetSchedulerUser';

//Components
import SpinnerLoader from '@components/SpinnerLoader';

//TODO: work on the mobile version of the sidebar
function SideNavBar() {
  const { loadingSchedulerUser, SchedulerUser } = useSetSchedulerUser();

  const menu = [
    {
      id: 1,
      name: 'Meetings',
      path: '/dashboard',
      icon: Calendar,
    },
    {
      id: 2,
      name: 'Organizations',
      path: '/organizations',
      icon: Building,
    },
  ];

  const path = usePathname();
  const [activePath, setActivePath] = useState(path);

  useEffect(() => {
    path && setActivePath(path);
  }, [path]);

  return (
    <div className='p-5 py-14'>
      <Link href={'/'} className='flex justify-center'>
        <Image
          src='/logo.png'
          width={150}
          height={0}
          alt='Logo'
          className='mt-3'
          priority
          style={{ height: 'auto' }}
        />
      </Link>

      <Link
        href={`${
          loadingSchedulerUser
            ? '/dashboard'
            : SchedulerUser?.organizations.length === 0
            ? '/organizations'
            : '/create-meeting'
        }`}
      >
        <Button
          disabled={loadingSchedulerUser}
          className='flex gap-2 w-full rounded-full mt-10'
        >
          {loadingSchedulerUser ? (
            <SpinnerLoader />
          ) : (
            <>
              {' '}
              <Plus />
              Create
            </>
          )}
        </Button>
      </Link>

      <div className='mt-5 flex flex-col gap-5'>
        {menu.map((item) => (
          <Link key={item.id} href={item.path}>
            <Button
              className={`w-full flex gap-2 justify-start hover:bg-blue-100 ${
                activePath === item.path && 'text-primary bg-blue-100'
              }`}
              variant='ghost'
            >
              <item.icon></item.icon>
              {item.name}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SideNavBar;
