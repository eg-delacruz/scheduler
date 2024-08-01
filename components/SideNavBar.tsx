'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

//Shadcn UI components
import { Button } from '@shadcnComponents/button';

//This library is installed when we install the shadcn UI lib
import {
  Briefcase,
  Calendar,
  Clock,
  Plus,
  Settings,
  Building,
} from 'lucide-react';

//TODO: When clicking on the create button, redirect to /organizations if no organization is created. Otherwise, redirect to /create-meeting. Also, check if the amount of meetings is greater than 20, so that it displays a message saying that the user needs to delete some.
function SideNavBar() {
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
    {
      id: 3,
      name: 'Meeting Type',
      path: '/dashboard/meeting-type',
      icon: Briefcase,
    },
    {
      id: 4,
      name: 'Scheduled Meeting',
      path: '/dashboard/scheduled-meeting',
      icon: Calendar,
    },
    {
      id: 5,
      name: 'Availability',
      path: '/dashboard/availability',
      icon: Clock,
    },
    {
      id: 6,
      name: 'Settings',
      path: '/dashboard/settings',
      icon: Settings,
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
          height={150}
          alt='Logo'
          className='mt-3'
        />
      </Link>

      <Link href={'/create-meeting'}>
        <Button className='flex gap-2 w-full rounded-full mt-10'>
          {' '}
          <Plus />
          Create
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
