'use client';
import Image from 'next/image';

//Components
import Loader from '@components/Loader';
import DeleteAccountModal from './_components/DeleteAccountModal';

//Hooks
import useSecureRoute from '@hooks/useSecureRoute';
import useSetSchedulerUser from '@hooks/useSetSchedulerUser';

//Auth
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';

function page() {
  //Securing route
  const { loadingAuth } = useSecureRoute();

  //User
  const { loadingSchedulerUser, SchedulerUser } = useSetSchedulerUser();

  //Kinde user info
  const { user, isLoading } = useKindeBrowserClient();

  if (loadingAuth || loadingSchedulerUser || isLoading) {
    return (
      <div className='flex items-center justify-center container h-[90vh]'>
        <Loader />
      </div>
    );
  }

  if (SchedulerUser)
    return (
      <div className='p-5 pt-6 mt-10 mx-2 grid gap-2 max-w-3xl border rounded-md shadow-sm md:mx-auto'>
        <h2 className='font-bold text-3xl'>Profile</h2>
        <div className='flex justify-start gap-2 mt-8 items-center'>
          <Image
            src={String(user?.picture)}
            alt='User picture'
            width={40}
            height={40}
            className='rounded-full'
          />
          <p className='font-bold text-3xl'>{SchedulerUser?.name}</p>
        </div>
        <p className='font-bold mt-5 mb-1'>Email</p>
        <p className='w-fit min-h-10 rounded-md border flex items-center p-2 cursor-not-allowed'>
          {SchedulerUser?.email}
        </p>

        <div>
          <p className='text-right text-xs font-bold pb-1 text-gray-400'>
            Created at {SchedulerUser?.formated_created_at}
          </p>

          <hr />
        </div>

        <DeleteAccountModal
          scheduler_user_id={SchedulerUser?.id}
          scheduler_user_email={SchedulerUser?.email ?? ''}
        />
      </div>
    );
}

export default page;
