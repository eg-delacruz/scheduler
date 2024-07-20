import Link from 'next/link';

//Shadcn UI components
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@shadcnComponents/accordion';
import { Button } from '@shadcnComponents/button';

import { CalendarCheck, Clock, Timer } from 'lucide-react';

//TODO: Properly type this in the global types
function ScheduledMeetingList({ meetingList }: { meetingList: any }) {
  return (
    <div>
      {/* TODO: properly type this */}
      {meetingList &&
        meetingList.map((meeting: any) => (
          <Accordion type='single' collapsible key={meeting.id}>
            <AccordionItem value='item-1'>
              <AccordionTrigger>{meeting?.formatedDate}</AccordionTrigger>
              <AccordionContent>
                <div>
                  <div className='mt-5 flex flex-col gap-4'>
                    <h2 className='flex gap-2'>
                      <Clock />
                      {meeting?.duration} Min
                    </h2>
                    {/* TODO: try to add the location type here when creating the meeting */}
                    {/* <h2 className='flex gap-2'>
              <MapPin />
              {meeting?.locationType} Meeting
            </h2> */}
                    <h2 className='flex gap-2'>
                      <CalendarCheck /> {meeting.formatedDate}
                    </h2>

                    <h2 className='flex gap-2'>
                      <Timer /> {meeting?.selectedTime}
                    </h2>

                    <Link
                      className='text-primary text-ellipsis block whitespace-nowrap overflow-hidden'
                      href={meeting?.locationUrl ?? '#'}
                    >
                      {meeting?.locationUrl}
                    </Link>
                  </div>
                  <Link href={meeting.locationUrl}>
                    <Button className='mt-5'>Join now</Button>
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
    </div>
  );
}

export default ScheduledMeetingList;
