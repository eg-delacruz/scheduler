'use client';

import { useState } from 'react';

//Components
import GenericModal from '@components/GenericModal';

//Shadcn components
import { Input } from '@shadcnComponents/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@shadcnComponents/dropdown-menu';
import { Button } from '@shadcnComponents/button';
import { Checkbox } from '@shadcnComponents/checkbox';

//Icons
import { Plus } from 'lucide-react';

//Utils
import DaysList from '@utils/DaysList';

type Props = {
  action: 'create' | 'edit';
  SchedulerUser: SchedulerUser;
};

function CreateEditModal({ action, SchedulerUser }: Props) {
  //States
  const [openCreateEditOrgModal, setOpenCreateEditOrgModal] =
    useState<boolean>(false);

  const [name, setName] = useState<string>('');
  const [type, setType] = useState<string>('Business');
  const [daysAvailable, setDaysAvailable] = useState<{
    [key: string]: boolean;
  }>({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  });
  const [startTime, setStartTime] = useState<string>('08:00');
  const [endTime, setEndTime] = useState<string>('17:00');

  const handleSubmit = async () => {
    console.log({ name, type, daysAvailable, startTime, endTime });
    setOpenCreateEditOrgModal(false);
  };

  const handleDayCheckboxChange = (day: string, e: unknown) => {
    setDaysAvailable({
      ...daysAvailable,
      [day]: e as boolean,
    });
  };

  //Trigger
  const editTrigger = (
    <div className='text-primary-foreground bg-primary rounded-sm p-2 hover:bg-primary/90 cursor-pointer'>
      <Plus />
    </div>
  );

  return (
    <GenericModal
      triggerElement={editTrigger}
      title={action === 'create' ? 'Create organization' : 'Edit organization'}
      open={openCreateEditOrgModal}
      setOpen={setOpenCreateEditOrgModal}
      size='big'
    >
      <div className='flex flex-col gap-2'>
        {/* General */}

        <h3 className='font-bold'>General</h3>
        <div>
          <label className='text-slate-700 mb-2 block'>Organization name</label>
          <Input
            onChange={(event) => {
              setName(event.target.value);
            }}
            placeholder='e.g. Your business name or personal name'
          />
        </div>

        <div>
          <label className='text-slate-700 mb-2 block'>Type</label>
          <DropdownMenu>
            <DropdownMenuTrigger className='block'>
              <Button variant='outline' className='max-w-40'>
                {type}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setType('Personal')}>
                Personal
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setType('Business')}>
                Company
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Availability */}
        <h3 className='font-bold'>Availability</h3>
        <div>
          <label className='text-slate-700 mb-2 block'>Available days</label>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-5 my-3'>
            {DaysList.map((item, index) => (
              <div key={index}>
                <h2 className='flex gap-1 justify-start items-center'>
                  <Checkbox
                    checked={
                      daysAvailable?.[item.day as keyof typeof daysAvailable]
                    }
                    onCheckedChange={(e) =>
                      handleDayCheckboxChange(item.day, e)
                    }
                    id={item.day}
                  />
                  <label
                    htmlFor={item.day}
                    className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                  >
                    {item.day}
                  </label>
                </h2>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className='text-slate-700 block'>Available time window</label>
          <div className='flex gap-10'>
            <div className='mt-3'>
              <h5>Start time</h5>
              <Input
                defaultValue={startTime}
                type='time'
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className='mt-3'>
              <h5>End time</h5>
              <Input
                defaultValue={endTime}
                type='time'
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Button className='max-w-28' onClick={handleSubmit}>
          Save
        </Button>
      </div>
    </GenericModal>
  );
}

export default CreateEditModal;
