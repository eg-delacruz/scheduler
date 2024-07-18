'use client';

//Hooks
import useSetSchedulerUser from '@hooks/useSetSchedulerUser';
import useSecureRoute from '@hooks/useSecureRoute';

//Components
import Loader from '@components/Loader';

function Organizations() {
  //Context
  const { loadingSchedulerUser, SchedulerUser } = useSetSchedulerUser();

  //Securing route
  const { loadingAuth } = useSecureRoute();

  if (loadingSchedulerUser || loadingAuth || !SchedulerUser) {
    return (
      <div className='flex items-center justify-center container h-[90vh]'>
        <Loader />
      </div>
    );
  }

  return (
    <div className='p-5'>
      <h2 className='font-bold text-3xl'>Organizations</h2>
      <br />
      <p>You can create up to three organizations</p>
      <br />
      <hr />
      <br />
    </div>
  );
}

export default Organizations;
