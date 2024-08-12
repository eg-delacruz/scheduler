'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

//Shadcn UI components
import { Button } from '@shadcnComponents/button';

//This library is installed when we install the shadcn UI lib
import { Calendar, Plus, Building, Menu, X } from 'lucide-react';

//Hooks
import useSetSchedulerUser from '@hooks/useSetSchedulerUser';

//Components
import SpinnerLoader from '@components/SpinnerLoader';

//Styles
import styles from './styles.module.scss';

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
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  console.log({ showMobileMenu });

  useEffect(() => {
    path && setActivePath(path);
  }, [path]);

  return (
    <>
      {/* Menu icon */}
      <div
        className={`fixed text-black z-10 p-1 rounded-full cursor-pointer shadow-md ${
          styles.menuIcon
        } ${loadingSchedulerUser && 'hidden'}`}
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        <Menu className='w-6 h-6' />
      </div>

      {/* Menu */}
      <div
        className={`${styles.menu} ${
          !showMobileMenu && styles.hideMenu
        } bg-slate-50 h-screen fixed w-full md:block md:w-64`}
      >
        <div
          className={`absolute text-black rounded-full cursor-pointer border-black ${styles.closeMenuIcon}`}
          onClick={() => setShowMobileMenu(false)}
        >
          <X />
        </div>
        <div className={`p-5 py-14 max-w-72 my-0 mx-auto h-full`}>
          <Link
            href={'/'}
            className='flex justify-center'
            onClick={() => setShowMobileMenu(false)}
          >
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
            onClick={() => setShowMobileMenu(false)}
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
              <Link
                key={item.id}
                href={item.path}
                onClick={() => setShowMobileMenu(false)}
              >
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
      </div>
    </>
  );
}

export default SideNavBar;
