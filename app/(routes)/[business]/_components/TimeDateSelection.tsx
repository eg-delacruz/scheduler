//Shadcn UI components
import { Calendar } from '@shadcnComponents/calendar';
import { Button } from '@shadcnComponents/button';

type Props = {
  date: Date | undefined;
  handleDateChange: (selectedDate?: Date) => void;
  timeSlots: string[] | undefined;
  setSelectedTime: (time: string) => void;
  selectedTime: string;
  enableTimeSlot: boolean;
  prevBookedSlots: string[];
};

function TimeDateSelection({
  date,
  handleDateChange,
  timeSlots,
  setSelectedTime,
  selectedTime,
  enableTimeSlot,
  prevBookedSlots,
}: Props) {
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
