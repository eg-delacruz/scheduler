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
};

function TimeDateSelection({
  date,
  handleDateChange,
  timeSlots,
  setSelectedTime,
  selectedTime,
  enableTimeSlot,
}: Props) {
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
            disabled={!enableTimeSlot}
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
