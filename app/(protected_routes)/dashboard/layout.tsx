import UserLayout from '@components/UserLayout';

type Props = {
  children: React.ReactNode;
};

function DashboardLayout({ children }: Props) {
  return <UserLayout>{children}</UserLayout>;
}

export default DashboardLayout;
