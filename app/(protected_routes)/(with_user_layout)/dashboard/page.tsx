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

//Components
import Meetings from '@/app/(protected_routes)/(with_user_layout)/dashboard/_components/Meetings';
import Loader from '@components/Loader';

//Hooks
import useSetSchedulerUser from '@hooks/useSetSchedulerUser';
import useSecureRoute from '@hooks/useSecureRoute';

//TODO: clean this component just like the /organizations/page.tsx
//TODO: instead of redirecting to meeting-type, display the meeting list here
function Dashboard() {
  //Context
  //const { SchedulerUser, setSchedulerUser } = useAppContext();

  //Context
  const { loadingSchedulerUser, SchedulerUser } = useSetSchedulerUser();

  //Securing route
  const { loadingAuth } = useSecureRoute();

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

  return <Meetings SchedulerUser={SchedulerUser} />;
}

export default Dashboard;
