import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const state = 0;
export default function Home() {
  return (
    <div className="">
      <p className="text-3xl font-bold text-indigo-500">
        This is protected route
      </p>
      <Button
        className={cn(
          'bg-slate-950',
          state && 'bg-red-500 hover:bg-red-800',
          'hover:scale-110 transition-all',
        )}
      >
        Click me
      </Button>
    </div>
  );
}
