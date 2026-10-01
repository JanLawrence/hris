import { Outlet } from 'react-router-dom';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex">
       <Sidebar />
        <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}