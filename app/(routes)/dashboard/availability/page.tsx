'use client';
import { useEffect, useState } from 'react';

//Shadcn UI components
import { Checkbox } from '@shadcnComponents/checkbox';
import { Input } from '@shadcnComponents/input';
import { Button } from '@shadcnComponents/button';
import { Skeleton } from '@shadcnComponents/skeleton';

//Utils
import DaysList from '@utils/DaysList';

//Firestore
import { doc, updateDoc, getFirestore, getDoc } from 'firebase/firestore';
import { app } from '@config/FirebaseConfig';

//Auth
import { LoginLink, useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { toast } from 'sonner';

function Availability() {
  const { user } = useKindeBrowserClient();

  const [daysAvailable, setDaysAvailable] = useState<{}>({
    Sunday: false,
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
  });
  const [startTime, setStartTime] = useState<string>();
  const [endTime, setEndTime] = useState<string>();

  const [fetchingData, setFetchingData] = useState<boolean>(true);

  const [loginError, setLoginError] = useState<boolean>(false);

  const handleDayCheckboxChange = (day: string, e: unknown) => {
    setDaysAvailable({
      ...daysAvailable,
      [day]: e,
    });
  };

  const db = getFirestore(app);

  const handleSave = async () => {
    setLoginError(false);
    if (user?.email) {
      //We update the existing business document by adding the availability time
      const docRef = doc(db, 'Business', user?.email);

      await updateDoc(docRef, {
        daysAvailable,
        startTime,
        endTime,
      }).then(() => {
        toast('Changes updated!');
      });
    } else {
      setLoginError(true);
    }
  };

  //Get previously stored data
  useEffect(() => {
    user && getBusinessInfo();
  }, [user]);

  const getBusinessInfo = async () => {
    if (user?.email) {
      const docRef = doc(db, 'Business', user?.email);
      const docSnap = await getDoc(docRef);
      const result = docSnap.data();
      setDaysAvailable(result?.daysAvailable);
      setStartTime(result?.startTime);
      setEndTime(result?.endTime);
      setFetchingData(false);
    } else {
      setLoginError(true);
    }
  };

  const FetchingDaysSkeleton = () => (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-5 my-3'>
      <Skeleton className='h-[20px] w-[120px]' />
      <Skeleton className='h-[20px] w-[120px]' />
      <Skeleton className='h-[20px] w-[120px]' />
      <Skeleton className='h-[20px] w-[120px]' />
      <Skeleton className='h-[20px] w-[120px]' />
      <Skeleton className='h-[20px] w-[120px]' />
      <Skeleton className='h-[20px] w-[120px]' />
    </div>
  );

  const FetchingTimeWindowSkeleton = () => (
    <div className='flex gap-10'>
      <div className='mt-3'>
        <h2>Start time</h2>
        <Skeleton className='h-[38px] w[94px]' />
      </div>
      <div className='mt-3'>
        <h2>Start time</h2>
        <Skeleton className='h-[38px] w[94px]' />
      </div>
    </div>
  );

  return (
    <div className='p-10'>
      <h2 className='font-bold text-2xl'>Availability</h2>
      <p>
        Choose the days and time window you are available to schedule events
      </p>
      <hr className='my-7' />

      <div>
        <h2 className='font-bold '>Available days</h2>
        {fetchingData ? (
          <FetchingDaysSkeleton />
        ) : (
          <div className='grid grid-cols-2 md:grid-cols-4 gap-5 my-3'>
            {DaysList.map((item, index) => (
              <div key={index}>
                <h2 className='flex gap-1 justify-start items-center'>
                  <Checkbox
                    checked={
                      daysAvailable[item.day as keyof typeof daysAvailable] ||
                      false
                    }
                    onCheckedChange={(e) =>
                      handleDayCheckboxChange(item.day, e)
                    }
                    id={item.day}
                  />
                  <label
                    htmlFor={item.day}
                    className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                  >
                    {item.day}
                  </label>
                </h2>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className='font-bold mt-10'>Available time window</h2>
        {fetchingData ? (
          <FetchingTimeWindowSkeleton />
        ) : (
          <div className='flex gap-10'>
            <div className='mt-3'>
              <h2>Start time</h2>
              <Input
                defaultValue={startTime}
                type='time'
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className='mt-3'>
              <h2>End time</h2>
              <Input
                defaultValue={endTime}
                type='time'
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      <Button disabled={fetchingData} onClick={handleSave} className='mt-10'>
        Save
      </Button>

      {loginError && (
        <p className='text-red-500 mt-2 bg-red-50 p-1 rounded-sm'>
          Seems like your session expired.{' '}
          <LoginLink className='text-primary underline' href={'/'}>
            Sign in
          </LoginLink>{' '}
          before setting up your availability
        </p>
      )}
    </div>
  );
}

export default Availability;
