'use client';

import { useState, useEffect } from 'react';

//Components
import MeetingForm from './_components/MeetingForm';
import PreviewMeeting from './_components/PreviewMeeting';
import Loader from '@components/Loader';

//Hooks
import useSecureRoute from '@hooks/useSecureRoute';
import useSetSchedulerUser from '@hooks/useSetSchedulerUser';

//Context
import { useAppContext } from '@context/index';

//TODO: Redirect if no organization is created
function CreateMeeting() {
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

  //Context
  const { setSchedulerUser } = useAppContext();

  if (loadingAuth || loadingSchedulerUser) {
    return (
      <div className='flex items-center justify-center container h-[90vh]'>
        <Loader />
      </div>
    );
  }

  if (
    SchedulerUser &&
    SchedulerUser.current_organization &&
    SchedulerUser.organizations.length > 0
  ) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-3'>
        {/* Meeting form */}
        <div className='shadow-md border md:h-screen'>
          <MeetingForm
            setFormValue={setFormValue}
            SchedulerUser={SchedulerUser}
            setSchedulerUser={setSchedulerUser}
          />
        </div>

        {/* Preview */}
        <div className='md:col-span-2'>
          <PreviewMeeting formValue={formValue} />
        </div>
      </div>
    );
  }
}

export default CreateMeeting;
