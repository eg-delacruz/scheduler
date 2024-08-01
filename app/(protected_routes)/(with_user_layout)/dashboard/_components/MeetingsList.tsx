//Schadcn components
import { Skeleton } from '@shadcnComponents/skeleton';

//Icons
import { Eye, Clock, Copy, MapPin } from 'lucide-react';

//Components
import DeleteMeetingModal from './DeleteMeetingModal';

type Props = {
  loadingMeetings: boolean;
  loadingChangeCurrentOrg: boolean;
  meetings: Meeting[];
  current_organization_id: string;
};

//TODO: Copy public Link
//TODO: Edit event --> Also allow to change the color of the meeting
//TODO: Add a button that allows to add the meeting to google calendar. It should display a modal and only when the meeting is scheduled

function MeetingList({
  meetings,
  loadingMeetings,
  loadingChangeCurrentOrg,
  current_organization_id,
}: Props) {
  const onCopyClickHandler = (meeting: Meeting) => {
    console.log(meeting);
  };

  const meetings_organization_id = meetings[0]?.organization_id;

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
    <div className='mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7'>
      {meetings.map((meeting) => (
        <div
          style={{ borderTopColor: meeting.theme_color }}
          className='border shadow-md border-t-8 rounded-lg p-5 flex flex-col gap-3'
          key={meeting.id}
        >
          <div className='flex justify-between gap-2'>
            <h4>{meeting.meeting_title}</h4>
            <Eye className='p-1 cursor-pointer w-8 h-8 rounded-sm hover:bg-gray-100' />
          </div>

          <p className='font-bold'>
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

            <DeleteMeetingModal meeting={meeting} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default MeetingList;
