import { Outlet } from 'react-router-dom';
import Footer from '@/components/layout/Footer';
import Sidebar from '@/components/layout/Sidebar';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex">
       <Sidebar />
        <div className="flex flex-1 flex-col">
        <main className="flex-1 bg-[#f3f3f0]">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}