'use client';
import { useState } from 'react';

//Schaedn components
import { Input } from '@shadcnComponents/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@shadcnComponents/dropdown-menu';
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

//TODO: make the search bar work

//TODO: when loading, make all elements disabled

//TODO: check mobile responsiveness
type Props = {
  setLoading: (loading: boolean) => void;
  loading: boolean;
  setSearch: (search: string) => void;
  search: string;
  colors: boolean[];
  setColors: ((boolean: boolean) => void)[];
};
function MeetingsFilter({
  loading,
  setLoading,
  search,
  setSearch,
  colors,
  setColors,
}: Props) {
  //Context
  const { SchedulerUser, setSchedulerUser } = useAppContext();

  //States

  const db = getFirestore(app);

  //Filtered organizations for dropdown
  const filteredOrganizations = SchedulerUser?.organizations.filter(
    (organization) => organization.id !== SchedulerUser.current_organization?.id
  );

  //TODO: refetch the meetings here when current organization changes
  //TODO: set all colors to true when current organization changes
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
    <div className='flex justify-between gap-2 p-1 border rounded-sm'>
      {ThemeColor.map((color, index) => (
        <CustomCheckBox
          boolean={colors[index]}
          setBoolean={setColors[index]}
          name={`color${index}`}
        >
          <div
            className={`h-7 w-7 rounded-full cursor-pointer ${
              colors[index] ? 'border-2 border-black' : null
            }`}
            style={{ backgroundColor: color }}
          ></div>
        </CustomCheckBox>
      ))}
    </div>
  );

  return (
    <div className='flex flex-col gap-2'>
      <h2 className='font-bold text-3xl'>Meetings</h2>

      <div className='flex justify-between'>
        <Input placeholder='Search' className='max-w-xs' />
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={loading}>
            <Button variant='outline' className='max-w-40'>
              {loading ? (
                <div className='w-16 flex justify-center'>
                  <SpinnerLoader color='blue' />
                </div>
              ) : (
                SchedulerUser?.current_organization?.name
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

      <div className='flex justify-between'>
        {<ColorSelector />}

        <div>Scheduler/Unscheduled</div>
      </div>

      <hr />

      <div className='my-2'>All | Upcoming | Expired</div>
    </div>
  );
}

export default MeetingsFilter;
