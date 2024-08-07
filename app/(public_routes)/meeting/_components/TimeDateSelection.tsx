import { useEffect, useState } from 'react';

//Shadcn UI components
import { Calendar } from '@shadcnComponents/calendar';
import { Button } from '@shadcnComponents/button';

//Date format library instelled along with shadcn ui
import { format } from 'date-fns/format';

type Props = {
  date: Date | undefined;
  enableDaySlots: boolean;
  setEnableDaySlots: (value: boolean) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  timeSlots: string[] | undefined;
  daysAvailable: { [key: string]: boolean };
  availableAtCurrentDay: boolean;
  handleDateChange: (selectedDate?: Date) => void;
  prevBookedSlots: { selected_time: string; duration: number }[];
  selectedDateIsToday: boolean | undefined;
};

function TimeDateSelection({
  date,
  enableDaySlots,
  setEnableDaySlots,
  selectedTime,
  setSelectedTime,
  timeSlots,
  daysAvailable,
  availableAtCurrentDay,
  handleDateChange,
  prevBookedSlots,
  selectedDateIsToday,
}: Props) {
  const [initialLoad, setInitialLoad] = useState<boolean>(false);

  //This will check if the initial date on mount from the calendar is available when the component mounts (just once)
  useEffect(() => {
    if (date && !initialLoad && daysAvailable) {
      //Get the day of the week from the initial data (today's date)
      const day = format(date, 'EEEE');

      //This block will execute just for available days
      if (daysAvailable?.[day] && availableAtCurrentDay) {
        setEnableDaySlots(true);
      } else {
        setEnableDaySlots(false);
      }
      setInitialLoad(true);
    }
  }, [daysAvailable, initialLoad, date]);

  const transformTimeToMinutes = (time: string): number => {
    const [hours, minutes_with_period] = time.split(':');
    const [minutes, period] = minutes_with_period.split(' ');

    let time_in_minutes: number = parseInt(hours) * 60 + parseInt(minutes);

    if (period === 'PM' && hours !== '12') time_in_minutes += 12 * 60;

    if (hours === '12' && period === 'AM')
      time_in_minutes = 24 * 60 + parseInt(minutes);

    return time_in_minutes;
  };

  //This will return a boolean telling if the slot has to be disabled or not by checking based on the prevBookedSlots (time and duration) and each slot time
  const handleDisableBooking = (time: string): boolean => {
    //If there are no prevBookedSlots and the selected day is not today, we don't have to check anything
    if (prevBookedSlots.length === 0 && !selectedDateIsToday) {
      return false;
    }

    const current_slot_time_in_minutes_start = transformTimeToMinutes(time);

    //If the selected date is today, we have to check if the current time is greater than the current slot time start
    if (selectedDateIsToday) {
      const current_time_in_minutes =
        new Date().getHours() * 60 + new Date().getMinutes();

      if (current_slot_time_in_minutes_start < current_time_in_minutes)
        return true;
    }

    //FInd out if the current slot overlaps with any of the prevBookedSlots
    return prevBookedSlots.some((item) => {
      const booked_slot_time_in_minutes_start = transformTimeToMinutes(
        item.selected_time
      );
      const booked_slot_time_in_minutes_end =
        booked_slot_time_in_minutes_start + item.duration;

      return (
        current_slot_time_in_minutes_start >=
          booked_slot_time_in_minutes_start &&
        current_slot_time_in_minutes_start < booked_slot_time_in_minutes_end
      );
    });
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
            disabled={!enableDaySlots || handleDisableBooking(time)}
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
