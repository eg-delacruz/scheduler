//Context
import { useAppContext } from '@context/index';

//Icons
import { Clock, Settings, Pen, Trash } from 'lucide-react';

//Shadcn components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@shadcnComponents/dropdown-menu';

function OrganizationsTable() {
  const organizations = useAppContext().SchedulerUser?.organizations;

  const onDeleteOrganization = (organizationId: string) => {
    const updatedOrganizations = organizations?.filter(
      (organization) => organization.id !== organizationId
    );
  };

  const AvailableDays = ({
    available_days,
  }: {
    available_days: { [key: string]: boolean };
  }) => {
    const organized_days = {
      Monday: available_days.Monday,
      Tuesday: available_days.Tuesday,
      Wednesday: available_days.Wednesday,
      Thursday: available_days.Thursday,
      Friday: available_days.Friday,
      Saturday: available_days.Saturday,
      Sunday: available_days.Sunday,
    };

    return (
      <div className='flex justify-between gap-1'>
        {Object.keys(organized_days).map((day) => (
          <div
            key={day}
            className={`${
              available_days[day] ? 'font-bold' : 'font-normal text-slate-300'
            }`}
          >
            {day.slice(0, 2)}
            {'  '}
          </div>
        ))}
      </div>
    );
  };

  if (organizations?.length === 0) {
    return (
      <div className='pt-10'>
        <div className='border-2 rounded max-w-xl mx-auto bg-slate-50 text-center p-2'>
          <h3>No organizations created</h3>
          <br />
          <p>
            You must first create an organization before you can start
            scheduling
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='pt-4 max-w-3xl mx-auto flex flex-col gap-4'>
      {organizations?.map((organization) => (
        <div
          className='border shadow-md border-t-8 rounded-lg p-5 flex flex-col gap-3 border-t-blue-500'
          key={organization.id}
        >
          <div className='flex justify-between'>
            <h4 className='font-medium'>{organization.name}</h4>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Settings className='cursor-pointer' />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem className='flex gap-2'>
                  <Pen /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDeleteOrganization(organization.id)}
                  className='flex gap-2'
                >
                  <Trash />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div>
            <span>Type: </span>
            <span className='p-1 bg-slate-200 rounded-sm'>
              {organization.type}
            </span>
          </div>

          <hr />

          <div className='flex justify-between xs:flex-row flex-col xs'>
            <div className='flex gap-2'>
              <Clock className='text-gray-400' />
              {organization.start_time} - {organization.end_time}
            </div>
            {<AvailableDays available_days={organization?.days_available} />}
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrganizationsTable;
