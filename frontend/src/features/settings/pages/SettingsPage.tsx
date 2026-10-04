import { Outlet } from 'react-router-dom';
import { SaveCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SettingsSidebar from '../components/SettingsSidebar';

export default function SettingsPage() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="h-14 border-b flex items-center justify-between px-6 bg-white">
        <div className="flex items-center gap-2">
          <h1 className="font-semibold text-md">Settings</h1>
        </div>
        {/* <Button variant={'default'} size={'lg'} className={'gap-1'}><SaveCheck /> Save Settings</Button> */}
      </header>
      <div className="flex flex-1">
        <SettingsSidebar />
        <section className="flex-1 p-6">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
