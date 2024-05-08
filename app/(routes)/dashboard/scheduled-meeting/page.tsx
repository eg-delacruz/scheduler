'use client';
import { useEffect, useState } from 'react';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@shadcnComponents/tabs';

//Compoents
import ScheduledMeetingList from './_components/ScheduledMeetingList';

//Firestore
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import { app } from '@config/FirebaseConfig';

//Auth
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';

import { format } from 'date-fns/format';

//TODO: add the 'expired' meetings in the second tab
function ScheduledMeeting() {
  //States
  //TODO: properly type this
  const [mounted, setMounted] = useState<boolean>(false);
  const [meetingList, setMeetingList] = useState<any[]>([]);
  console.log(meetingList);

  //Auth
  const { user } = useKindeBrowserClient();

  useEffect(() => {
    if (user && !mounted) {
      getScheduledMeeting();
      setMounted(true);
    }
  }, [user, mounted]);

  const db = getFirestore(app);

  //Used to get business previous meetings
  const getScheduledMeeting = async () => {
    setMeetingList([]);
    const q = query(
      collection(db, 'ScheduledMeetings'),
      where('businessEmail', '==', user?.email)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setMeetingList((prev) => [...prev, doc.data()]);
    });
  };

  //TODO: properly type this
  const filterMeetingList = (type: 'upcoming' | 'expired') => {
    if (type === 'upcoming') {
      return meetingList.filter(
        (meeting) => meeting.formatedTimeStamp >= format(new Date(), 't')
      );
    } else {
      return meetingList.filter(
        (meeting) => meeting.formatedTimeStamp < format(new Date(), 't')
      );
    }
  };

  return (
    <div className='p-10'>
      <h2 className='font-bold text-2xl'>Scheduled Meetings</h2>
      <hr className='my-5' />

      <Tabs defaultValue='upcoming' className='w-[400px]'>
        <TabsList>
          <TabsTrigger value='upcoming'>Upcoming</TabsTrigger>
          <TabsTrigger value='expired'>Expired</TabsTrigger>
        </TabsList>
        <TabsContent value='upcoming'>
          <ScheduledMeetingList meetingList={filterMeetingList('upcoming')} />
        </TabsContent>
        <TabsContent value='expired'>
          <ScheduledMeetingList meetingList={filterMeetingList('expired')} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ScheduledMeeting;
