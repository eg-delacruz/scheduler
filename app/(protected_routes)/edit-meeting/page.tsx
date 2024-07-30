'use client';

import { useState } from 'react';

//Components
import MeetingForm from '../_components/MeetingForm';
import PreviewMeeting from '../_components/PreviewMeeting';
import Loader from '@components/Loader';

//Hooks
import useSecureRoute from '@hooks/useSecureRoute';
import useSetSchedulerUser from '@hooks/useSetSchedulerUser';

//TODO: Make the MeetingForm and PreviewMeeting components reusable for editing a meeting
function EditMeeting() {
  //States
  const [formValue, setFormValue] = useState<
    | {
        eventName: string;
        organizationName: string;
        duration: number;
        locationType: string;
        locationUrl: string;
        themeColor: string;
      }
    | undefined
  >();

  //Securing route
  const { loadingAuth } = useSecureRoute();

  //User
  const { SchedulerUser, loadingSchedulerUser } = useSetSchedulerUser();

  if (loadingAuth || loadingSchedulerUser) {
    return (
      <div className='flex items-center justify-center container h-[90vh]'>
        <Loader />
      </div>
    );
  }

  if (SchedulerUser) {
    return <div>EditMeeting</div>;
  }
}

export default EditMeeting;
