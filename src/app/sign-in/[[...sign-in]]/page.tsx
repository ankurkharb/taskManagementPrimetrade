import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
  return (
    <main className="min-h-screen">
      {/* Top Bar */}
      <header className="neo-topbar">
        <Link href="/" className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[28px]">arrow_back</span>
        </Link>
        <h1 className="font-headline font-bold text-lg tracking-tight uppercase">
          Sign In
        </h1>
        <div className="w-8" />
      </header>

      <div className="pt-24 px-4 flex items-center justify-center min-h-[80vh]">
        <div className="animate-nb-bounce-in">
          <SignIn
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none bg-white",
                headerTitle: "font-bold uppercase tracking-tight",
                headerSubtitle: "uppercase text-xs tracking-widest opacity-60",
                formButtonPrimary:
                  "bg-[#f0ff42] text-black border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none uppercase font-bold tracking-widest hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all",
                formFieldInput:
                  "border-[3px] border-black rounded-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:border-[#006876] transition-all",
                footerActionLink: "text-[#006876] font-bold uppercase",
              },
            }}
          />
        </div>
      </div>
    </main>
  );
}
