'use client';

import { useState } from 'react';

//Components
import MeetingForm from './_components/MeetingForm';
import PreviewMeeting from './_components/PreviewMeeting';
import Loader from '@components/Loader';

//Hooks
import useSecureRoute from '@hooks/useSecureRoute';

function CreateMeeting() {
  //States
  const [formValue, setFormValue] = useState<
    | {
        eventName: string;
        duration: number;
        locationType: string;
        locationUrl: string;
        themeColor: string;
      }
    | undefined
  >();

  //Securing route
  const { loadingAuth } = useSecureRoute();

  if (loadingAuth) {
    return (
      <div className='flex items-center justify-center container h-[90vh]'>
        <Loader />
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-3'>
      {/* Meeting form */}
      <div className='shadow-md border md:h-screen'>
        <MeetingForm setFormValue={setFormValue} />
      </div>

      {/* Preview */}
      <div className='md:col-span-2'>
        <PreviewMeeting formValue={formValue} />
      </div>
    </div>
  );
}

export default CreateMeeting;
