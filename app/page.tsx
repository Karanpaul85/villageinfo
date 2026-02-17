import Link from "next/link";

type State = {
  _id: string;
  state_id: string;
  state: string;
  state_slug: string;
  country: string;
  census_year: number;
  total_districts: number;
  total_tehsils: number;
  total_blocks: number;
  total_villages: number;
  total_population: number;
  male_population: number;
  female_population: number;
  sc_population: number;
  st_population: number;
  total_households: number;
  avg_literacy_rate: number;
  avg_male_literacy: number;
  avg_female_literacy: number;
  nearest_city: string;
  nearest_airport: string;
  major_crops: string;
  main_occupation: string | null;
};

async function getStates(): Promise<State[]> {
  try {
    const res = await fetch(`${process.env.HOST}/api/states`, {
      cache: "no-store", // always fresh data, use "force-cache" if data rarely changes
    });

    if (!res.ok) throw new Error(`Failed to fetch states: ${res.status}`);

    const data = await res.json();
    return data.allStates;
  } catch (error) {
    console.error("getStates error:", error);
    return [];
  }
}

export default async function Home() {
  const states = await getStates();

  return (
    <div className="flex">
      <main className="flex">
        {states.length === 0 ? (
          <p>No states found.</p>
        ) : (
          states.map((state) => (
            <div key={state._id} className="flex">
              <Link href={`/${state.state_slug}`}>{state.state}</Link>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
