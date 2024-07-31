import Image from 'next/image';
import { useEffect, useState } from 'react';

//Icons library
import { Clock, MapPin } from 'lucide-react';

//Shadcn UI components
import { Calendar } from '@shadcnComponents/calendar';
import { Button } from '@shadcnComponents/button';

//TODO: make this component reusable for editing as well
function PreviewMeeting({
  formValue,
}: {
  formValue:
    | {
        eventName: string;
        organizationName: string;
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
      <p className='ml-4'>
        This is how your meeting will look like for the person scheduling a
        meeting with you. Don't try to change the date and time.
      </p>
      <div
        className='p-5 py-9 shadow-lg m-5 border-t-8'
        style={{ borderTopColor: formValue?.themeColor }}
      >
        <div className='flex justify-between'>
          <div>
            <Image src={'/logo.png'} height={30} width={110} alt='Logo' />
          </div>
          <div className='p-1 bg-gray-200 rounded-sm mr-4'>
            <div className='px-3 py-1.5 shadow-sm rounded-sm bg-white text-sm font-bold'>
              Unscheduled
            </div>
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 mt-5'>
          {/* Meeting info */}
          <div className='p-4 border-r'>
            <p className='font-bold'>{formValue?.organizationName}</p>
            <h2 className='font-bold text-2xl'>
              {formValue?.eventName ? formValue?.eventName : 'Meeting Title'}
            </h2>
            <div className='mt-5 flex flex-col gap-4'>
              <p className='flex gap-2'>
                <Clock />
                {formValue?.duration} Min
              </p>
              <p className='flex gap-2'>
                <MapPin />
                {formValue?.locationType} Meeting
              </p>
              {/* TODO: Use a instead of link to avoid error when typing https:// in production. If error persists, just use a normal p and style it to make it look like a URL */}
              {/* TODO: Erase this TODO after making sure the error doesn't ocure in production */}
              <a
                className='text-primary text-ellipsis block whitespace-nowrap overflow-hidden'
                href={formValue?.locationUrl ?? ''}
              >
                {formValue?.locationUrl}
              </a>
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
