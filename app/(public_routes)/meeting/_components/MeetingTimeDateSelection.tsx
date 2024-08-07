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

//Firestore
import {
  getFirestore,
  setDoc,
  doc,
  query,
  collection,
  where,
  getDocs,
} from 'firebase/firestore';
import { app } from '@config/FirebaseConfig';

//Date format library instelled along with shadcn ui
import { format } from 'date-fns/format';

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
  const [date, setDate] = useState<Date>(new Date());
  const [timeSlots, setTimeSlots] = useState<string[]>();
  const [enableDaySlots, setEnableDaySlots] = useState<boolean>(false);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [prevBookedSlots, setPrevBookedSlots] = useState<
    { selected_time: string; duration: number }[]
  >([]);

  //Appointee info states
  const [appointeeName, setAppointeeName] = useState<string>('');
  const [appointeeEmail, setAppointeeEmail] = useState<string>('');
  const [appointeeNote, setAppointeeNote] = useState<string>('');
  const [invalidEmailError, setInvalidEmailError] = useState<boolean>(false);

  const [step, setStep] = useState<number>(1);

  //Create the timeslots when component mounts (executes just once, since the meeting object is not changing)
  useEffect(() => {
    meeting.duration &&
      createTimeSlots({
        interval: meeting.duration,
        setTimeSlots,
        start_time,
        end_time,
      });
  }, [meeting]);

  const db = getFirestore(app);

  //TODO: test this when I already have some scheduled meetings
  const getPrevEventBooking = async (selectedDate: Date) => {
    const q = query(
      collection(db, 'Meeting'),
      where('date', '==', selectedDate),
      where('organization_id', '==', meeting.organization_id),
      where('status', '==', 'scheduled')
    );

    const querySnapshot = await getDocs(q);

    let currentPrevBookedSlots: { selected_time: string; duration: number }[] =
      [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as Meeting;
      currentPrevBookedSlots.push({
        selected_time: data.time,
        duration: data.duration,
      });
    });

    setPrevBookedSlots(currentPrevBookedSlots);
  };

  const handleDateChange = (selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);

      //Get the day of the week from a date
      const day = format(selectedDate, 'EEEE');

      //This block will execute just for available days
      if (days_available[day]) {
        setEnableDaySlots(true);
        getPrevEventBooking(selectedDate);
      } else {
        setEnableDaySlots(false);
      }
    }
  };

  const handleScheduleEvent = async () => {
    console.log('Schedule event');
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
            enableDaySlots={enableDaySlots}
            setEnableDaySlots={setEnableDaySlots}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            timeSlots={timeSlots}
            daysAvailable={days_available}
            handleDateChange={handleDateChange}
            prevBookedSlots={prevBookedSlots}
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
            disabled={!selectedTime || !date || !enableDaySlots}
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
