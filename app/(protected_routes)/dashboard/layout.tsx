import SideNavBar from "./_components/SideNavBar";
import DashboardHeader from "./_components/DashboardHeader";
import { Toaster } from "sonner";

type Props = {
  children: React.ReactNode;
};

//TODO: work in the small screen view of the layout
function DashboardLayout({ children }: Props) {
  return (
    <div>
      <div className="hidden md:block md:w-64 bg-slate-50 h-screen fixed">
        <SideNavBar />
      </div>
      <div className="md:ml-64">
        <DashboardHeader />
        <Toaster />
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;
