'use client';

import { useState } from 'react';

//Components
import GenericModal from '@components/GenericModal';
import WarningExclamation from '@components/WarningExclamation';
import SpinnerLoader from '@components/SpinnerLoader';

//Context
import { useAppContext } from '@context/index';

//Icons
import { Trash } from 'lucide-react';

//Schadcn components
import { Button } from '@shadcnComponents/button';
import { toast } from 'sonner';

//Firestore
import { doc, deleteDoc, getFirestore, updateDoc } from 'firebase/firestore';
import { app } from '@config/FirebaseConfig';

function DeleteMeetingModal({ meeting }: { meeting: Meeting }) {
  //States
  const [open, setOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  //Context
  const {
    CurrentMeetings,
    setCurrentMeetings,
    SchedulerUser,
    setSchedulerUser,
  } = useAppContext();

  const db = getFirestore(app);

  const handleDeleteMeeting = async () => {
    setDeleting(true);
    await deleteDoc(doc(db, 'Meeting', meeting.id)).then(async () => {
      //Update local meetings context
      const updatedMeetings = CurrentMeetings.filter(
        (m) => m.id !== meeting.id
      );

      setCurrentMeetings([...updatedMeetings]);

      //Decrease the attached_meetings of the organization by 1
      const updatedOrganizations = SchedulerUser?.organizations.map(
        (organization) => {
          if (organization.id === SchedulerUser?.current_organization?.id) {
            return {
              ...organization,
              attached_meetings: organization.attached_meetings - 1,
            };
          }

          return organization;
        }
      );

      let currentOrganization = SchedulerUser?.current_organization;

      //Update the current organization
      const updatedCurrentOrganization = updatedOrganizations?.find(
        (organization) =>
          organization.id === SchedulerUser?.current_organization?.id
      );

      if (updatedCurrentOrganization) {
        currentOrganization = updatedCurrentOrganization;
      }

      if (SchedulerUser?.email) {
        const docRef = doc(db, 'SchedulerUser', SchedulerUser?.email);
        await updateDoc(docRef, {
          organizations: updatedOrganizations,
          current_organization: currentOrganization,
        }).then(() => {
          if (updatedOrganizations && currentOrganization) {
            setSchedulerUser({
              ...SchedulerUser,
              organizations: updatedOrganizations,
              current_organization: currentOrganization,
            });
          }
          setDeleting(false);
          toast('Meeting deleted successfully');
          setOpen(false);
        });
      }
    });
  };

  return (
    <GenericModal
      triggerElement={
        <Trash className='cursor-pointer p-1 w-7 h-7 rounded-sm hover:bg-red-400 hover:text-white' />
      }
      title={`Delete "${meeting.meeting_title}"`}
      open={open}
      setOpen={setOpen}
      size='small'
    >
      <WarningExclamation color='red' />

      <p>
        <strong>Delete meeting "{meeting.meeting_title}"?</strong>
        <br />
        This action cannot be undone
      </p>

      <hr />

      <div className='flex justify-between'>
        <Button
          onClick={() => {
            setOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button
          className={`${deleting && 'opacity-80'}`}
          disabled={deleting}
          variant='destructive'
          onClick={handleDeleteMeeting}
        >
          {deleting ? <SpinnerLoader /> : 'Delete'}
        </Button>
      </div>
    </GenericModal>
  );
}

export default DeleteMeetingModal;
