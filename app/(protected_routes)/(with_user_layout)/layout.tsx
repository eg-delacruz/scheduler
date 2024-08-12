import SideNavBar from '@components/SideNavBar/SideNavBar';
import DashboardHeader from '@components/DashboardHeader';
import { Toaster } from 'sonner';

type Props = {
  children: React.ReactNode;
};

function UserLayout({ children }: Props) {
  return (
    <div>
      <SideNavBar />
      <div className='md:ml-64'>
        <DashboardHeader />
        <Toaster />
        {children}
      </div>
    </div>
  );
}

export default UserLayout;
