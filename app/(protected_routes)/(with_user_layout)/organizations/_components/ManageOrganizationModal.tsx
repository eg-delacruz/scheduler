//Shadcn components
import GenericModal from '@components/GenericModal';

//Components
import WarningExclamation from '@components/WarningExclamation';

import { Plus } from 'lucide-react';

type Props = {
  type: 'create' | 'edit';
  current_organization_number: number;
};

//TODO: use sonner toast when creating organization
function ManageOrganizationModal({ type, current_organization_number }: Props) {
  console.log(current_organization_number);

  //Triggers
  const addOrganizationTrigger = (
    <div className='text-primary-foreground bg-primary rounded-sm p-2 hover:bg-primary/90 cursor-pointer'>
      <Plus />
    </div>
  );

  if (current_organization_number >= 3) {
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
  }

  return (
    <GenericModal
      triggerElement={addOrganizationTrigger}
      title='Create organization'
      description='Anyone who has this link will be able to view this.'
    >
      <p>Los childreen</p>
    </GenericModal>
  );
}

export default ManageOrganizationModal;
