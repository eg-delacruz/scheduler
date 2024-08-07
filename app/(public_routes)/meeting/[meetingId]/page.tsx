'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

//Firestore
import {
  collection,
  getFirestore,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import { app } from '@config/FirebaseConfig';

//Components
import Loader from '@components/Loader';
import MeetingTimeDateSelection from '../_components/MeetingTimeDateSelection';
import ScheduledMeetingView from '../_components/ScheduledMeetingView';

type Props = {
  params: {
    meetingId: string;
  };
};

//TODO: If the meeting is already scheduled, show all the details and don't allow to do any changes. Even show a button to add the meeting to the google calendar
function ShareMeetingEvent({ params }: Props) {
  //States
  const [meeting, setMeeting] = useState<Meeting>();
  const [organization, setOrganization] = useState<Organization>();
  const [loading, setLoading] = useState<boolean>(true);
  //Pass this state to the 'congratulatios' component to know if display a message of thankyou and that he will receive a confirmation email
  const [justScheduled, setJustScheduled] = useState<boolean>(false);

  const router = useRouter();

  const db = getFirestore(app);

  useEffect(() => {
    params && getMeetingDetails();
  }, [params]);

  const getMeetingDetails = async () => {
    if (!params.meetingId) {
      router.replace('/404');
      return;
    }

    const meetingDocRef = doc(db, 'Meeting', params.meetingId);
    const meetingDocSnap = await getDoc(meetingDocRef);

    if (meetingDocSnap.exists()) {
      const MeetingDetails = meetingDocSnap.data() as Meeting;
      setMeeting(MeetingDetails);

      //Scheduler User
      const q = query(
        collection(db, 'SchedulerUser'),
        where('id', '==', MeetingDetails.scheduler_user_id)
      );
      const schedulerUserDocSnap = await getDocs(q);
      schedulerUserDocSnap.forEach((doc) => {
        const schedulerUser = doc.data() as SchedulerUser;
        if (schedulerUser) {
          const OrganizationDetails = schedulerUser.organizations.find(
            (org) => org.id === MeetingDetails.organization_id
          );
          setOrganization(OrganizationDetails);
        } else {
          router.replace('/404');
        }
      });
    } else {
      router.replace('/404');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center container h-[90vh]'>
        <Loader />
      </div>
    );
  }

  if (meeting?.status === 'scheduled') {
    return <ScheduledMeetingView />;
  }

  if (meeting && organization)
    return (
      <MeetingTimeDateSelection
        meeting={meeting}
        setMeeting={setMeeting}
        days_available={organization.days_available}
        available_at_current_day={organization.available_at_current_day}
        end_time={organization.end_time}
        start_time={organization.start_time}
        setJustScheduled={setJustScheduled}
      />
    );
}

export default ShareMeetingEvent;
