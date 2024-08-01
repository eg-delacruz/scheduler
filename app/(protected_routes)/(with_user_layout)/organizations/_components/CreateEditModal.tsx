'use client';

import { useState, useEffect } from 'react';

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

//Utils
import DaysList from '@utils/DaysList';

//Firestore
import { doc, updateDoc, getFirestore } from 'firebase/firestore';
import { app } from '@config/FirebaseConfig';

//Context
import { useAppContext } from '@context/index';

type Props = {
  action: 'create' | 'edit';
  triggerElement: React.ReactNode;
  organization_id?: string;
};

function CreateEditModal({ action, triggerElement, organization_id }: Props) {
  //Context
  const { SchedulerUser, setSchedulerUser } = useAppContext();

  const toEditOrg =
    action === 'edit'
      ? SchedulerUser?.organizations.find((org) => org.id === organization_id)
      : null;

  //States
  const [openCreateEditOrgModal, setOpenCreateEditOrgModal] =
    useState<boolean>(false);
  const [name, setName] = useState<string>(
    toEditOrg && action === 'edit' ? toEditOrg.name : ''
  );
  const [type, setType] = useState<string>(
    toEditOrg ? toEditOrg.type : 'Business'
  );
  const [daysAvailable, setDaysAvailable] = useState<{
    [key: string]: boolean;
  }>(
    toEditOrg
      ? toEditOrg.days_available
      : {
          Monday: true,
          Tuesday: true,
          Wednesday: true,
          Thursday: true,
          Friday: true,
          Saturday: false,
          Sunday: false,
        }
  );
  const [startTime, setStartTime] = useState<string>(
    toEditOrg ? toEditOrg.start_time : '09:00'
  );
  const [endTime, setEndTime] = useState<string>(
    toEditOrg ? toEditOrg.end_time : '17:00'
  );
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');

  //Avoid that if the user changes any attribute but doesn't save, the original values of the organization are set again in all the fields when repoening the modal
  useEffect(() => {
    if (openCreateEditOrgModal && action === 'edit') {
      setName(toEditOrg?.name || '');
      setType(toEditOrg?.type || 'Business');
      setDaysAvailable(
        toEditOrg?.days_available || {
          Monday: true,
          Tuesday: true,
          Wednesday: true,
          Thursday: true,
          Friday: true,
          Saturday: false,
          Sunday: false,
        }
      );
      setStartTime(toEditOrg?.start_time || '09:00');
      setEndTime(toEditOrg?.end_time || '17:00');
    }
  }, [openCreateEditOrgModal]);

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
      ) &&
      action === 'create'
    ) {
      setFormError('Organization name already exists');
      setSubmitting(false);
      return;
    }

    if (action === 'create') {
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
        attached_meetings: 0,
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

          //Cleaning form
          setName('');
          setType('Business');
          setDaysAvailable({
            Monday: true,
            Tuesday: true,
            Wednesday: true,
            Thursday: true,
            Friday: true,
            Saturday: false,
            Sunday: false,
          });
          setStartTime('09:00');
          setEndTime('17:00');

          console.log('Organization created!');
          toast('Organization created!');
        });
      }
    }

    if (action === 'edit' && toEditOrg) {
      const updatedOrganization: Organization = {
        ...toEditOrg,
        name,
        type,
        modified_at: new Date(),
        modified_by: SchedulerUser?.email || '',
        days_available: daysAvailable,
        end_time: endTime,
        start_time: startTime,
      };

      const updatedOrganizations = SchedulerUser?.organizations.map((org) =>
        org.id === organization_id ? updatedOrganization : org
      );

      if (updatedOrganizations && SchedulerUser) {
        const updadetUser: SchedulerUser = {
          ...SchedulerUser,
          organizations: updatedOrganizations,
        };

        //If the organization being edited is the current organization, update the current organization in the user object
        if (organization_id === SchedulerUser?.current_organization?.id) {
          updadetUser.current_organization = updatedOrganization;
        }

        if (SchedulerUser?.email) {
          const docRef = doc(db, 'SchedulerUser', SchedulerUser?.email);

          await updateDoc(docRef, {
            organizations: updatedOrganizations,
            current_organization: updadetUser.current_organization,
          }).then(() => {
            setSchedulerUser({
              ...updadetUser,
            });
            console.log('Organization updated');
            toast('Organization updated');
          });
        }
      }
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

  return (
    <GenericModal
      triggerElement={triggerElement}
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
            defaultValue={name}
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
