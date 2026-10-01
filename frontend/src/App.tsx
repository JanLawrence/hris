import { Button } from '@/components/ui/button';

export default function App() {
  return (
    <div className="p-10 space-y-4">
      <h1 className="text-3xl font-bold">HRIS</h1>
      <Button>Save</Button>
      <Button variant="outline">Cancel</Button>
      <Button variant="destructive">Delete</Button>
    </div>
  );
}