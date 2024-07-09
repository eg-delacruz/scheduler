'use client';

import { useEffect, useState } from 'react';

//Firestore
import {
  collection,
  getFirestore,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';
import { app } from '@config/FirebaseConfig';

//Auth
import { useKindeBrowserClient, LoginLink } from '@kinde-oss/kinde-auth-nextjs';

//Icons
import { Clock, Copy, MapPin, Settings, Pen, Trash } from 'lucide-react';

//Shadcn UI components
import { Button } from '@shadcnComponents/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@shadcnComponents/dropdown-menu';
import { Skeleton } from '@shadcnComponents/skeleton';

import { toast } from 'sonner';

import { redirect } from 'next/navigation';

//TODO: Make it possible to edit the events
//TODO: Create a nicer "No events created" screen
//TODO: Add a modal when deleting an event
function MeetingEventList() {
  //States
  //State used to avoid infinite fetchings on component mount
  const [onMountFetch, setOnMountFetch] = useState<boolean>(false);
  const [events, setEvents] = useState<MeetingEvent[]>([]);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>();
  const [fetchingEvents, setFetchingEvents] = useState<boolean>(true);
  const [loginError, setLoginError] = useState<boolean>(false);

  const db = getFirestore(app);
  const { user, isAuthenticated, isLoading } = useKindeBrowserClient();

  //Getting events
  const getEventList = async () => {
    setEvents([]);
    setFetchingEvents(true);
    const q = query(
      collection(db, 'MeetingEvent'),
      where('createdBy', '==', user?.email),
      //Get the newest at the beginning of the array (for this, I had to do a config in the firestore collection)
      orderBy('id', 'desc')
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      //Store the data in setEvents
      setEvents((prev: MeetingEvent[]) => {
        return [...prev, doc.data() as MeetingEvent];
      });
    });
    setFetchingEvents(false);
  };

  const BusinessInfo = async () => {
    setLoginError(false);
    if (user?.email) {
      const docRef = doc(db, 'Business', user?.email);
      const docSnap = await getDoc(docRef);
      setBusinessInfo(docSnap.data() as BusinessInfo);
    } else {
      setLoginError(true);
    }
  };

  useEffect(() => {
    if (user && !onMountFetch) {
      user && getEventList();
      setOnMountFetch(true);
    }
    if (user) {
      BusinessInfo();
    }
  }, [user, onMountFetch]);

  const onDeleteMeetingEvent = async (event: MeetingEvent) => {
    await deleteDoc(doc(db, 'MeetingEvent', event.id)).then((response) => {
      toast('Meeting Event Deleted');
      getEventList();
    });
  };

  const onCopyClickHandler = (event: MeetingEvent) => {
    const meetingEventUrl =
      process.env.NEXT_PUBLIC_BASE_URL +
      '/' +
      businessInfo?.businessName +
      '/' +
      event.id;
    navigator.clipboard.writeText(meetingEventUrl);
    toast('Url copied!');
  };

  const LoadingSkeleton = () => (
    <>
      <Skeleton className='w-[285p] h-[205px] rounded-lg' />
      <Skeleton className='w-[285p] h-[205px] rounded-lg' />
      <Skeleton className='w-[285p] h-[205px] rounded-lg' />
      <Skeleton className='w-[285p] h-[205px] rounded-lg' />
    </>
  );

  if (fetchingEvents || isLoading) {
    return <LoadingSkeleton />;
  }

  //TODO: If the app doesn't solve the problem of infinite loading, erase the layout of protected routes and use the following code in all protected routes
  // if (!isLoading && !isAuthenticated) {
  //   redirect('/api/auth/login');
  // }

  return (
    <div className='mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7'>
      {events.length === 0 ? (
        <p>No events created</p>
      ) : (
        events?.map((event) => (
          <div
            style={{ borderTopColor: event?.themeColor }}
            className='border shadow-md border-t-8 rounded-lg p-5 flex flex-col gap-3'
            key={event.id}
          >
            <div className='flex justify-end'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Settings className='cursor-pointer' />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem className='flex gap-2'>
                    <Pen /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDeleteMeetingEvent(event)}
                    className='flex gap-2'
                  >
                    <Trash />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <h2 className='font-medium text-xl'>{event.eventName}</h2>

            <div className='flex justify-between'>
              <h2 className='flex gap-2 text-gray-500'>
                <Clock /> {event.duration} Min
              </h2>
              <h2 className='flex gap-2 text-gray-500'>
                <MapPin /> {event.locationType}
              </h2>
            </div>

            <hr />
            <div className='flex justify-between'>
              <h2
                className='flex gap-2 text-sm text-primary items-center cursor-pointer'
                onClick={() => {
                  onCopyClickHandler(event);
                }}
              >
                <Copy className='h-4 w-4' /> Copy public Link
              </h2>
              <Button
                variant='outline'
                className='border-primary rounded-full text-primary'
              >
                Share
              </Button>
              {loginError && (
                <p className='text-red-500 mt-2 bg-red-50 p-1 rounded-sm'>
                  Seems like your session expired.{' '}
                  <LoginLink className='text-primary underline' href={'/'}>
                    Sign in
                  </LoginLink>{' '}
                  before creating a new event
                </p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MeetingEventList;
