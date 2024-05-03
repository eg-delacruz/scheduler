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
} from 'firebase/firestore';
import { app } from '@config/FirebaseConfig';

//Auth
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';

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

import { toast } from 'sonner';

//TODO: Make it possible to edit the events
//TODO: Create a loading state while fetching events
type MeetingEvent = {
  //TODO: check the type of the businessId
  businesssId: unknown;
  createdBy: string;
  duration: number;
  eventName: string;
  id: string;
  locationType: string;
  locationUrl: string;
  themeColor: string;
};

function MeetingEventList() {
  //States
  const [events, setEvents] = useState<MeetingEvent[]>([]);
  const [fetchingEvents, setFetchingEvents] = useState<boolean>(false);
  console.log(events);

  const db = getFirestore(app);
  const { user } = useKindeBrowserClient();

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

  useEffect(() => {
    if (user && events.length === 0 && !fetchingEvents) {
      user && getEventList();
    }
  }, [user, events, fetchingEvents]);

  const onDeleteMeetingEvent = async (event: MeetingEvent) => {
    await deleteDoc(doc(db, 'MeetingEvent', event.id)).then((response) => {
      toast('Meeting Event Deleted');
      getEventList();
    });
  };

  return (
    <div className='mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7'>
      {events.length > 0 ? (
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
                  navigator.clipboard.writeText(event.locationUrl);
                  toast('Url copied!');
                }}
              >
                <Copy className='h-4 w-4' /> Copy Link
              </h2>
              <Button
                variant='outline'
                className='border-primary rounded-full text-primary'
              >
                Share
              </Button>
            </div>
          </div>
        ))
      ) : (
        <h2>Loading...</h2>
      )}
    </div>
  );
}

export default MeetingEventList;
