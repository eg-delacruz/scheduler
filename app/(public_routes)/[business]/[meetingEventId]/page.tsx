'use client';

import { useEffect, useState } from 'react';

//Components
import MeetingTimeDateSelection from '../_components/MeetingTimeDateSelection';

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

type Props = {
  params: {
    business: string;
    meetingEventId: string;
  };
};

//TODO: create loading state
//TODO: display errors if there is no businessInfo or eventInfo available -> send to 404
function ShareMeetingEvent({ params }: Props) {
  //States
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>();
  const [eventInfo, setEventInfo] = useState<MeetingEvent>();
  const [loading, setLoading] = useState<boolean>(false);

  const db = getFirestore(app);

  useEffect(() => {
    params && getMeetingBusinessAndEventDetails();
  }, [params]);

  const getMeetingBusinessAndEventDetails = async () => {
    setLoading(true);
    //Business
    const q = query(
      collection(db, 'Business'),
      where('businessName', '==', params.business)
    );
    const docSnap = await getDocs(q);
    docSnap.forEach((doc) => setBusinessInfo(doc.data() as BusinessInfo));

    //Event details
    const docRef = doc(db, 'MeetingEvent', params.meetingEventId);
    const result = await getDoc(docRef);

    setEventInfo(result.data() as MeetingEvent);

    setLoading(false);
  };

  return (
    <div>
      <MeetingTimeDateSelection
        eventInfo={eventInfo}
        businessInfo={businessInfo}
      />
    </div>
  );
}

export default ShareMeetingEvent;
