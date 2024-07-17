'use client';

import Image from 'next/image';

import { Button } from '@shadcnComponents/button';
import AnimatedStandingGirl from './AnimatedStandingGirl/AnimatedStandingGirl';

//Auth
import { LoginLink } from '@kinde-oss/kinde-auth-nextjs';
import AnimatedCalendar from './AnimatedCalendar/AnimatedCalendar';
import AnimatedDatePicker from './AnimatedDatePicker/AnimatedDatePicker';

function Hero() {
  return (
    <section className='hero_landing_bg h-full relative z-10'>
      {/* Images */}
      <div>
        <Image
          src='/images/home/woman_laugh.jpg'
          alt='Woman smiling image'
          width={200}
          height={200}
          className='h-[200px] object-cover rounded-full absolute top-10 xl:left-48 lg:left-6 -z-1 hidden lg:block border-gray-300 border-8'
        />
        <AnimatedStandingGirl />

        <AnimatedCalendar />

        <AnimatedDatePicker />
      </div>

      {/* xl is a size measure in tailwind  */}
      <div className='text-center max-w-xl mx-auto'>
        <h2 className='font-bold text-[60px] text-slate-900 pt-2 md:pt-32'>
          Your Scheduler
        </h2>
        <h3 className='text-xl mt-5 text-slate-700'>
          Just at the right moment
        </h3>
        <div className='flex gap-4 flex-col sm:mt-5'>
          <h4 className='text-sm'>
            Free scheduling tool to manage all your appointments
          </h4>
          <div className='flex flex-col items-center gap-3 sm:flex-row sm:gap-8 justify-center'>
            <LoginLink>
              <Button className='p-7 flex gap-4 w-[234px]'>
                <Image
                  src='/icons/google.png'
                  alt='Google logo'
                  width={40}
                  height={40}
                  className='bg-white p-1 rounded-sm'
                />
                Sign up with Google
              </Button>
            </LoginLink>
            <LoginLink>
              <Button className='p-7 flex gap-4 w-[234px]'>
                <Image
                  src='/icons/facebook.png'
                  alt='Google logo'
                  width={40}
                  height={40}
                  className='bg-white p-1 rounded-sm'
                />{' '}
                Sign up with Facebook
              </Button>
            </LoginLink>
          </div>
          <hr className='border-stone-700 opacity-80 w-[200px] mx-auto' />
          <h2>
            <LoginLink className='text-primary'>Sign up with Email</LoginLink>
          </h2>
        </div>
      </div>
    </section>
  );
}

export default Hero;
