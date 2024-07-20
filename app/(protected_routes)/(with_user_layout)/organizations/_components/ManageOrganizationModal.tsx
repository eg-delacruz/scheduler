//Components
import GenericModal from '@components/GenericModal';
import CreateEditModal from './CreateEditModal';
import WarningExclamation from '@components/WarningExclamation';

import { Plus } from 'lucide-react';

type Props = {
  action: 'create' | 'edit';
  SchedulerUser: SchedulerUser;
};

function ManageOrganizationModal({ action, SchedulerUser }: Props) {
  //Trigger
  const addOrganizationTrigger = (
    <div className='text-primary-foreground bg-primary rounded-sm p-2 hover:bg-primary/90 cursor-pointer'>
      <Plus />
    </div>
  );

  if (SchedulerUser.organizations.length >= 3 && action === 'create') {
    return (
      <GenericModal
        triggerElement={addOrganizationTrigger}
        title='Maximum organizations reached'
        closeBtn={true}
        size='small'
      >
        <WarningExclamation color='red' />
        <p>You can only create up to three organizations</p>

        <p>
          If you want to create a new organization, you must delete one of the
          existing ones.
        </p>
      </GenericModal>
    );
  } else {
    return <CreateEditModal action={action} />;
  }
}

export default ManageOrganizationModal;
