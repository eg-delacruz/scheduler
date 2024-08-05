'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

//Schadcn UI Components
import { Input } from '@shadcnComponents/input';
import { Button } from '@shadcnComponents/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@shadcnComponents/dropdown-menu';

//Utils
import LocationOptions from '@utils/LocationOptions';
import ThemeOptions from '@/utils/ThemeOptions';

//Firestore DB
import { doc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { app } from '@config/FirebaseConfig';

//Auth user data
import { LoginLink } from '@kinde-oss/kinde-auth-nextjs';

import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { start } from 'repl';

function MeetingForm({
  setFormValue,
  SchedulerUser,
  setSchedulerUser,
  selectedOrganization,
  setSelectedOrganization,
}: {
  setFormValue: Function;
  SchedulerUser: SchedulerUser;
  setSchedulerUser: Function;
  selectedOrganization: {
    organization_id: string;
    organization_name: string;
    attached_meetings: number;
  };
  setSelectedOrganization: Function;
}) {
  //Input states
  const [eventName, setEventName] = useState<string>('');

  const [duration, setDuration] = useState<number>(30);
  const [locationType, setLocationType] = useState<string>('');
  const [locationUrl, setLocationUrl] = useState<string>('');
  const [themeColor, setThemeColor] = useState<string>(ThemeOptions[0]);

  const [loginError, setLoginError] = useState<boolean>(false);
  const [validUrl, setValidUrl] = useState<string>('');
  const [validPhone, setValidPhone] = useState<string>('');
  const [creating, setCreating] = useState<boolean>(false);

  const meetings_limit = 20;

  const db = getFirestore(app);

  const filteredOrganizations = SchedulerUser.organizations.filter(
    (organization) => organization.id !== selectedOrganization.organization_id
  );

  useEffect(() => {
    setFormValue({
      eventName,
      organizationName: selectedOrganization.organization_name,
      duration,
      locationType,
      locationUrl,
      themeColor,
    });
  }, [
    eventName,
    selectedOrganization,
    duration,
    locationType,
    locationUrl,
    themeColor,
  ]);

  const router = useRouter();

  const handleSubmit = async () => {
    setLoginError(false);
    setCreating(true);
    setValidUrl('');
    setValidPhone('');

    //Validating the URL
    const urlRegex = new RegExp(
      '^(https?://)(www.)?([a-zA-Z0-9]+).[a-zA-Z0-9]*.[a-z]{3}.?([a-z]+)?$'
    );
    if (!urlRegex.test(String(locationUrl)) && locationType !== 'Phone') {
      setValidUrl('Please enter a valid URL starting with http or https');
      setCreating(false);
      return;
    }

    //Validating the phone number by checking that it only contains numbers
    const phoneRegex = new RegExp('^[0-9]*$');
    if (!phoneRegex.test(String(locationUrl)) && locationType === 'Phone') {
      setValidPhone('Please enter a valid phone number');
      setCreating(false);
      return;
    }

    //Eliminate strange characters and spaces to create a unique id for the meeting
    const simplifiedOrganizationName = selectedOrganization.organization_name
      .replace(/[^a-zA-Z0-9]/g, '')
      .toLowerCase();
    const meeting_id = `${simplifiedOrganizationName}-${Date.now()}`;

    const meeting: Meeting = {
      id: meeting_id,
      organization_id: selectedOrganization.organization_id,
      scheduler_user_id: SchedulerUser?.id ?? '',
      created_by: SchedulerUser?.email ?? '',
      created_at: new Date(),
      modified_at: new Date(),
      modified_by: SchedulerUser?.email ?? '',
      status: 'unscheduled',
      duration,
      meeting_title: eventName,
      location_platform: locationType,
      location_url_phone: locationUrl,
      theme_color: themeColor,
      organization_email: SchedulerUser?.email ?? '',
      organization_name: selectedOrganization.organization_name,
      formated_date: '',
      formated_timestamp: '',
      date: null,
      time: '',
      appointee_email: '',
      appointee_name: '',
      appointee_note: '',
    };

    await setDoc(doc(db, 'Meeting', meeting.id), meeting).then(async () => {
      let currentOrganization: Organization | null =
        SchedulerUser.current_organization;

      //Add one to the attached meetings of the organization
      const updatedOrganizations = SchedulerUser.organizations.map(
        (organization) => {
          if (organization.id === selectedOrganization.organization_id) {
            return {
              ...organization,
              attached_meetings: organization.attached_meetings + 1,
            };
          }
          return organization;
        }
      );

      //Update the current organization in any case (to completely change the current organization if the user is creating a meeting for another organization and to update the attached meetings)
      const updatedCurrentOrganization = updatedOrganizations.find(
        (organization) =>
          organization.id === selectedOrganization.organization_id
      );

      if (updatedCurrentOrganization) {
        currentOrganization = updatedCurrentOrganization;
      }

      if (SchedulerUser?.email) {
        const docRef = doc(db, 'SchedulerUser', SchedulerUser?.email);
        await updateDoc(docRef, {
          organizations: updatedOrganizations,
          current_organization: currentOrganization,
        }).then(() => {
          setSchedulerUser({
            ...SchedulerUser,
            organizations: updatedOrganizations,
            current_organization: currentOrganization,
          });
        });
      }
      setCreating(false);
      toast(`Meeting for ${selectedOrganization.organization_name} created`);
      router.replace('/dashboard');
    });
  };

  return (
    <div className='p-8'>
      <Link href={'/dashboard'}>
        <p className='flex gap-2'>
          <ChevronLeft /> Cancel
        </p>
      </Link>
      <div className='mt-4'>
        <h3 className='font-bold text-2xl my-4'>Create New Event</h3>
        <hr />
      </div>

      <div className='flex flex-col gap-3 my-4'>
        <p className='font-bold'>Meeting Title *</p>
        <Input
          placeholder='Title of your meeting'
          onChange={(event) => setEventName(event.target.value)}
        />

        <p className='font-bold'>Organization *</p>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='max-w-40'>
              <div className='flex justify-between'>
                <div>{selectedOrganization.organization_name}</div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {filteredOrganizations.map(
              (organization): React.ReactNode => (
                <DropdownMenuItem
                  key={organization.id}
                  onClick={() =>
                    setSelectedOrganization({
                      organization_id: organization.id,
                      organization_name: organization.name,
                      attached_meetings: organization.attached_meetings,
                      start_time: organization.start_time,
                      end_time: organization.end_time,
                    })
                  }
                >
                  {organization.name}
                </DropdownMenuItem>
              )
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <p className='font-bold'>Duration *</p>

        <DropdownMenu>
          {/* The asChild prop of the Trigger merges the props of the passed child with the ones of the Trigger compo. */}
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='max-w-40'>
              {duration} Min
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setDuration(15)}>
              15 Min
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDuration(30)}>
              30 Min
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDuration(45)}>
              45 Min
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDuration(60)}>
              60 Min
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <p className='font-bold'>Location *</p>
        <div className='grid grid-cols-4 gap-3'>
          {LocationOptions.map(
            (option, index): React.ReactNode => (
              <div
                className={`border flex flex-col justify-center items-center p-3 rounded-lg hover:bg-blue-100 hover:border-primary cursor-pointer ${
                  locationType === option.name
                    ? 'bg-blue-100 border-primary'
                    : null
                }`}
                onClick={() => setLocationType(option.name)}
                key={index}
              >
                <Image
                  src={option.icon}
                  alt={option.name}
                  width={30}
                  height={30}
                />
                <p>{option.name}</p>
              </div>
            )
          )}
        </div>

        {locationType ? (
          <>
            <p className='font-bold'>
              {locationType === 'Phone' ? (
                <>Add your phone number *</>
              ) : (
                <>Add {locationType} Url *</>
              )}
            </p>
            <Input
              placeholder={
                locationType === 'Phone'
                  ? 'Phone number'
                  : 'URL of your meeting'
              }
              onChange={(event) => setLocationUrl(event.target.value)}
            />
            {validUrl && (
              <p className='text-red-500 mt-2 bg-red-50 p-1 rounded-sm'>
                {validUrl}
              </p>
            )}
            {validPhone && (
              <p className='text-red-500 mt-2 bg-red-50 p-1 rounded-sm'>
                {validPhone}
              </p>
            )}
          </>
        ) : null}

        <p className='font-bold'>Theme Color</p>
        <div className='flex justify-evenly'>
          {ThemeOptions.map((color, index) => (
            <div
              className={`h-8 w-8 rounded-full cursor-pointer ${
                themeColor === color ? 'border-4 border-black' : null
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setThemeColor(color)}
              key={index}
            ></div>
          ))}
        </div>
      </div>
      <Button
        disabled={
          !eventName ||
          !duration ||
          !locationType ||
          !locationUrl ||
          creating ||
          !selectedOrganization.organization_name ||
          selectedOrganization?.attached_meetings >= meetings_limit
        }
        className='w-full mt-9'
        onClick={handleSubmit}
      >
        {creating && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
        Create
      </Button>
      {loginError && (
        <p className='text-red-500 mt-2 bg-red-50 p-1 rounded-sm'>
          Seems like your session expired.{' '}
          <LoginLink className='text-primary underline' href={'/'}>
            Sign in
          </LoginLink>{' '}
          before creating a new event
        </p>
      )}

      {selectedOrganization?.attached_meetings >= meetings_limit && (
        <p className='text-red-500 mt-2 bg-red-50 p-1 rounded-sm'>
          You have reached the maximum number of meetings for the organization "
          {selectedOrganization.organization_name}". Please{' '}
          <Link className='underline text-blue-400' href={'/dashboard'}>
            delete some meetings
          </Link>{' '}
          or create a new organization.
        </p>
      )}
    </div>
  );
}

export default MeetingForm;
