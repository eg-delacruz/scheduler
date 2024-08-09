'use client';

import { useState, useMemo } from 'react';

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

//Utils
import ThemeColor from '@utils/ThemeOptions';

import { format } from 'date-fns/format';

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

  const [filteredMeetings, setFilteredMeetings] =
    useState<Meeting[]>(CurrentMeetings);

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
    'All'
  );

  useMemo(() => {
    //used to filter by expiration
    const currentDateAsTimeStamp = format(new Date(), 't');

    const filteredScheduled = CurrentMeetings.filter((meeting: Meeting) => {
      if (scheduled && meeting.status === 'scheduled') return meeting;
      if (!scheduled && meeting.status === 'unscheduled') return meeting;
    });

    //Return all if unscheduled, since there are still no dates
    const filterExpiration = !scheduled
      ? filteredScheduled
      : expiration === 'All'
      ? filteredScheduled
      : filteredScheduled.filter((meeting: Meeting) => {
          if (
            expiration === 'Upcoming' &&
            meeting.formated_timestamp >= currentDateAsTimeStamp
          )
            return meeting;
          if (
            expiration === 'Expired' &&
            meeting.formated_timestamp < currentDateAsTimeStamp
          )
            return meeting;
        });

    const filterColor = filterExpiration.filter((meeting: Meeting) => {
      if (color1 && meeting.theme_color === ThemeColor[0]) return meeting;
      if (color2 && meeting.theme_color === ThemeColor[1]) return meeting;
      if (color3 && meeting.theme_color === ThemeColor[2]) return meeting;
      if (color4 && meeting.theme_color === ThemeColor[3]) return meeting;
      if (color5 && meeting.theme_color === ThemeColor[4]) return meeting;
    });

    const filterTitle = filterColor.filter((meeting: Meeting) => {
      return meeting.meeting_title.toLowerCase().includes(search.toLowerCase());
    });

    setFilteredMeetings(filterTitle);
  }, [
    color1,
    color2,
    color3,
    color4,
    color5,
    scheduled,
    expiration,
    debouncedSearch,
    CurrentMeetings,
  ]);

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
        meetings={filteredMeetings}
        current_organization_id={SchedulerUser.current_organization?.id ?? ''}
        total_current_meetings={
          SchedulerUser.current_organization?.attached_meetings ?? 0
        }
      />
    </div>
  );
}

export default Dashboard;
