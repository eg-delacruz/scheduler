import NoOrgCreated from './_components/NoOrgCreated';

type MeetingsProps = {
  SchedulerUser: SchedulerUser;
};

function Meetings({ SchedulerUser }: MeetingsProps) {
  if (SchedulerUser.organizations.length == 0) {
    return <NoOrgCreated />;
  }
  return <div>Meetings</div>;
}

export default Meetings;
