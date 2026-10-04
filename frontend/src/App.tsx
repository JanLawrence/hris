import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { Toaster } from '@/components/ui/toast';
import FormAlertDialog from '@/components/form/FormAlertDialog';

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
      <FormAlertDialog />
    </>
  )
}