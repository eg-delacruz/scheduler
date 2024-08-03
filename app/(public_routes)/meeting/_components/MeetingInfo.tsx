//Icons library
import { CalendarCheck, Clock, MapPin, Timer } from 'lucide-react';

//Date format library instelled along with shadcn ui
import { format } from 'date-fns/format';

type Props = {
  meeting: Meeting;
  selectedTime: string;
  date: Date | undefined;
};

function MeetingInfo({ meeting, selectedTime, date }: Props) {
  return (
    <div className='p-4 border-r'>
      <h2 className='text-2xl'>{meeting.organization_name}</h2>
      <h2 className='font-bold text-2xl'>
        {meeting.meeting_title ? meeting.meeting_title : 'Meeting Title'}
      </h2>
      <div className='mt-5 flex flex-col gap-4'>
        <p className='flex gap-2'>
          <Clock />
          {meeting.duration} Min
        </p>
        <p className='flex gap-2'>
          <MapPin />
          {meeting.location_platform} Meeting
        </p>
        <p className='flex gap-2'>
          <CalendarCheck /> {date && format(date, 'PPP')}
        </p>
        {selectedTime && (
          <p className='flex gap-2'>
            <Timer /> {selectedTime}
          </p>
        )}
        <a
          target='_blank'
          className='text-primary text-ellipsis block whitespace-nowrap overflow-hidden'
          href={meeting.location_url_phone ?? ''}
        >
          {meeting.location_url_phone}
        </a>
      </div>
    </div>
  );
}

export default MeetingInfo;
