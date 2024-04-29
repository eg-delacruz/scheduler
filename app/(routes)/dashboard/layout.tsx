import SideNavBar from './_components/SideNavBar';
import DashboardHeader from './_components/DashboardHeader';

type Props = {
  children: React.ReactNode;
};

function DashboardLayout({ children }: Props) {
  return (
    <div>
      <div className='hidden md:block md:w-64 bg-slate-50 h-screen fixed'>
        <SideNavBar />
      </div>
      <div className='md:ml-64'>
        <DashboardHeader />
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;
