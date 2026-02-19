import Link from "next/link";
import { getStates } from "@/utils/common";
import Image from "next/image";

export default async function Home() {
  const states = await getStates();
  return (
    <main className="flex w-full md:max-w-275 mx-auto p-4 flex-wrap">
      {states.length === 0 ? (
        <p>No states found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {states.map(
            (state: { _id: string; state_slug: string; state: string }) => (
              <Link
                href={`/${state.state_slug}`}
                key={state._id}
                className="flex items-center border border-gray-300 rounded-lg p-4 hover:bg-gray-100 transition"
              >
                <Image
                  className="mr-2"
                  src="/icons/mapPin.svg"
                  alt={state.state}
                  width={20}
                  height={20}
                />
                {state.state}
              </Link>
            ),
          )}
        </div>
      )}
    </main>
  );
}
