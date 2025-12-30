import { Outlet } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import Snowflakes from '@/components/Snowflakes';

interface LayoutProps {
  children?: React.ReactNode;
  role?: 'admin' | 'worker';
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white overflow-hidden relative">
      <Snowflakes />

      <AdminSidebar />

      <div className="ml-64 transition-all duration-300">
        <AdminHeader />

        <main className="p-8">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default Layout;
