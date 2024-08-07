import { useEffect, useState } from 'react';

//Shadcn UI components
import { Calendar } from '@shadcnComponents/calendar';
import { Button } from '@shadcnComponents/button';

//Date format library instelled along with shadcn ui
import { format } from 'date-fns/format';

type Props = {
  date: Date | undefined;
  handleDateChange: (selectedDate?: Date) => void;
  timeSlots: string[] | undefined;
  setSelectedTime: (time: string) => void;
  selectedTime: string;
  enableTimeSlot: boolean;
  prevBookedSlots: string[];
  setEnableTimeSlot: (value: boolean) => void;
  daysAvailable: { [day: string]: string } | undefined;
};

function TimeDateSelection({
  date,
  handleDateChange,
  timeSlots,
  setSelectedTime,
  selectedTime,
  enableTimeSlot,
  prevBookedSlots,
  setEnableTimeSlot,
  daysAvailable,
}: Props) {
  const [initialLoad, setInitialLoad] = useState<boolean>(false);

  //This will check if the date is available when the component mounts (just once)
  useEffect(() => {
    if (date && !initialLoad && daysAvailable) {
      //Get the day of the week from the initial data (today's date)
      const day = format(date, 'EEEE');

      //This block will execute just for available days
      if (daysAvailable?.[day]) {
        setEnableTimeSlot(true);
      } else {
        setEnableTimeSlot(false);
      }
      setInitialLoad(true);
    }
  }, [daysAvailable, initialLoad, date]);

  //This will return a boolean telling if the slot has to be disabled or not
  const checkTimeSlot = (time: string): boolean => {
    return prevBookedSlots.filter((item: string) => item == time).length > 0;
  };

  return (
    <div className='md:col-span-2 flex px-4'>
      <div className='flex flex-col'>
        <h2 className='font-bold text-lg'>Select Date & Time</h2>
        <Calendar
          mode='single'
          selected={date}
          onSelect={(date) => handleDateChange(date)}
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
        {timeSlots?.map((time: string, index: number) => (
          <Button
            key={index}
            disabled={!enableTimeSlot || checkTimeSlot(time)}
            className={`border-primary text-primary ${
              time === selectedTime && 'bg-primary text-white'
            }`}
            variant='outline'
            onClick={() => setSelectedTime(time)}
          >
            {time}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default TimeDateSelection;
