'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

//Schadcn UI Components
import { Input } from '@shadcnComponents/input';
import { Button } from '@shadcnComponents/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@shadcnComponents/dropdown-menu';

//Utils
import LocationOptions from '@utils/LocationOptions';
import ThemeOptions from '@/utils/ThemeOptions';

//Firestore DB
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { app } from '@config/FirebaseConfig';

//Auth user data
import { LoginLink, useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';

import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

function MeetingForm({ setFormValue }: { setFormValue: Function }) {
  //Input states
  const [eventName, setEventName] = useState<string>();
  const [duration, setDuration] = useState<number>(30);
  const [locationType, setLocationType] = useState<string>();
  const [locationUrl, setLocationUrl] = useState<string>();
  const [themeColor, setThemeColor] = useState<string>();

  const [loginError, setLoginError] = useState<boolean>(false);
  const [validUrl, setValidUrl] = useState<string>('');
  const [creating, setCreating] = useState<boolean>(false);

  const { user } = useKindeBrowserClient();

  const db = getFirestore(app);

  useEffect(() => {
    setFormValue({
      eventName,
      duration,
      locationType,
      locationUrl,
      themeColor,
    });
  }, [eventName, duration, locationType, locationUrl, themeColor]);

  const router = useRouter();

  const handleSubmit = async () => {
    setLoginError(false);
    setCreating(true);
    setValidUrl('');

    //Handling errors
    if (!user?.email) {
      setLoginError(true);
      setCreating(false);
      return;
    }

    //Validating the URL
    const urlRegex = new RegExp(
      '^(https?://)(www.)?([a-zA-Z0-9]+).[a-zA-Z0-9]*.[a-z]{3}.?([a-z]+)?$'
    );
    if (!urlRegex.test(String(locationUrl))) {
      setValidUrl('Please enter a valid URL starting with http or https');
      setCreating(false);
      return;
    }

    //We generate an id based on the current timestamp
    const id = Date.now().toString();
    await setDoc(doc(db, 'MeetingEvent', id), {
      id,
      eventName,
      duration,
      locationType,
      locationUrl,
      themeColor,
      createdBy: user?.email,
      //We reference this event to the corresponding business
      businessId: doc(db, 'Business', user?.email),
    }).then(() => {
      setCreating(false);
      toast('New Meeting Event Created');
      router.replace('/dashboard/meeting-type');
    });
  };

  return (
    <div className='p-8'>
      <Link href={'/dashboard'}>
        <h2 className='flex gap-2'>
          <ChevronLeft /> Cancel
        </h2>
      </Link>
      <div className='mt-4'>
        <h2 className='font-bold text-2xl my-4'>Create New Event</h2>
        <hr />
      </div>

      <div className='flex flex-col gap-3 my-4'>
        <h2 className='font-bold'>Event Name *</h2>
        <Input
          placeholder='Name of your meeting event'
          onChange={(event) => setEventName(event.target.value)}
        />

        <h2 className='font-bold'>Duration *</h2>

        <DropdownMenu>
          {/* The asChild prop of the Trigger merges the props of the passed child with the ones of the Trigger compo. */}
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='max-w-40'>
              {duration} Min
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setDuration(15)}>
              15 Min
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDuration(30)}>
              30 Min
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDuration(45)}>
              45 Min
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDuration(60)}>
              60 Min
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <h2 className='font-bold'>Location *</h2>
        <div className='grid grid-cols-4 gap-3'>
          {LocationOptions.map(
            (option, index): React.ReactNode => (
              <div
                className={`border flex flex-col justify-center items-center p-3 rounded-lg hover:bg-blue-100 hover:border-primary cursor-pointer ${
                  locationType === option.name
                    ? 'bg-blue-100 border-primary'
                    : null
                }`}
                onClick={() => setLocationType(option.name)}
                key={index}
              >
                <Image
                  src={option.icon}
                  alt={option.name}
                  width={30}
                  height={30}
                />
                <h2>{option.name}</h2>
              </div>
            )
          )}
        </div>

        {locationType ? (
          <>
            <h2 className='font-bold'>Add {locationType} Url *</h2>
            <Input
              placeholder='Add Url'
              onChange={(event) => setLocationUrl(event.target.value)}
            />
            {validUrl && (
              <p className='text-red-500 mt-2 bg-red-50 p-1 rounded-sm'>
                {validUrl}
              </p>
            )}
          </>
        ) : null}

        <h2 className='font-bold'>Select Theme Color</h2>
        <div className='flex justify-evenly'>
          {ThemeOptions.map((color, index) => (
            <div
              className={`h-8 w-8 rounded-full cursor-pointer ${
                themeColor === color ? 'border-4 border-black' : null
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setThemeColor(color)}
              key={index}
            ></div>
          ))}
        </div>
      </div>
      <Button
        disabled={
          !eventName || !duration || !locationType || !locationUrl || creating
        }
        className='w-full mt-9'
        onClick={handleSubmit}
      >
        {creating && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
        Create
      </Button>
      {loginError && (
        <p className='text-red-500 mt-2 bg-red-50 p-1 rounded-sm'>
          Seems like your session expired.{' '}
          <LoginLink className='text-primary underline' href={'/'}>
            Sign in
          </LoginLink>{' '}
          before creating a new event
        </p>
      )}
    </div>
  );
}

export default MeetingForm;
