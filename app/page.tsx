import Link from "next/link";
import { getStates } from "@/utils/common";
import LordIcon from "@/components/LordIcon";

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
                className="state-link flex items-center border border-gray-300 rounded-lg p-4 hover:bg-gray-100 transition gap-4"
              >
                <LordIcon
                  src="/icons/mapPin.json"
                  trigger="loop-on-hover"
                  target=".state-link"
                  size={24}
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
