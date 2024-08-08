'use client';

import { useState } from 'react';
import Image from 'next/image';

//Icons
import { Clock } from 'lucide-react';

//Shadcn components
import { Input } from '@shadcnComponents/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@shadcnComponents/dialog';
import { Button } from '@shadcnComponents/button';
import { toast } from 'sonner';

import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

//Icons
import { Eye } from 'lucide-react';

//Utils
import LocationOptions from '@utils/LocationOptions';
import ThemeOptions from '@/utils/ThemeOptions';

//Date format library instelled along with shadcn ui
import { format } from 'date-fns/format';

//Context
import { useAppContext } from '@context/index';

//Firestore
import { doc, updateDoc, getFirestore } from 'firebase/firestore';
import { app } from '@config/FirebaseConfig';

type Props = {
  meeting: Meeting;
};

//TODO: Improve the mobile separation between the appointee name and appointee email label and input
function MeetingDetailsModal({ meeting }: Props) {
  //States
  const [open, setOpen] = useState(false);
  const [meeting_title, setMeetingTitle] = useState<string>(
    meeting.meeting_title
  );
  const [locationType, setLocationType] = useState<string>(
    meeting.location_platform
  );
  const [location_url_phone, setLocationUrlPhone] = useState<string>(
    meeting.location_url_phone
  );
  const [themeColor, setThemeColor] = useState<string>(meeting.theme_color);
  const [saving, setSaving] = useState<boolean>(false);

  //Error states
  const [validUrlError, setValidUrlError] = useState<string>('');
  const [validPhoneError, setValidPhoneError] = useState<string>('');

  //Context
  const { CurrentMeetings, setCurrentMeetings } = useAppContext();

  //Formating the created_at date (start)
  //Need to convert the created_at date to a Date object, since Firestore returns a Timestamp object with seconds and nanoseconds
  const created_at_date_seconds_timestamp =
    (meeting.created_at as unknown as { seconds: number }).seconds * 1000;
  const created_at_date_nano_timestamp = meeting.created_at as unknown as {
    nanoseconds: number;
  };
  const unixTimestamp =
    created_at_date_seconds_timestamp +
    Number(created_at_date_nano_timestamp) / 1000000;
  const formated_created_at_date = new Date(unixTimestamp);
  //Formating the created_at date (end)

  //Firestore
  const db = getFirestore(app);

  const handleUpdateMeeting = async () => {
    setSaving(true);
    setValidUrlError('');
    setValidPhoneError('');

    //Just update the meeting if the values are different
    if (
      themeColor === meeting.theme_color &&
      locationType === meeting.location_platform &&
      meeting_title === meeting.meeting_title &&
      location_url_phone === meeting.location_url_phone
    ) {
      setSaving(false);
      setOpen(false);
      toast.success('Meeting updated');
      return;
    }

    //Validating the URL
    const urlRegex = new RegExp(
      '^(https?://)(www.)?([a-zA-Z0-9]+).[a-zA-Z0-9]*.[a-z]{3}.?([a-z]+)?$'
    );
    if (
      !urlRegex.test(String(location_url_phone)) &&
      locationType !== 'Phone'
    ) {
      setValidUrlError('Invalid URL');
      setSaving(false);
      return;
    }

    //Validating the phone number
    const phoneRegex = new RegExp('[0-9]*$');
    if (!phoneRegex.test(location_url_phone) && locationType === 'Phone') {
      setValidPhoneError('Invalid phone number');
      setSaving(false);
      return;
    }

    const updatedMeeting = {
      ...meeting,
      theme_color: themeColor,
      location_platform: locationType,
      meeting_title: meeting_title,
      location_url_phone: location_url_phone,
    };

    const updatedMeetings = CurrentMeetings.map((meeting) =>
      meeting.id === updatedMeeting.id ? updatedMeeting : meeting
    );

    const docRef = doc(db, 'Meeting', meeting.id);
    await updateDoc(docRef, {
      theme_color: themeColor,
      location_platform: locationType,
      meeting_title: meeting_title,
      location_url_phone: location_url_phone,
    })
      .then(() => {
        setCurrentMeetings([...updatedMeetings]);
        toast.success('Meeting updated');
      })
      .catch((error) => {
        console.error('Error updating document: ', error);
        toast.error('Error updating meeting');
      });

    setSaving(false);
    setOpen(false);
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Eye
          onClick={() => {
            setThemeColor(meeting.theme_color);
            setLocationType(meeting.location_platform);
            setMeetingTitle(meeting.meeting_title);
            setLocationUrlPhone(meeting.location_url_phone);
          }}
          className='p-1 cursor-pointer w-8 h-8 rounded-sm hover:bg-gray-100'
        />
      </DialogTrigger>

      <DialogContent
        className='max-w-4xl flex flex-col gap-3 border border-t-8'
        style={{
          borderTopColor: themeColor,
          maxHeight: '600px',
          overflowY: 'auto',
          //Style the scroll bar
          scrollbarWidth: 'thin',
          scrollbarColor: 'blue',
        }}
      >
        <VisuallyHidden.Root>
          <DialogHeader>
            <DialogTitle>
              {meeting.meeting_title} -{' '}
              {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
            </DialogTitle>
            <DialogDescription>
              {meeting.formated_date} - {meeting.time}
            </DialogDescription>
          </DialogHeader>
        </VisuallyHidden.Root>
        <div className='flex justify-between mt-4'>
          <h3 className='font-bold'>Meeting Details</h3>
          <div
            className={`p-1 rounded-sm mr-4 ${
              meeting.status === 'scheduled' ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <p className='px-3 py-1.5 shadow-sm rounded-sm bg-white text-sm font-bold'>
              {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
            </p>
          </div>
        </div>

        <div>
          <label className='font-bold mb-2 block'>Meeting title</label>
          <Input
            onChange={(event) => {
              setMeetingTitle(event.target.value);
            }}
            placeholder='e.g. Your business name or personal name'
            defaultValue={meeting_title}
          />
        </div>

        {meeting.formated_date && meeting.time && (
          <p className='font-bold'>{`${meeting.formated_date} - ${meeting.time}`}</p>
        )}

        <p className='flex gap-2 text-gray-500'>
          <Clock /> {meeting.duration} Min
        </p>

        {/* Location */}
        <p className='font-bold'>Location</p>
        <div className='grid grid-cols-4 gap-3 max-w-72'>
          {LocationOptions.map(
            (option, index): React.ReactNode => (
              <div
                className={`border flex flex-col justify-center items-center py-2 px-1 rounded-lg hover:bg-blue-100 hover:border-primary cursor-pointer ${
                  locationType === option.name
                    ? 'bg-blue-100 border-primary'
                    : null
                }`}
                onClick={() => setLocationType(option.name)}
                key={index}
              >
                <Image
                  src={option.icon}
                  alt={option.name}
                  width={30}
                  height={30}
                />
                <p>{option.name}</p>
              </div>
            )
          )}
        </div>

        <p className='font-bold'>
          {locationType === 'Phone' ? 'Phone number' : 'Meeting Url'}
        </p>
        <Input
          placeholder={
            locationType === 'Phone' ? 'Phone number' : 'URL of your meeting'
          }
          onChange={(event) => setLocationUrlPhone(event.target.value)}
          className='max-w-96'
          defaultValue={location_url_phone}
        />
        {validUrlError && (
          <p className='text-red-500 mt-2 bg-red-50 p-1 rounded-sm'>
            {validUrlError}
          </p>
        )}
        {validPhoneError && (
          <p className='text-red-500 mt-2 bg-red-50 p-1 rounded-sm'>
            {validPhoneError}
          </p>
        )}

        {/* Color */}
        <p className='font-bold'>Meeting color</p>
        <div className='flex justify-evenly max-w-72'>
          {ThemeOptions.map((color, index) => (
            <div
              className={`h-8 w-8 rounded-full cursor-pointer ${
                themeColor === color ? 'border-4 border-black' : null
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setThemeColor(color)}
              key={index}
            ></div>
          ))}
        </div>

        <div>
          <p className='text-right text-xs font-bold pb-1 text-gray-400'>
            Created at {format(formated_created_at_date, 'PPP')} by{' '}
            {meeting.created_by}
          </p>

          <hr />
        </div>

        <h3 className='font-bold'>Appointee Details</h3>
        <div className='flex justify-start flex-col sm:flex-row sm:justify-between'>
          <div>
            <p className='font-bold'>Name</p>
            <p className='min-w-40 min-h-10 rounded-md border flex items-center p-2 cursor-not-allowed'>
              {meeting.appointee_name ? meeting.appointee_name : 'Not provided'}
            </p>
          </div>
          <div>
            <p className='font-bold'>Email</p>
            <p className='min-w-40 min-h-10 rounded-md border flex items-center p-2 cursor-not-allowed'>
              {meeting.appointee_email
                ? meeting.appointee_email
                : 'Not provided'}
            </p>
          </div>
        </div>

        <p className='font-bold'>Note</p>
        <p className='rounded-md border p-2 cursor-not-allowed'>
          {meeting.appointee_note ? meeting.appointee_note : 'Not provided'}
        </p>

        <hr />

        <div className='flex justify-between'>
          <Button
            className={`${saving && 'opacity-80'}`}
            onClick={handleUpdateMeeting}
            disabled={saving}
          >
            Save
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
            }}
            variant={'outline'}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default MeetingDetailsModal;
