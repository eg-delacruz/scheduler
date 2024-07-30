'use client';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';

// //Auth
// import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';

// //Firestore DB
// import { getFirestore, doc, getDoc } from 'firebase/firestore';
// import { app } from '@config/FirebaseConfig';

// //Utils
// import createSchedulerUser from '@utils/createSchedulerUser';

// //Context
// import { useAppContext } from '@context/index';
import { useState } from 'react';

//Components
import Loader from '@components/Loader';
import NoOrgCreated from './_components/NoOrgCreated';
import MeetingsFilter from './_components/MeetingsFilter';
import MeetingsList from './_components/MeetingsList';

//Hooks
import useSetSchedulerUser from '@hooks/useSetSchedulerUser';
import useSecureRoute from '@hooks/useSecureRoute';
import useDebouncedSearchValue from '@hooks/useDebouncedSearchValue';

//TODO: clean this component just like the /organizations/page.tsx
//TODO: instead of redirecting to meeting-type, display the meeting list here
//TODO: When the component mounts, check if the current organization has changed. If so, update the meetings displayed (and set a loading)
function Dashboard() {
  //Context
  //const { SchedulerUser, setSchedulerUser } = useAppContext();

  //Context
  const { loadingSchedulerUser, SchedulerUser } = useSetSchedulerUser();

  //Securing route
  const { loadingAuth } = useSecureRoute();

  //States
  const [loadingChangeCurrentOrg, setLoadingChangeCurrentOrg] =
    useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebouncedSearchValue(search);

  const [color1, setColor1] = useState<boolean>(true);
  const [color2, setColor2] = useState<boolean>(true);
  const [color3, setColor3] = useState<boolean>(true);
  const [color4, setColor4] = useState<boolean>(true);
  const [color5, setColor5] = useState<boolean>(true);

  const colors = [color1, color2, color3, color4, color5];
  const setColors = [setColor1, setColor2, setColor3, setColor4, setColor5];

  const [scheduled, setScheduled] = useState<boolean>(true);

  const [expiration, setExpiration] = useState<'All' | 'Upcoming' | 'Expired'>(
    'Upcoming'
  );

  //Logged in user info
  // const { user, isLoading, isAuthenticated } = useKindeBrowserClient();

  // Initialize Cloud Firestore and get a reference to the service
  //const db = getFirestore(app);

  //const router = useRouter();

  //const [loading, setLoading] = useState<boolean>(true);

  // useEffect(() => {
  //   //TODO: erase the isBusinessRegistered() logic
  //   //user && isBusinessRegistered();
  //   if (user && isAuthenticated && !SchedulerUser) {
  //     isSchedulerUserCreated();
  //   } else if (user && isAuthenticated && SchedulerUser) {
  //     setLoading(false);
  //   }
  // }, [user]);

  // //We first check if there is a registered business before showing the dashboard. If not, we redirect user to create a business
  // const isBusinessRegistered = async () => {
  //   //We access the document called like the user email stored in the Business collection
  //   const docRef = doc(db, 'Business', String(user?.email));
  //   const docSnap = await getDoc(docRef);

  //   //Based on the user email, we look for a document named like it. That document means that we have created a business before and we can start scheduling
  //   if (docSnap.exists()) {
  //     console.log('Document data:', docSnap.data());
  //     setLoading(false);
  //     router.replace('/dashboard/meeting-type');
  //   } else {
  //     console.log('No such document!');
  //     setLoading(false);
  //     router.replace('/create-business');
  //   }
  // };

  // const isSchedulerUserCreated = async () => {
  //   //Ref to db, collection and document name
  //   const docRef = doc(db, 'SchedulerUser', String(user?.email));
  //   const docSnap = await getDoc(docRef);

  //   if (docSnap.exists()) {
  //     const SchedulerUser = docSnap.data() as SchedulerUser;
  //     setSchedulerUser(SchedulerUser);
  //     setLoading(false);
  //   } else {
  //     if (user) {
  //       const SchedulerUser = await createSchedulerUser(user);
  //       setSchedulerUser(SchedulerUser);
  //       console.log('User created');
  //       setLoading(false);
  //     }
  //   }
  // };

  if (!SchedulerUser || loadingAuth || loadingSchedulerUser) {
    return (
      <div className='flex items-center justify-center container h-[90vh]'>
        <Loader />
      </div>
    );
  }

  if (SchedulerUser.organizations.length == 0) {
    return <NoOrgCreated />;
  }

  return (
    <div className='p-5 pt-6'>
      <MeetingsFilter
        setLoading={setLoadingChangeCurrentOrg}
        loading={loadingChangeCurrentOrg}
        setSearch={setSearch}
        colors={colors}
        setColors={setColors}
        setScheduled={setScheduled}
        setExpiration={setExpiration}
      />
      <MeetingsList />
    </div>
  );
}

export default Dashboard;
