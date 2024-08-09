'use client';

import { useState } from 'react';

//Components
import GenericModal from '@components/GenericModal';
import WarningExclamation from '@components/WarningExclamation';
import SpinnerLoader from '@components/SpinnerLoader';
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';

//Schadcn components
import { Button } from '@shadcnComponents/button';

//Firestore
import {
  doc,
  getFirestore,
  query,
  where,
  collection,
  getDocs,
  deleteDoc,
} from 'firebase/firestore';
import { app } from '@config/FirebaseConfig';

//Context
import { useAppContext } from '@context/index';

type Props = {
  scheduler_user_id: string | undefined;
  scheduler_user_email: string | undefined;
};

function DeleteAccountModal({
  scheduler_user_id,
  scheduler_user_email,
}: Props) {
  //States
  const [open, setOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  //Context
  const { setSchedulerUser, setCurrentMeetings } = useAppContext();

  const db = getFirestore(app);

  const onDeleteAccount = async () => {
    const logoutLink = document.getElementById('logout-link');
    setDeleting(true);

    if (scheduler_user_id && scheduler_user_email) {
      //Delete related meetings
      const q = query(
        collection(db, 'Meeting'),
        where('scheduler_user_id', '==', scheduler_user_id)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (document) => {
        const meeting: Meeting = document.data() as Meeting;
        await deleteDoc(doc(db, 'Meeting', meeting.id));
      });
      console.log('Meetings deleted');

      await deleteDoc(doc(db, 'SchedulerUser', scheduler_user_email)).then(
        () => {
          console.log('User deleted');
          setSchedulerUser(null);
          setCurrentMeetings([]);
          logoutLink?.click();
        }
      );
    }
  };

  return (
    <GenericModal
      triggerElement={
        <Button className='mt-10 w-fit ml-auto' variant='destructive'>
          Delete Account
        </Button>
      }
      title='Delete Account'
      open={open}
      setOpen={setOpen}
      size='small'
    >
      <WarningExclamation color='red' />
      <p>
        <strong>Delete your account?</strong>
        <br />
        This action cannot be undone and all related organizations and meetings
        will be erased.
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
          onClick={onDeleteAccount}
        >
          {deleting ? <SpinnerLoader /> : 'Delete'}
        </Button>
      </div>
      <LogoutLink className='hidden' id='logout-link'>
        Logout
      </LogoutLink>
    </GenericModal>
  );
}

export default DeleteAccountModal;
