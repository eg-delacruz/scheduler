'use client';

import { useState } from 'react';

//Components
import Loader from '@components/Loader';
import NoOrgCreated from './_components/NoOrgCreated';
import MeetingsFilter from './_components/MeetingsFilter';
import MeetingsList from './_components/MeetingsList';

//Hooks
import useSetSchedulerUser from '@hooks/useSetSchedulerUser';
import useSecureRoute from '@hooks/useSecureRoute';
import useDebouncedSearchValue from '@hooks/useDebouncedSearchValue';
import useGetMeetings from '@hooks/useGetMeetings';

//TODO: If when filters are applied and there are no meetings, display a message saying that there are no meetings matching the current filters
//TODO: give a cool animation to the meeting list when changing the filters
function Dashboard() {
  //User
  const { loadingSchedulerUser, SchedulerUser } = useSetSchedulerUser();

  //Meetings
  const { loadingMeetings, CurrentMeetings } = useGetMeetings({
    organization_email: SchedulerUser?.email ?? '',
    organization_id: SchedulerUser?.current_organization?.id ?? '',
  });

  //Securing route
  const { loadingAuth } = useSecureRoute();

  //States
  const [loadingChangeCurrentOrg, setLoadingChangeCurrentOrg] =
    useState<boolean>(false);

  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebouncedSearchValue(search);

  const [color1, setColor1] = useState<boolean>(true);
  const [color2, setColor2] = useState<boolean>(true);
  const [color3, setColor3] = useState<boolean>(true);
  const [color4, setColor4] = useState<boolean>(true);
  const [color5, setColor5] = useState<boolean>(true);

  const colors = [color1, color2, color3, color4, color5];
  const setColors = [setColor1, setColor2, setColor3, setColor4, setColor5];

  const [scheduled, setScheduled] = useState<boolean>(true);

  const [expiration, setExpiration] = useState<'All' | 'Upcoming' | 'Expired'>(
    'Upcoming'
  );

  if (
    !SchedulerUser ||
    loadingAuth ||
    loadingSchedulerUser ||
    loadingMeetings
  ) {
    return (
      <div className='flex items-center justify-center container h-[90vh]'>
        <Loader />
      </div>
    );
  }

  if (SchedulerUser.organizations.length == 0) {
    return <NoOrgCreated />;
  }

  return (
    <div className='p-5 pt-6'>
      <MeetingsFilter
        setLoading={setLoadingChangeCurrentOrg}
        loading={loadingChangeCurrentOrg}
        setSearch={setSearch}
        colors={colors}
        setColors={setColors}
        setScheduled={setScheduled}
        setExpiration={setExpiration}
        scheduled={scheduled}
        currentent_organization_attached_meetings={
          SchedulerUser.current_organization?.attached_meetings ?? 0
        }
      />

      <MeetingsList
        loadingMeetings={loadingMeetings}
        loadingChangeCurrentOrg={loadingChangeCurrentOrg}
        meetings={CurrentMeetings}
        current_organization_id={SchedulerUser.current_organization?.id ?? ''}
      />
    </div>
  );
}

export default Dashboard;
