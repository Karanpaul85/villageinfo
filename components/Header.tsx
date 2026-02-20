"use client";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isDashboard = pathname?.includes("/dashboard");

  return (
    <header className="bg-sky-950 text-white p-4 sticky top-0 z-50 shadow-indigo-200 shadow-md">
      <div className="flex w-full md:max-w-275 m-auto flex-wrap items-center justify-between">
        <h1 className="text-2xl font-bold">Village Info</h1>
        {isDashboard && session && (
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded transition"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
