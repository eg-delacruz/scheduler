'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

//Chadcn UI components
import { Input } from '@shadcnComponents/input';
import { Button } from '@shadcnComponents/button';
import { toast } from 'sonner';

//Firestore
import { app } from '@config/FirebaseConfig';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

//Auth
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';

//TODO: erase this route

function CreateBusiness() {
  const [businessName, setBusinessName] = useState<string>('');
  const db = getFirestore(app);
  const { user } = useKindeBrowserClient();
  const router = useRouter();

  const onCreateBusiness = async () => {
    //Set the db, the name of the collection, the document name and in the object, we say what information we want to store in that object
    await setDoc(doc(db, 'Business', String(user?.email)), {
      businessName,
      email: user?.email,
      userName: user?.given_name + ' ' + user?.family_name,
    }).then((): void => {
      console.log('Document saved');
      toast('Business created successfully');
      router.replace('/dashboard');
    });
  };

  return (
    <div className='p-14 items-center flex flex-col gap-20 my-10'>
      <Image src={'/logo.png'} width={200} height={200} alt='Logo' />
      <div className='flex flex-col items-center gap-4 max-w-3xl'>
        <h2 className='text-4xl font-bold'>
          What should we call your business?
        </h2>
        <p className='max-w-md text-slate-900 text-center'>
          Before starting your scheduling, you first need to give your
          organization a name
        </p>
        <h4 className='text-slate-500 text-sm'>
          You can always change this later from settings
        </h4>
        <div className='w-full'>
          <label className='text-slate-400'>Team Name</label>
          <Input
            onChange={(event) => {
              setBusinessName(event.target.value);
            }}
            placeholder='Scheduler team'
            className='mt-2'
          />
          <Button
            onClick={onCreateBusiness}
            disabled={!businessName}
            className='w-full mt-2'
          >
            Create Business
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CreateBusiness;
