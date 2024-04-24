import Image from 'next/image';
import { Button } from '@shadcnComponents/button';

function Header() {
  return (
    <div>
      <div className='flex justify-between items-center'>
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

        <div className='flex gap-5 mr-4 shadow-sm'>
          <Button variant='ghost'>Login</Button>
          <Button>Get Started</Button>
        </div>
      </div>
    </div>
  );
}

export default Header;
