//Firestore
import { app } from "@config/FirebaseConfig";
import { getFirestore, doc, setDoc } from "firebase/firestore";

//Properly type the return value
export default async function createSchedulerUser(
  user: KindeUser
): Promise<SchedulerUser> {
  const db = getFirestore(app);

  const created_user = {
    name: user.given_name + " " + user.family_name,
    email: user.email,
    created_at: new Date(),
    organizations: [],
    current_organization: {
      id: "",
      name: "",
    },
  };

  await setDoc(doc(db, "SchedulerUser", String(user.email)), created_user);

  return created_user;
}
