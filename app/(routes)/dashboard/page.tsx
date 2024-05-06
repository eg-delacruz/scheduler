'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

//Auth
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';

//Firestore DB
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '@config/FirebaseConfig';

//This component will just check if there is a created business and redirect accordingly while showing a loading state
//TODO: display a proper loading screen
function Dashboard() {
  //Logged in user info
  const { user } = useKindeBrowserClient();

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    //If the user info is available, the function will execute
    user && isBusinessRegistered();
  }, [user]);

  //We first check if there is a registered business before showing the dashboard. If not, we redirect user to create a business
  const isBusinessRegistered = async () => {
    //We access the document called like the user email stored in the Business collection
    const docRef = doc(db, 'Business', String(user?.email));
    const docSnap = await getDoc(docRef);

    //Based on the user email, we look for a document named like it. That document means that we have created a business before and we can start scheduling
    if (docSnap.exists()) {
      //console.log('Document data:', docSnap.data());
      setLoading(false);
      router.replace('/dashboard/meeting-type');
    } else {
      console.log('No such document!');
      setLoading(false);
      router.replace('/create-business');
    }
  };

  if (loading) {
    return <h2>Loading</h2>;
  }
}

export default Dashboard;
