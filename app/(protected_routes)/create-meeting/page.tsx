'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

//Components
import MeetingForm from './_components/MeetingForm';
import PreviewMeeting from './_components/PreviewMeeting';
import Loader from '@components/Loader';

//Hooks
import useSecureRoute from '@hooks/useSecureRoute';
import useSetSchedulerUser from '@hooks/useSetSchedulerUser';

//Context
import { useAppContext } from '@context/index';

function CreateMeeting() {
  //Securing route
  const { loadingAuth } = useSecureRoute();

  //User
  const { SchedulerUser, loadingSchedulerUser } = useSetSchedulerUser();

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

  const [selectedOrgnization, setSelectedOrganization] = useState<{
    organization_id: string;
    organization_name: string;
    attached_meetings: number;
    start_time: string;
    end_time: string;
  }>({
    organization_id: SchedulerUser?.current_organization?.id ?? '',
    organization_name: SchedulerUser?.current_organization?.name ?? '',
    attached_meetings:
      SchedulerUser?.current_organization?.attached_meetings ?? 0,
    start_time: SchedulerUser?.current_organization?.start_time ?? '',
    end_time: SchedulerUser?.current_organization?.end_time ?? '',
  });

  //Redirect if no organization has been created
  const router = useRouter();
  useEffect(() => {
    if (
      SchedulerUser &&
      SchedulerUser.organizations.length === 0 &&
      !loadingSchedulerUser
    ) {
      router.replace('/organizations');
    }
  }, [SchedulerUser]);

  //Set initial values for the selected organization (from the current organization)
  useEffect(() => {
    if (SchedulerUser) {
      setSelectedOrganization({
        organization_id: SchedulerUser?.current_organization?.id ?? '',
        organization_name: SchedulerUser?.current_organization?.name ?? '',
        attached_meetings:
          SchedulerUser?.current_organization?.attached_meetings ?? 0,
        start_time: SchedulerUser?.current_organization?.start_time ?? '',
        end_time: SchedulerUser?.current_organization?.end_time ?? '',
      });
    }
  }, [SchedulerUser]);

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
            selectedOrganization={selectedOrgnization}
            setSelectedOrganization={setSelectedOrganization}
          />
        </div>

        {/* Preview */}
        <div className='md:col-span-2'>
          <PreviewMeeting
            formValue={formValue}
            organization_start_time={selectedOrgnization.start_time}
            organization_end_time={selectedOrgnization.end_time}
          />
        </div>
      </div>
    );
  }
}

export default CreateMeeting;
