'use client';
import { useEffect, useState } from 'react';

import Image from 'next/image';

//Components
import MeetingInfo from './MeetingInfo';
import SpinnerLoader from '@components/SpinnerLoader';

//Schadcn UI components
import { Button } from '@shadcnComponents/button';
import { toast } from 'sonner';

//Components
import UserFormInfo from './UserFormInfo';
import TimeDateSelection from './TimeDateSelection';

//Utils
import createTimeSlots from '@utils/createTimeSlots';

//Firestore
import {
  getFirestore,
  doc,
  query,
  collection,
  where,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { app } from '@config/FirebaseConfig';

//Date format library instelled along with shadcn ui
import { format } from 'date-fns/format';

type Props = {
  meeting: Meeting;
  days_available: { [key: string]: boolean };
  available_at_current_day: boolean;
  start_time: string;
  end_time: string;
  setMeeting: (meeting: Meeting) => void;
  setJustScheduled: (justScheduled: boolean) => void;
};

function MeetingTimeDateSelection({
  meeting,
  days_available,
  available_at_current_day,
  end_time,
  start_time,
  setMeeting,
  setJustScheduled,
}: Props) {
  //States
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

  const [scheduling, setScheduling] = useState<boolean>(false);

  const [step, setStep] = useState<number>(1);

  const selectedDateIsToday: boolean | undefined =
    date && format(date, 'dd/MM/yyyy') === format(new Date(), 'dd/MM/yyyy');

  //Create the timeslots when component mounts (executes just once, since the meeting object is not changing) and time slots won't change during the scheduling process
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

      if (
        selectedDateIsToday &&
        available_at_current_day &&
        days_available[day]
      ) {
        setEnableDaySlots(true);
        getPrevEventBooking(selectedDate);
      } else if (days_available[day]) {
        setEnableDaySlots(true);
        getPrevEventBooking(selectedDate);
      } else {
        setEnableDaySlots(false);
      }
    }
  };

  const handleScheduleEvent = async () => {
    setScheduling(true);
    setInvalidEmailError(false);

    //Handling errors
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(appointeeEmail)) {
      setInvalidEmailError(true);
      setScheduling(false);
      return;
    }

    const updatedMeeting: Meeting = {
      ...meeting,
      status: 'scheduled',
      date,
      formated_date: format(date, 'PPP'),
      formated_timestamp: format(date, 't'),
      time: selectedTime,
      appointee_name: appointeeName,
      appointee_email: appointeeEmail,
      appointee_note: appointeeNote,
      modified_at: new Date(),
      modified_by: appointeeEmail,
    };

    const docRef = doc(db, 'Meeting', meeting.id);
    await updateDoc(docRef, {
      status: 'scheduled',
      date,
      formated_date: format(date, 'PPP'),
      formated_timestamp: format(date, 't'),
      time: selectedTime,
      appointee_name: appointeeName,
      appointee_email: appointeeEmail,
      appointee_note: appointeeNote,
      modified_at: new Date(),
      modified_by: appointeeEmail,
    })
      .then(() => {
        setMeeting(updatedMeeting);
        console.log('Document successfully updated!');
        //TODO: send confirmation email
        toast('Meeting scheduled successfully!');
        setJustScheduled(true);
      })
      .catch((error) => {
        console.error('Error updating document: ', error);
        toast('Error scheduling meeting. Please try again later.');
      })
      .finally(() => {
        setScheduling(false);
      });
  };

  return (
    <div
      className='p-5 py-9 shadow-lg m-5 border-t-8 mx-10 md:mx-26 lg:mx-44 my-10'
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
            availableAtCurrentDay={available_at_current_day}
            handleDateChange={handleDateChange}
            prevBookedSlots={prevBookedSlots}
            selectedDateIsToday={selectedDateIsToday}
          />
        ) : (
          <UserFormInfo
            invalidEmailError={invalidEmailError}
            setAppointeeEmail={setAppointeeEmail}
            setAppointeeName={setAppointeeName}
            setAppointeeNote={setAppointeeNote}
          />
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
            disabled={!appointeeName || !appointeeEmail || scheduling}
            type='submit'
          >
            {scheduling ? <SpinnerLoader /> : 'Schedule'}
          </Button>
        )}
      </div>
    </div>
  );
}

export default MeetingTimeDateSelection;
