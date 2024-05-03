'use client';
import Image from 'next/image';
import Link from 'next/link';

//Auth
import {
  LoginLink,
  RegisterLink,
  useKindeBrowserClient,
} from '@kinde-oss/kinde-auth-nextjs';
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';

//Shadcn UI components
import { Button } from '@shadcnComponents/button';
import { Skeleton } from '@shadcnComponents/skeleton';

function Header() {
  const { isAuthenticated, isLoading } = useKindeBrowserClient();

  return (
    <header>
      <div className='flex justify-between items-center shadow-sm p-4'>
        <Image
          src='/logo.png'
          alt='logo'
          width={100}
          height={100}
          className='w-[150px] md:w[200px]'
        />
        {/* In tailwind, from left to right, classes appear to be work mobile first. In this case, the element is hidden in all screen sizes, till medium and large size screens */}
        <ul className='hidden md:flex gap-14 font-medium text-lg'>
          {/* The primary color can be changed in the tailwind.config, in the primary section */}
          <li className='hover:text-primary transition-all duration-300 cursor-pointer'>
            Product
          </li>
          <li className='hover:text-primary transition-all duration-300 cursor-pointer'>
            Pricing
          </li>
          <li className='hover:text-primary transition-all duration-300 cursor-pointer'>
            Contact us
          </li>
          <li className='hover:text-primary transition-all duration-300 cursor-pointer'>
            About
          </li>
        </ul>

        {isLoading ? (
          <div className='flex gap-2'>
            <Skeleton className='h-[40px] w-[100px] rounded-sm' />
            <Skeleton className='h-[40px] w-[80px] rounded-sm' />
          </div>
        ) : isAuthenticated ? (
          <div className='flex gap-2'>
            <Link href={'/dashboard'}>
              <Button>Dashboard</Button>
            </Link>
            <LogoutLink>
              <Button variant='ghost'>Log out</Button>
            </LogoutLink>
          </div>
        ) : (
          <div className='flex gap-5'>
            <LoginLink>
              <Button variant='ghost'>Login</Button>
            </LoginLink>
            <RegisterLink>
              <Button>Get Started</Button>
            </RegisterLink>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
