//Icons library
import { CalendarCheck, Clock, MapPin, Timer } from 'lucide-react';

//Date format library instelled along with shadcn ui
import { format } from 'date-fns/format';

//Schadcn UI components
import { toast } from 'sonner';

type Props = {
  meeting: Meeting;
  selectedTime: string;
  date: Date | undefined;
  formated_date?: string;
};

function MeetingInfo({ meeting, selectedTime, date, formated_date }: Props) {
  return (
    <div className='p-4 md:border-r'>
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
          <CalendarCheck />{' '}
          {/* Formated date will only be availabla if the meeting has been scheduled already */}
          {formated_date ? formated_date : date && format(date, 'PPP')}
        </p>
        {selectedTime && (
          <p className='flex gap-2'>
            <Timer /> {selectedTime}
          </p>
        )}
        <p
          className='text-primary text-ellipsis block whitespace-nowrap overflow-hidden cursor-pointer w-fit'
          onClick={() => {
            navigator.clipboard.writeText(meeting.location_url_phone);
            toast('Link copied to clipboard');
          }}
        >
          {meeting.location_url_phone}
        </p>
      </div>
    </div>
  );
}

export default MeetingInfo;
