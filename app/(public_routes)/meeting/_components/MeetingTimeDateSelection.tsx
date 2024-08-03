'use client';
import { useState } from 'react';

import Image from 'next/image';

//Components
import MeetingInfo from './MeetingInfo';

//Schadcn UI components
import { Button } from '@shadcnComponents/button';

type Props = {
  meeting: Meeting;
  organization: Organization;
};

//TODO: remember to change the status to scheduled when the user submits the form
//TODO: Create a last step saying thank you and that you will receive a confirmation email. Maybe change the local meeting.status property to scheduled and show the details of the meeting. Also create a boolean state in the page.tsx to display a message like "Your meeting has been scheduled. You will receive a confirmation email shortly" and pass its setter to this component (or to the component that submits the form)
function MeetingTimeDateSelection({ meeting, organization }: Props) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');

  //TODO: check what this state does and how it works
  const [enableTimeSlot, setEnableTimeSlot] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);

  //Appointee info states
  const [appointeeName, setAppointeeName] = useState<string>('');
  const [appointeeEmail, setAppointeeEmail] = useState<string>('');

  const handleScheduleEvent = async () => {
    console.log('Schedule event');
  };

  return (
    <div
      className='p-5 py-9 shadow-lg m-5 border-t-8 mx-10 md:mx-26 lg:mx-56 my-10'
      style={{ borderTopColor: meeting.theme_color }}
    >
      <Image src={'/logo.png'} height={20} width={90} alt='Logo' />

      {/* Left meeting info column */}
      <MeetingInfo meeting={meeting} selectedTime={selectedTime} date={date} />

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
