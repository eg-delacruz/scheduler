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
import { doc, updateDoc, getFirestore, or } from 'firebase/firestore';
import { app } from '@config/FirebaseConfig';

type Props = {
  organization: Organization;
};

//TODO: delete all related meetings when erasing the organization
function DeleteOrganizationModal({ organization }: Props) {
  //States
  const [open, setOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  //Context
  const { setSchedulerUser, SchedulerUser } = useAppContext();
  const organizations = SchedulerUser?.organizations;

  const db = getFirestore(app);

  const onDeleteOrganization = async () => {
    setDeleting(true);

    if (SchedulerUser?.email) {
      const updatedOrganizations = organizations?.filter(
        (org) => org.id !== organization.id
      );

      if (updatedOrganizations) {
        const updatedUser = {
          ...SchedulerUser,
          organizations: updatedOrganizations,
        };

        //If the organization being deleted is the current organization, set the current organization to the first organization in the list
        if (organization.id === SchedulerUser?.current_organization?.id) {
          if (updatedOrganizations.length > 0) {
            updatedUser.current_organization = updatedOrganizations[0];
          } else {
            updatedUser.current_organization = null;
          }
        }
        const docRef = doc(db, 'SchedulerUser', SchedulerUser?.email);

        await updateDoc(docRef, {
          organizations: updatedOrganizations,
          current_organization: updatedUser.current_organization,
        }).then(() => {
          setSchedulerUser({
            ...updatedUser,
          });
          console.log('Organization deleted');
          toast('Organization deleted');
        });
      }
    }

    setDeleting(false);
    setOpen(false);
  };

  return (
    <GenericModal
      triggerElement={
        <div className='cursor-pointer p-1 rounde-sm rounded-sm hover:bg-red-400 hover:text-white'>
          <Trash />
        </div>
      }
      title={`Delete "${organization.name}"`}
      size='small'
      open={open}
      setOpen={setOpen}
    >
      <WarningExclamation color='red' />

      <p>
        <strong>Delete the organization "{organization.name}"?</strong>
        <br />
        This action cannot be undone and all related meetings will be deleted.
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
          onClick={onDeleteOrganization}
        >
          {deleting ? <SpinnerLoader /> : 'Delete'}
        </Button>
      </div>
    </GenericModal>
  );
}

export default DeleteOrganizationModal;
