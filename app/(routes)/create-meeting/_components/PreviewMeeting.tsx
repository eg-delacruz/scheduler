import Image from 'next/image';
import { useEffect, useState } from 'react';

//Icons library
import { Clock, MapPin } from 'lucide-react';
import Link from 'next/link';

//Shadcn UI components
import { Calendar } from '@shadcnComponents/calendar';
import { Button } from '@shadcnComponents/button';

function PreviewMeeting({
  formValue,
}: {
  formValue:
    | {
        eventName: string;
        duration: number;
        locationType: string;
        locationUrl: string;
        themeColor: string;
      }
    | undefined;
}) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [timeSlots, setTimeSlots] = useState<string[]>();

  useEffect(() => {
    formValue?.duration && createTimeSlot(formValue?.duration);
  }, [formValue]);

  const createTimeSlot = (interval: number) => {
    const startTime = 8 * 60; //8 AM in minutes
    const endTime = 22 * 60; //10 PM in minutes
    const totalSlots = (endTime - startTime) / interval;

    //We can set a fixed array length. Since we are not iterating anything from the beginning to create the new array, the first value of the callback is undefined, therefore we won't use it and in this case we will just access the index
    const slots = Array.from({ length: totalSlots }, (_, index) => {
      const totalMinutes = startTime + index * interval;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const formattedHours = hours > 12 ? hours - 12 : hours; //Convert to 12-hour format
      const period = hours >= 12 ? 'PM' : 'AM';
      //padStart is a method that adds a character to the beginning of a string until it reaches the desired length
      return `${String(formattedHours).padStart(2, '0')}:${String(
        minutes
      ).padStart(2, '0')} ${period}`;
    });

    setTimeSlots(slots);
  };

  return (
    <>
      <h2 className='font-bold text-2xl m-4'>Preview</h2>
      <div
        className='p-5 py-9 shadow-lg m-5 border-t-8'
        style={{ borderTopColor: formValue?.themeColor }}
      >
        <Image src={'/logo.png'} height={20} width={90} alt='Logo' />
        <div className='grid grid-cols-1 md:grid-cols-3 mt-5'>
          {/* Meeting info */}
          <div className='p-4 border-r'>
            <h2>Business Name</h2>
            <h2 className='font-bold text-2xl'>
              {formValue?.eventName ? formValue?.eventName : 'Meeting Name'}
            </h2>
            <div className='mt-5 flex flex-col gap-4'>
              <h2 className='flex gap-2'>
                <Clock />
                {formValue?.duration} Min
              </h2>
              <h2 className='flex gap-2'>
                <MapPin />
                {formValue?.locationType} Meeting
              </h2>
              <Link
                className='text-primary text-ellipsis block whitespace-nowrap overflow-hidden'
                href={formValue?.locationUrl ?? ''}
              >
                {formValue?.locationUrl}
              </Link>
            </div>
          </div>

          {/* Time and Date Selection */}
          <div className='md:col-span-2 flex px-4'>
            <div className='flex flex-col'>
              <h2 className='font-bold text-lg'>Select Date & Time</h2>
              <Calendar
                mode='single'
                selected={date}
                onSelect={setDate}
                className='rounded-md border mt-5'
                disabled={(date) => {
                  //Disable past dates, but allow the current date
                  const today = new Date();
                  //Set the date to the beginning of the day
                  today.setHours(0, 0, 0, 0);
                  return date < today;
                }}
              />
            </div>
            <div
              className='flex flex-col w-full overflow-auto gap-4 p-5'
              style={{ maxHeight: '400px' }}
            >
              {timeSlots?.map((time, index) => (
                <Button
                  className='border-primary text-primary'
                  variant='outline'
                  key={index}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PreviewMeeting;
