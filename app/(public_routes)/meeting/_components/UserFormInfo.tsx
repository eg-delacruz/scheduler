import { Input } from '@shadcnComponents/input';

type Props = {
  setAppointeeName: (userName: string) => void;
  setAppointeeEmail: (userEmail: string) => void;
  setAppointeeNote: (userNote: string) => void;
  invalidEmailError: boolean;
};

function UserFormInfo({
  setAppointeeName,
  setAppointeeEmail,
  setAppointeeNote,
  invalidEmailError,
}: Props) {
  return (
    <div className='p-4 px-8 flex flex-col gap-3'>
      <h2 className='font-bold text-xl'>Enter Details</h2>
      <div>
        <p>Name *</p>
        <Input onChange={(event) => setAppointeeName(event.target.value)} />
      </div>
      <div>
        <p>Email *</p>
        <Input onChange={(event) => setAppointeeEmail(event.target.value)} />
        {invalidEmailError && (
          <p className='text-red-500 mt-2 bg-red-50 p-1 rounded-sm'>
            Please enter a valid email
          </p>
        )}
      </div>
      <div>
        <p>Share any notes</p>
        <Input onChange={(event) => setAppointeeNote(event.target.value)} />
      </div>
      <div>
        <p className='text-xs text-gray-400'>
          By proceeding, you confirm that you read and agree YourScheduler terms
          and conditions
        </p>
      </div>
    </div>
  );
}

export default UserFormInfo;
