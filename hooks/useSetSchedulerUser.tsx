'use client';

import { useEffect, useState } from 'react';

//Auth
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';

//Context
import { useAppContext } from '@context/index';

//Firestore DB
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '@config/FirebaseConfig';

//Utils
import createSchedulerUser from '@utils/createSchedulerUser';

function useSetSchedulerUser() {
  const [loadingSchedulerUser, setLoadingSchedulerUser] =
    useState<boolean>(true);

  //Context
  //TODO: check if the context isn't refetched on every page reload when navigating through the website and coming back to the dashboard
  const { SchedulerUser, setSchedulerUser } = useAppContext();

  //Logged in user info
  const { user, isLoading, isAuthenticated } = useKindeBrowserClient();

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  useEffect(() => {
    if (user && isAuthenticated && !SchedulerUser) {
      isSchedulerUserCreated();
    } else if (user && isAuthenticated && SchedulerUser && !isLoading) {
      setLoadingSchedulerUser(false);
    }
  }, [user, isAuthenticated]);

  const isSchedulerUserCreated = async () => {
    //Ref to db, collection and document name
    const docRef = doc(db, 'SchedulerUser', String(user?.email));
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const SchedulerUser = docSnap.data() as SchedulerUser;
      setSchedulerUser(SchedulerUser);
      setLoadingSchedulerUser(false);
    } else {
      if (user) {
        const SchedulerUser = await createSchedulerUser(user);
        setSchedulerUser(SchedulerUser);
        console.log('User created');
        setLoadingSchedulerUser(false);
      }
    }
  };

  return { loadingSchedulerUser, SchedulerUser };
}

export default useSetSchedulerUser;
