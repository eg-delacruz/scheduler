import Image from 'next/image';
import { useEffect, useState } from 'react';

//Icons library
import { CalendarCheck, Clock, MapPin, Timer } from 'lucide-react';
import Link from 'next/link';

//Date format library instelled along with shadcn ui
import { format } from 'date-fns/format';

//Components
import TimeDateSelection from './TimeDateSelection';
import UserFormInfo from './UserFormInfo';

//Schadcn UI components
import { Button } from '@shadcnComponents/button';

//Firestore
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import { app } from '@config/FirebaseConfig';
import { toast } from 'sonner';

type Props = {
  eventInfo: MeetingEvent | undefined;
  businessInfo: BusinessInfo | undefined;
};
//TODO: check that the url works properly
//TODO: display a loading skeleton while fetching data (either hero or in the parent component)
//TODO: block the already occupied time slots
//TODO: Check what happens with the MeetingEvent document. Does it change its status to scheduled?
//TODO: Create a last step saying thank you and that you will receive a confirmation email. Also put a button to redirect to home screen. We can even give a link to see event details and also a link to include it into google calendar
function MeetingTimeDateSelection({ eventInfo, businessInfo }: Props) {
  //States
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [timeSlots, setTimeSlots] = useState<string[]>();
  const [enableTimeSlot, setEnableTimeSlot] = useState<boolean>(false);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [step, setStep] = useState<number>(1);

  //User info states
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userNote, setUserNote] = useState<string>('');
  const [invlidEmailError, setInvalidEmailError] = useState<boolean>(false);

  useEffect(() => {
    eventInfo?.duration && createTimeSlot(eventInfo?.duration);
  }, [eventInfo]);

  const db = getFirestore(app);

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

  //Each time we select a new day, we disable or enable the timeslots
  const handleDateChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      //Get the day of the week from a date
      const day = format(selectedDate, 'EEEE');
      if (businessInfo?.daysAvailable?.[day]) {
        setEnableTimeSlot(true);
      } else {
        setEnableTimeSlot(false);
      }
    }
  };

  const handleScheduleEvent = async () => {
    //Reset the errors
    setInvalidEmailError(false);

    //Handling errors
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(userEmail)) {
      setInvalidEmailError(true);
      return;
    }

    const docId = Date.now().toString();
    await setDoc(doc(db, 'ScheduledMeetings', docId), {
      businessName: businessInfo?.businessName,
      businessEmail: businessInfo?.email,
      selectedTime,
      selectedDate: date,
      duration: eventInfo?.duration,
      locationUrl: eventInfo?.locationUrl,
      eventId: eventInfo?.id,
      id: docId,
      userName,
      userEmail: userEmail,
      userNote,
    }).then((response) => {
      toast('Meeting shceduled successfully!');
    });
  };

  return (
    <div
      className='p-5 py-9 shadow-lg m-5 border-t-8 mx-10 md:mx-26 lg:mx-56 my-10'
      style={{ borderTopColor: eventInfo?.themeColor }}
    >
      <Image src={'/logo.png'} height={20} width={90} alt='Logo' />
      <div className='grid grid-cols-1 md:grid-cols-3 mt-5'>
        {/* Meeting info */}
        <div className='p-4 border-r'>
          <h2>{businessInfo?.businessName}</h2>
          <h2 className='font-bold text-2xl'>
            {eventInfo?.eventName ? eventInfo?.eventName : 'Meeting Name'}
          </h2>
          <div className='mt-5 flex flex-col gap-4'>
            <h2 className='flex gap-2'>
              <Clock />
              {eventInfo?.duration} Min
            </h2>
            <h2 className='flex gap-2'>
              <MapPin />
              {eventInfo?.locationType} Meeting
            </h2>
            <h2 className='flex gap-2'>
              <CalendarCheck /> {format(date ?? '', 'PPP')}
            </h2>
            {selectedTime && (
              <h2 className='flex gap-2'>
                <Timer /> {selectedTime}
              </h2>
            )}
            <Link
              className='text-primary text-ellipsis block whitespace-nowrap overflow-hidden'
              href={eventInfo?.locationUrl ?? ''}
            >
              {eventInfo?.locationUrl}
            </Link>
          </div>
        </div>

        {/* Time and Date Selection */}
        {step === 1 ? (
          <TimeDateSelection
            date={date}
            enableTimeSlot={enableTimeSlot}
            handleDateChange={handleDateChange}
            setSelectedTime={setSelectedTime}
            timeSlots={timeSlots}
            selectedTime={selectedTime}
          />
        ) : (
          <UserFormInfo
            setUserEmail={setUserEmail}
            setUserName={setUserName}
            setUserNote={setUserNote}
            invalidEmailError={invlidEmailError}
          />
        )}
      </div>

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
            disabled={!userName || !userEmail}
          >
            Schedule
          </Button>
        )}
      </div>
    </div>
  );
}

export default MeetingTimeDateSelection;
