import { Button } from '@shadcnComponents/button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

//TODO: erase this route
function Confirmation() {
  return (
    <div className='flex flex-col items-center justify-center p-20 gap-5'>
      <CheckCircle className='h-9 w-9 text-green-500' />
      <h2 className='font-bold text-3xl'>
        Your meeting scheduled successfully!
      </h2>
      <h2 className='text-lg text-gray-500'>Confirmation sent to your email</h2>
      <h2 className='text-sm text-gray-500 mt-0'>
        Don't forget to check your spam folder
      </h2>
      <Link href={'/'}>
        <Button>Thank you</Button>
      </Link>
    </div>
  );
}

export default Confirmation;
