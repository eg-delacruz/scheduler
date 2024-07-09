//Shadcn UI components
import { Input } from '@shadcnComponents/input';

type Props = {
  setUserName: (userName: string) => void;
  setUserEmail: (userEmail: string) => void;
  setUserNote: (userNote: string) => void;
  invalidEmailError: boolean;
};

function UserFormInfo({
  setUserName,
  setUserEmail,
  setUserNote,
  invalidEmailError,
}: Props) {
  return (
    <div className='p-4 px-8 flex flex-col gap-3'>
      <h2 className='font-bold text-xl'>Enter Details</h2>
      <div>
        <h2>Name *</h2>
        <Input onChange={(event) => setUserName(event.target.value)} />
      </div>
      <div>
        <h2>Email *</h2>
        <Input onChange={(event) => setUserEmail(event.target.value)} />
        {invalidEmailError && (
          <p className='text-red-500 mt-2 bg-red-50 p-1 rounded-sm'>
            Please enter a valid email
          </p>
        )}
      </div>
      <div>
        <h2>Share any notes</h2>
        <Input onChange={(event) => setUserNote(event.target.value)} />
      </div>
      <div>
        <h2 className='text-xs text-gray-400'>
          By proceeding, you confirm that you read and agree YourScheduler terms
          and conditions
        </h2>
      </div>
    </div>
  );
}

export default UserFormInfo;
