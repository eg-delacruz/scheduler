'use client';

import Image from 'next/image';

import { Button } from '@/components/ui/button';
import AnimatedStandingGirl from './AnimatedStandingGirl/AnimatedStandingGirl';

//Auth
import { LoginLink } from '@kinde-oss/kinde-auth-nextjs';

function Hero() {
  return (
    <section className='flex flex-col justify-center items-center my-20'>
      <div>
        <Image
          src='/images/home/woman_laugh.jpg'
          alt='Woman laughing image'
          width={200}
          height={200}
          className='h-[200px] object-cover rounded-full absolute top-32 xl:left-48 lg:left-6 -z-1 hidden lg:block'
        />
        <AnimatedStandingGirl />
        <Image
          src='/images/home/calendar_draw.svg'
          alt='Calendar image'
          width={350}
          height={175}
          className=' object-cover rounded-md absolute xl:right-36 lg:right-6  -z-10 rotate-12 opacity-75 hidden lg:block'
        />
        <Image
          src='/images/home/date_picker.svg'
          alt='Date picker image'
          width={250}
          height={125}
          className=' object-cover rounded-md absolute left-48  -z-10 -rotate-12 opacity-75 bottom-20 hidden lg:block'
        />
      </div>

      {/* xl is a size measure in tailwind  */}
      <div className='text-center max-w-3xl mt-14'>
        <h2 className='font-bold text-[60px] text-slate-700'>
          Just at the right moment
        </h2>
        <h3 className='text-xl mt-5 text-slate-500'>Easy. Automatic. Free.</h3>
        <div className='flex gap-4 flex-col mt-5'>
          <h4 className='text-sm'>Sign Up free with Google and Facebook</h4>
          <div className='flex justify-center gap-8'>
            <LoginLink>
              <Button className='p-7 flex gap-4'>
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
              <Button className='p-7 flex gap-4'>
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
          <hr />
          <h2>
            <LoginLink className='text-primary'>
              Sign up Free with Email.{' '}
            </LoginLink>{' '}
            No Credit card required
          </h2>
        </div>
      </div>
    </section>
  );
}

export default Hero;
