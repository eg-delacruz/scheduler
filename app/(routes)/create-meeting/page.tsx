'use client';

import { useState } from 'react';

//Components
import MeetingForm from './_components/MeetingForm';
import PreviewMeeting from './_components/PreviewMeeting';

//TODO: Give initial values to this state instead of conditional rendering the values in the preview screen, since that creates a moment of empty data and therefore it feels slow
function CreateMeeting() {
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
