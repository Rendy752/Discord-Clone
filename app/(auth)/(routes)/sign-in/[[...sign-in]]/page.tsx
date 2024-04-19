import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return <SignIn 
    appearance={{ 
      elements: {
        formButtonPrimary: "bg-zinc-500 text-white dark:bg-zinc-400 dark:text-black hover:bg-zinc-600 dark:hover:bg-zinc-300 transition"
      }
    }}
  />;
}
