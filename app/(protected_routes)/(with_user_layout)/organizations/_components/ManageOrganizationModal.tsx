//Components
import GenericModal from '@components/GenericModal';
import CreateEditModal from './CreateEditModal';
import WarningExclamation from '@components/WarningExclamation';

type Props = {
  action: 'create' | 'edit';
  SchedulerUser: SchedulerUser;
  triggerElement: React.ReactNode;
  organization_id?: string;
};

function ManageOrganizationModal({
  action,
  SchedulerUser,
  triggerElement,
  organization_id,
}: Props) {
  if (SchedulerUser.organizations.length >= 3 && action === 'create') {
    return (
      <GenericModal
        triggerElement={triggerElement}
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
    return (
      <CreateEditModal
        triggerElement={triggerElement}
        action={action}
        organization_id={organization_id}
      />
    );
  }
}

export default ManageOrganizationModal;
