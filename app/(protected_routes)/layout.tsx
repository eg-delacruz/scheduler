import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';

//Component used to protect routes that need authentication server side
async function ProtectedRoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect('/api/auth/login');
  }
  return <div>{children}</div>;
}

export default ProtectedRoutesLayout;
