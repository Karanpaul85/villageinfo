import Link from "next/link";
import { getStates } from "@/utils/common";

export default async function Home() {
  const states = await getStates();
  return (
    <div className="flex">
      <main className="flex">
        {states.length === 0 ? (
          <p>No states found.</p>
        ) : (
          states.map(
            (state: { _id: string; state_slug: string; state: string }) => (
              <div key={state._id} className="flex">
                <Link href={`/${state.state_slug}`}>{state.state}</Link>
              </div>
            ),
          )
        )}
      </main>
    </div>
  );
}
