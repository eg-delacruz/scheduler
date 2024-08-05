'use client';
import { useEffect, useState } from 'react';

import Image from 'next/image';

//Components
import MeetingInfo from './MeetingInfo';

//Schadcn UI components
import { Button } from '@shadcnComponents/button';

//Components
import UserFormInfo from './UserFormInfo';
import TimeDateSelection from './TimeDateSelection';

//Utils
import createTimeSlots from '@utils/createTimeSlots';

type Props = {
  meeting: Meeting;
  days_available: { [key: string]: boolean };
  start_time: string;
  end_time: string;
};

//TODO: remember to change the status to scheduled when the user submits the form
//TODO: Create a last step saying thank you and that you will receive a confirmation email. Maybe change the local meeting.status property to scheduled and show the details of the meeting. Also create a boolean state in the page.tsx to display a message like "Your meeting has been scheduled. You will receive a confirmation email shortly" and pass its setter to this component (or to the component that submits the form)
function MeetingTimeDateSelection({
  meeting,
  days_available,
  end_time,
  start_time,
}: Props) {
  const [timeSlots, setTimeSlots] = useState<string[]>();
  const [date, setDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  //Used to enable all the slots of the selected day based on the days_available prop and the current selected date
  //TODO: change name to enableDaySlots
  const [enableTimeSlot, setEnableTimeSlot] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);

  //Appointee info states
  const [appointeeName, setAppointeeName] = useState<string>('');
  const [appointeeEmail, setAppointeeEmail] = useState<string>('');

  useEffect(() => {
    meeting.duration &&
      createTimeSlots({
        interval: meeting.duration,
        setTimeSlots,
        start_time,
        end_time,
      });
  }, [meeting]);

  const handleScheduleEvent = async () => {
    console.log('Schedule event');
  };

  const handleDateChange = (selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <div
      className='p-5 py-9 shadow-lg m-5 border-t-8 mx-10 md:mx-26 lg:mx-56 my-10'
      style={{ borderTopColor: meeting.theme_color }}
    >
      <Image src={'/logo.png'} height={20} width={90} alt='Logo' />

      <div className='grid grid-cols-1 md:grid-cols-3 mt-5'>
        {/* Left meeting info column */}
        <MeetingInfo
          meeting={meeting}
          selectedTime={selectedTime}
          date={date}
        />

        {/* Time and Date selection */}
        {step === 1 ? (
          <TimeDateSelection
            date={date}
            enableTimeSlot={enableTimeSlot}
            setEnableTimeSlot={setEnableTimeSlot}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            timeSlots={timeSlots}
            daysAvailable={days_available}
            handleDateChange={handleDateChange}
          />
        ) : (
          <UserFormInfo />
        )}
      </div>

      {/* Buttons */}
      <div className='flex gap-3 justify-end'>
        {step === 2 && (
          <Button variant='outline' onClick={() => setStep(1)}>
            Back
          </Button>
        )}
        {step === 1 ? (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={!selectedTime || !date || !enableTimeSlot}
            className='mt-10 float-right'
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={handleScheduleEvent}
            disabled={!appointeeName || !appointeeEmail}
          >
            Schedule
          </Button>
        )}
      </div>
    </div>
  );
}

export default MeetingTimeDateSelection;
