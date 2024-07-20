//Schadcn UI Components
import { Input } from '@shadcnComponents/input';

//Components
import MeetingEventList from './_components/MeetingEventList';

function MeetingType() {
  return (
    <div className='p-5'>
      <div className='flex flex-col gap-5'>
        <h2 className='font-bold text-3xl'>Meeting Event Type</h2>
        <Input placeholder='Search' className='max-w-xs' />
        <hr />
      </div>

      <MeetingEventList />
    </div>
  );
}

export default MeetingType;
