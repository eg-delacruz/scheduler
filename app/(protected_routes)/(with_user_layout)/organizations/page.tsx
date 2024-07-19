'use client';

//Hooks
import useSetSchedulerUser from '@hooks/useSetSchedulerUser';
import useSecureRoute from '@hooks/useSecureRoute';

//Components
import Loader from '@components/Loader';
import OrganizationsTable from './_components/OrganizationsTable';

//Shadcn components
import ManageOrganizationModal from './_components/ManageOrganizationModal';

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
    <div className='p-5 pt-6'>
      <div className='pb-2 flex flex-col gap-2'>
        <h2 className='font-bold text-3xl'>Organizations</h2>

        <div className='flex justify-between items-center'>
          <p className=''>You can create up to three organizations</p>

          <ManageOrganizationModal
            action='create'
            SchedulerUser={SchedulerUser}
          />
        </div>
      </div>

      <hr />
      <OrganizationsTable />
    </div>
  );
}

export default Organizations;
