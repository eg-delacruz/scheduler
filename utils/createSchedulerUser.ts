//Firestore
import { app } from '@config/FirebaseConfig';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

//Date format library instelled along with shadcn ui
import { format } from 'date-fns/format';

export default async function createSchedulerUser(
  user: KindeUser
): Promise<SchedulerUser> {
  const db = getFirestore(app);

  const created_user: SchedulerUser = {
    name: user.given_name + ' ' + user.family_name,
    id: user.id,
    email: user.email,
    created_at: new Date(),
    formated_created_at: format(new Date(), 'PPP'),
    organizations: [],
    current_organization: null,
  };

  await setDoc(doc(db, 'SchedulerUser', String(user.email)), created_user);

  return created_user;
}
