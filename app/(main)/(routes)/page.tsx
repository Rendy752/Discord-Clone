import { ThemeToggle } from '@/components/theme-toogle';
import { UserButton } from '@clerk/nextjs';

export default function Home() {
  return (
    <div className="">
      <UserButton afterSignOutUrl="/" />
      <ThemeToggle />
    </div>
  );
}
