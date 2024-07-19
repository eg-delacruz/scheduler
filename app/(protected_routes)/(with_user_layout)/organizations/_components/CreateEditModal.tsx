'use client';

import { useState } from 'react';

//Components
import GenericModal from '@components/GenericModal';
import SpinnerLoader from '@components/SpinnerLoader';

//Shadcn components
import { Input } from '@shadcnComponents/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@shadcnComponents/dropdown-menu';
import { Button } from '@shadcnComponents/button';
import { Checkbox } from '@shadcnComponents/checkbox';
import { toast } from 'sonner';

//Icons
import { Plus } from 'lucide-react';

//Utils
import DaysList from '@utils/DaysList';

//Firestore
import { doc, updateDoc, getFirestore } from 'firebase/firestore';
import { app } from '@config/FirebaseConfig';

//Context
import { useAppContext } from '@context/index';

type Props = {
  action: 'create' | 'edit';
};

function CreateEditModal({ action }: Props) {
  //States
  const [openCreateEditOrgModal, setOpenCreateEditOrgModal] =
    useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [type, setType] = useState<string>('Business');
  const [daysAvailable, setDaysAvailable] = useState<{
    [key: string]: boolean;
  }>({
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: false,
    Sunday: false,
  });
  const [startTime, setStartTime] = useState<string>('08:00');
  const [endTime, setEndTime] = useState<string>('17:00');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');

  //Context
  const { SchedulerUser, setSchedulerUser } = useAppContext();

  const db = getFirestore(app);

  const handleSubmit = async () => {
    setSubmitting(true);
    setFormError('');

    //Errors
    if (!name) {
      setFormError('Organization name is required');
      setSubmitting(false);
      return;
    }

    if (
      SchedulerUser?.organizations.some(
        (organization) => organization.name === name
      )
    ) {
      setFormError('Organization name already exists');
      setSubmitting(false);
      return;
    }

    const organization: Organization = {
      id: Date.now().toString(),
      name,
      type,
      created_by: SchedulerUser?.email || '',
      created_at: new Date(),
      modified_at: new Date(),
      modified_by: SchedulerUser?.email || '',
      days_available: daysAvailable,
      end_time: endTime,
      start_time: startTime,
    };

    if (SchedulerUser?.email) {
      const updatedUser: SchedulerUser = {
        ...SchedulerUser,
        organizations: [...SchedulerUser.organizations, organization],
      };

      if (SchedulerUser.current_organization === null) {
        updatedUser.current_organization = organization;
      }

      const docRef = doc(db, 'SchedulerUser', SchedulerUser?.email);

      await updateDoc(docRef, {
        organizations: updatedUser.organizations,
        current_organization: updatedUser.current_organization,
      }).then(() => {
        setSchedulerUser({
          ...updatedUser,
        });
        console.log('Organization created!');
        toast('Organization created!');
      });
    }

    setSubmitting(false);
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
          <label className='font-bold mb-2 block'>Organization name</label>
          <Input
            onChange={(event) => {
              setName(event.target.value);
            }}
            placeholder='e.g. Your business name or personal name'
          />
        </div>

        <div>
          <label className='font-bold mb-2 block'>Type</label>
          <DropdownMenu>
            <DropdownMenuTrigger className='block' asChild>
              <Button variant='outline' className='max-w-40'>
                {type}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuItem
                className='cursor-pointer hover:bg-slate-200'
                onClick={() => setType('Personal')}
              >
                Personal
              </DropdownMenuItem>
              <DropdownMenuItem
                className='cursor-pointer hover:bg-slate-200'
                onClick={() => setType('Business')}
              >
                Business
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Availability */}
        <h3 className='font-bold'>Availability</h3>
        <div>
          <label className='font-bold mb-2 block'>Available days</label>
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
          <label className='font-bold block'>Available time window</label>
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

        {formError ? (
          <p className='text-red-600 font-bold'>{formError}</p>
        ) : (
          <br />
        )}

        <Button
          type='submit'
          className={`max-w-28 ${submitting && 'opacity-80'}`}
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? <SpinnerLoader /> : 'Save'}
        </Button>
      </div>
    </GenericModal>
  );
}

export default CreateEditModal;
