import { UserButton } from '@clerk/nextjs';

export default function Home() {
  return (
    <div className="">
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
