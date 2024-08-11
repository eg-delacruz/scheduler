'use client';

//Animations
import { useAutoAnimate } from '@formkit/auto-animate/react';

//Schadcn components
import { Skeleton } from '@shadcnComponents/skeleton';

//Icons
import { Clock, Copy, MapPin } from 'lucide-react';

//Components
import DeleteMeetingModal from './DeleteMeetingModal';
import MeetingDetailsModal from './MeetingDetailsModal';

type Props = {
  loadingMeetings: boolean;
  loadingChangeCurrentOrg: boolean;
  meetings: Meeting[];
  current_organization_id: string;
  total_current_meetings: number;
};

import { toast } from 'sonner';

//TODO: Possibility in the future: add a google calendar button to add the meeting to the user's google calendar

function MeetingList({
  meetings,
  loadingMeetings,
  loadingChangeCurrentOrg,
  current_organization_id,
  total_current_meetings,
}: Props) {
  //Animate list of activities
  const [animationParent] = useAutoAnimate();

  const onCopyClickHandler = (meeting: Meeting) => {
    const meetingEventLink =
      process.env.NEXT_PUBLIC_BASE_URL + 'meeting/' + meeting.id;
    navigator.clipboard.writeText(meetingEventLink);
    toast('Url copied!');
  };

  const meetings_organization_id = meetings[0]?.organization_id;

  //Google Calendar API (leave here in case we want to add the feature in the future)

  const handleAddToGoogleCalendar = async (meeting: Meeting) => {
    //Transform the meeting date to Date.toISOString() format
    const date_seconds_timestamp =
      (meeting.date as unknown as { seconds: number }).seconds * 1000;
    const created_at_date_nano_timestamp = meeting.date as unknown as {
      nanoseconds: number;
    };
    const unixTimestamp =
      date_seconds_timestamp + Number(created_at_date_nano_timestamp) / 1000000;
    const formated_date = new Date(unixTimestamp);

    const duration = meeting.duration;

    //Add the time to the date
    let [hours, minutes_with_period] = meeting.time.split(':');
    let [minutes, period] = minutes_with_period.split(' ');

    let number_hours = parseInt(hours);
    let number_minutes = parseInt(minutes);

    if (period === 'PM' && hours !== '12') number_hours += 12;
    if (hours === '12' && period === 'AM') number_hours = 24;

    formated_date.setHours(number_hours);
    formated_date.setMinutes(number_minutes);
    formated_date.setSeconds(0);
    formated_date.setMilliseconds(0);

    //Transform the date to ISOString but with my current timezone
    const start_time = formated_date.toISOString();
    const end_time = new Date(
      formated_date.getTime() + duration * 60000
    ).toISOString();

    const event = {
      summary: meeting.meeting_title,
      description: `Meeting between ${meeting.appointee_name} and ${meeting.organization_name}`,
      start: {
        dateTime: start_time,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: end_time,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };
  };

  if (
    loadingMeetings ||
    loadingChangeCurrentOrg ||
    (meetings_organization_id !== current_organization_id &&
      meetings_organization_id !== undefined)
  ) {
    return (
      <div className='mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7'>
        <Skeleton className='h-52 w-full rounded-lg' />
        <Skeleton className='h-52 w-full rounded-lg' />
        <Skeleton className='h-52 w-full rounded-lg' />
        <Skeleton className='h-52 w-full rounded-lg' />
        <Skeleton className='h-52 w-full rounded-lg' />
        <Skeleton className='h-52 w-full rounded-lg' />
      </div>
    );
  }

  if (meetings.length === 0 && total_current_meetings !== 0) {
    return (
      <div className='pt-10'>
        <div className='border-2 rounded max-w-xl mx-auto bg-slate-50 text-center p-2'>
          <h3>No meetings match the selected filters</h3>
        </div>
      </div>
    );
  }

  if (meetings.length === 0 && meetings_organization_id === undefined) {
    return (
      <div className='pt-10'>
        <div className='border-2 rounded max-w-xl mx-auto bg-slate-50 text-center p-2'>
          <h3>No events created for this organization yet</h3>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={animationParent}
        className='mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7'
      >
        {meetings.map((meeting) => (
          <div
            style={{ borderTopColor: meeting.theme_color }}
            className='border shadow-md border-t-8 rounded-lg p-5 flex flex-col gap-3'
            key={meeting.id}
          >
            <div className='flex justify-between gap-2'>
              <h4>{meeting.meeting_title}</h4>

              <MeetingDetailsModal meeting={meeting} />
            </div>

            <p
              className={`font-bold ${
                meeting.status === 'unscheduled' && 'text-gray-500'
              }`}
            >
              {meeting.status === 'scheduled'
                ? `${meeting.formated_date} - ${meeting.time}`
                : 'Unscheduled'}
            </p>

            <div className='flex justify-between'>
              <p className='flex gap-2 text-gray-500'>
                <Clock /> {meeting.duration} Min
              </p>
              <p className='flex gap-2 text-gray-500'>
                <MapPin /> {meeting.location_platform}
              </p>
            </div>

            <hr />

            <div className='flex justify-between'>
              <p
                className='flex gap-2 text-sm text-primary items-center cursor-pointer'
                onClick={() => {
                  onCopyClickHandler(meeting);
                }}
              >
                {' '}
                <Copy className='h-4 w-4' /> Copy public Link
              </p>

              <div className='flex gap-1'>
                {/* {meeting.status === 'scheduled' && (
                  <Calendar
                    className='cursor-pointer p-1 w-7 h-7 rounded-sm hover:bg-blue-500 hover:text-white'
                    id='add_manual_event'
                    onClick={() => {
                      handleAddToGoogleCalendar(meeting);
                    }}
                  />
                )} */}
                <DeleteMeetingModal meeting={meeting} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='mt-10'>
        <p className='font-bold'>
          {meetings.length} out of {total_current_meetings} meetings match the
          selected filters
        </p>
      </div>
    </>
  );
}

export default MeetingList;
