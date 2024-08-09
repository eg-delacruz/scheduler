'use client';

//Schadcn components
import { Input } from '@shadcnComponents/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@shadcnComponents/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@shadcnComponents/tabs';
import { Button } from '@shadcnComponents/button';

//Components
import SpinnerLoader from '@components/SpinnerLoader';
import CustomCheckBox from '@components/CustomCheckBox';

//Context
import { useAppContext } from '@context/index';

//Firestore
import { doc, updateDoc, getFirestore } from 'firebase/firestore';
import { app } from '@config/FirebaseConfig';

//Utils
import ThemeColor from '@utils/ThemeOptions';

//Icons
import { ChevronDown } from 'lucide-react';

type Props = {
  setLoading: (loading: boolean) => void;
  loading: boolean;
  setSearch: (search: string) => void;
  colors: boolean[];
  setColors: ((boolean: boolean) => void)[];
  setScheduled: (scheduled: boolean) => void;
  setExpiration: (expiration: 'All' | 'Upcoming' | 'Expired') => void;
  scheduled: boolean;
  currentent_organization_attached_meetings: number;
};

function MeetingsFilter({
  loading,
  setLoading,
  setSearch,
  colors,
  setColors,
  setScheduled,
  setExpiration,
  scheduled,
  currentent_organization_attached_meetings,
}: Props) {
  //Context
  const { SchedulerUser, setSchedulerUser } = useAppContext();

  const db = getFirestore(app);

  //Filtered organizations for dropdown
  const filteredOrganizations = SchedulerUser?.organizations.filter(
    (organization) => organization.id !== SchedulerUser.current_organization?.id
  );

  const handleCurrentOrganization = async (organization: Organization) => {
    setLoading(true);
    if (SchedulerUser?.email) {
      const docRef = doc(db, 'SchedulerUser', SchedulerUser?.email);
      await updateDoc(docRef, {
        current_organization: organization,
      }).then(() => {
        setSchedulerUser({
          ...SchedulerUser,
          current_organization: organization,
        });
      });
    }
    setLoading(false);
  };

  //Create/delete states for each color
  const ColorSelector = () => (
    <div
      className={`flex justify-between gap-2 p-1 border rounded-sm max-w-48`}
    >
      {ThemeColor.map((color, index) => (
        <CustomCheckBox
          boolean={colors[index]}
          setBoolean={setColors[index]}
          name={`color${index}`}
        >
          <div
            className={`h-7 w-7 rounded-full cursor-pointer 
              ${colors[index] ? 'border-2 border-black' : null}`}
            style={{ backgroundColor: color }}
          ></div>
        </CustomCheckBox>
      ))}
    </div>
  );

  return (
    <div className='flex flex-col gap-2'>
      <h2 className='font-bold text-3xl flex justify-start items-center gap-2'>
        <div>Meetings - </div>
        <div className='flex items-center justify-center w-10 h-10 rounded-full bg-gray-200'>
          {currentent_organization_attached_meetings &&
            currentent_organization_attached_meetings}
        </div>
      </h2>

      <div className='flex justify-between gap-1'>
        <Input
          placeholder='Search'
          className='max-w-xs'
          onChange={(event) => {
            setSearch(event.target.value);
          }}
          disabled={loading}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={loading}>
            <Button variant='outline' className='max-w-40'>
              {loading ? (
                <div className='w-16 flex justify-center'>
                  <SpinnerLoader color='blue' />
                </div>
              ) : (
                <div className='flex justify-between'>
                  <div>{SchedulerUser?.current_organization?.name}</div>
                  <ChevronDown />
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {filteredOrganizations?.map(
              (organization, index): React.ReactNode => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => {
                    organization && handleCurrentOrganization(organization);
                  }}
                >
                  {organization.name}
                </DropdownMenuItem>
              )
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className='flex justify-between flex-col gap-2 sm:flex-row'>
        {<ColorSelector />}

        <Tabs defaultValue='Scheduled'>
          <TabsList>
            <TabsTrigger
              disabled={loading}
              onClick={() => {
                setScheduled(true);
                setExpiration('Upcoming');
              }}
              value='Scheduled'
            >
              Scheduled
            </TabsTrigger>
            <TabsTrigger
              disabled={loading}
              onClick={() => setScheduled(false)}
              value='Unscheduled'
            >
              Unscheduled
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <hr />

      {scheduled && (
        <div className='my-2'>
          <Tabs defaultValue='Upcoming'>
            <TabsList>
              <TabsTrigger
                disabled={loading}
                onClick={() => setExpiration('All')}
                value='All'
              >
                All
              </TabsTrigger>
              <TabsTrigger
                disabled={loading}
                onClick={() => setExpiration('Upcoming')}
                value='Upcoming'
              >
                Upcoming
              </TabsTrigger>
              <TabsTrigger
                disabled={loading}
                onClick={() => setExpiration('Expired')}
                value='Expired'
              >
                Expired
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}
    </div>
  );
}

export default MeetingsFilter;
