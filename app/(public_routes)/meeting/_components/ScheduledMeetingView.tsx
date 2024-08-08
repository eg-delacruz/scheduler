import Image from 'next/image';

//Icons
import { CheckCircle } from 'lucide-react';

type Props = { meeting: Meeting; justScheduled: boolean };

//Components
import MeetingInfo from './MeetingInfo';

function ScheduledMeetingView({ meeting, justScheduled }: Props) {
  return (
    <>
      {justScheduled && (
        <div className='p-3 shadow-md m-5 mx-10 md:mx-26 lg:mx-56 my-10 grid gap-2 justify-items-center border'>
          <div className='flex items-center gap-4'>
            <CheckCircle className='h-9 w-9 text-green-500' />
            <h2 className='font-bold text-xl'>
              Your meeting has been scheduled successfully!
            </h2>
          </div>
          <p className='text-lg text-gray-500'>
            Confirmation sent to your email
          </p>
          <p className='text-sm text-gray-500 mt-0'>
            Don't forget to check your spam folder
          </p>
        </div>
      )}
      <div
        className='p-5 py-9 shadow-lg m-5 border-t-8 mx-10 md:mx-26 lg:mx-56 my-10'
        style={{ borderTopColor: meeting.theme_color }}
      >
        <div
          className={`${
            meeting.status === 'scheduled' &&
            'flex justify-between items-center'
          }`}
        >
          <Image src={'/logo.png'} height={20} width={90} alt='Logo' />

          {meeting.status === 'scheduled' && (
            <div className={`p-1 rounded-sm mr-4 bg-blue-600 h-fit`}>
              <p className='px-3 py-1.5 shadow-sm rounded-sm bg-white text-sm font-bold'>
                Scheduled
              </p>
            </div>
          )}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 mt-5'>
          {/* Left meeting info column */}
          <MeetingInfo
            meeting={meeting}
            selectedTime={meeting.time}
            //In this case, date will never be used, but it's required by the component
            date={meeting.date ? new Date(meeting.date) : undefined}
            formated_date={meeting.formated_date}
          />

          {/* Appointee data */}
          <div className='px-4'>
            <h3 className='font-bold'>Appointee Details</h3>
            <div className='grid gap-2'>
              <div>
                <p className='font-bold'>Name</p>
                <p className='min-w-40 min-h-10 rounded-md border flex items-center p-2 cursor-not-allowed'>
                  {meeting.appointee_name}
                </p>
              </div>

              <div>
                <p className='font-bold'>Email</p>
                <p className='min-w-40 min-h-10 rounded-md border flex items-center p-2 cursor-not-allowed'>
                  {meeting.appointee_email}
                </p>
              </div>

              <div>
                <p className='font-bold'>Note</p>
                <p className='min-w-40 min-h-10 rounded-md border flex items-center p-2 cursor-not-allowed'>
                  {meeting.appointee_note}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ScheduledMeetingView;
