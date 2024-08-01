'use client';

import { useState, useEffect } from 'react';

//Context
import { useAppContext } from '@context/index';

//Firestore
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import { app } from '@config/FirebaseConfig';

function useGetMeetings({
  organization_email,
  organization_id,
}: {
  organization_email: string;
  organization_id: string;
}) {
  //Context
  const { CurrentMeetings, setCurrentMeetings } = useAppContext();

  //States
  const [loadingMeetings, setLoadingMeetings] = useState<boolean>(true);

  const db = getFirestore(app);

  useEffect(() => {
    getMeetings();
  }, [organization_email, organization_id]);

  const getMeetings = async () => {
    const q = query(
      collection(db, 'Meeting'),
      where('organization_email', '==', organization_email),
      where('organization_id', '==', organization_id)
    );
    const querySnapshot = await getDocs(q);
    const meetings: Meeting[] = [];
    querySnapshot.forEach((doc) => {
      meetings.push(doc.data() as Meeting);
    });
    setCurrentMeetings([...meetings]);
    setLoadingMeetings(false);
  };
  return { loadingMeetings, CurrentMeetings };
}

export default useGetMeetings;
