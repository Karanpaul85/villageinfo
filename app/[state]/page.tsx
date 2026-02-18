import { getDistricts, getStates } from "@/utils/common";
import Link from "next/link";
import type { Metadata } from "next";

type Props = {
  params: Promise<{
    state: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state } = await params;
  const stateData = await getStates({ state_slug: state });

  return {
    title: `${stateData?.state} - Districts, Tehsils, Villages, Population and Census`,
    description: `${stateData?.state} is a state in India. This page provides state-level statistics including total districts, tehsils, villages, population data and literacy rates.`,
    openGraph: {
      title: `${stateData?.state} - Districts, Tehsils, Villages, Population and Census`,
      description: `${stateData?.state} is a state in India. Explore districts, tehsils, villages, population and census data.`,
    },
  };
}

export default async function StatePage({ params }: Props) {
  const { state } = await params;
  const stateData = await getStates({ state_slug: state });
  const districts = await getDistricts({ state_slug: state });

  return (
    <main className="flex w-full md:max-w-275 m-auto p-4 flex-wrap">
      <div className="flex w-full text-sm gap-1 mb-4">
        <Link href="/" className="text-indigo-600">
          Home
        </Link>{" "}
        › {stateData?.state}
      </div>
      <div className="flex w-full flex-col border gap-4 border-gray-200 rounded-2xl bg-linear-to-b from-slate-50 to-white p-4.5 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
        <div className="flex w-full flex-wrap gap-4 md:flex-nowrap">
          <div className="flex w-full md:w-2/3 flex-col gap-4">
            <h1 className="text-lg md:text-2xl font-bold">
              {stateData?.state} - Districts, Tehsils, Villages, Population and
              Census
            </h1>
            <p className="text-slate-700 text-sm">
              {stateData?.state} is a state in India. This page provides
              state-level statistics including total districts, tehsils,
              villages, population data and literacy rates.
            </p>
          </div>
          <div className="flex w-full md:w-1/3 flex-col gap-1 border border-gray-200 rounded-xl bg-linear-to-b from-slate-50 to-white p-4.5 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
            <p className="text-xs text-slate-500">State Snapshot</p>
            <p className="text-sm text-slate-950 font-bold">
              {stateData?.state}
            </p>
            <p className="text-sm text-slate-500">
              Country: <strong>{stateData?.country}</strong>
            </p>
            <p className="text-sm text-slate-500">
              Census Year: <strong>{stateData?.census_year}</strong>
            </p>
            <p className="text-sm text-slate-500">
              Districts: <strong>{stateData?.total_districts}</strong>
            </p>
          </div>
        </div>
        <div className="flex w-full gap-4 flex-wrap md:flex-nowrap">
          <div className="flex w-full md:w-1/3 gap-1 flex-col border border-gray-200 rounded-xl bg-linear-to-b from-slate-50 to-white p-3 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
            <p className="text-xs text-slate-500">Total Villages</p>
            <p className="text-sm text-slate-950 font-bold">
              {stateData?.total_villages}
            </p>
          </div>
          <div className="flex w-full md:w-1/3 gap-1 flex-col border border-gray-200 rounded-xl bg-linear-to-b from-slate-50 to-white p-3 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
            <p className="text-xs text-slate-500">Population</p>
            <p className="text-sm text-slate-950 font-bold">
              {stateData?.total_population}
            </p>
          </div>
          <div className="flex w-full md:w-1/3 gap-1 flex-col border border-gray-200 rounded-xl bg-linear-to-b from-slate-50 to-white p-3 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
            <p className="text-xs text-slate-500">Avg Literacy Rate</p>
            <p className="text-sm text-slate-950 font-bold">
              {stateData?.avg_literacy_rate}%
            </p>
          </div>
        </div>
      </div>
      <div className="flex w-full mt-8 flex-col">
        <h2 className="text-lg md:text-2xl mb-3 pl-3 border-l-[5px] border-l-blue-600 font-bold">
          Overview of {stateData?.state}
        </h2>
        <div className="flex w-full gap-4 flex-wrap md:flex-nowrap">
          <div className="flex w-full md:w-2/3 flex-col gap-4 md:flex-row">
            <div className="flex w-full md:w-1/2 border border-gray-200 rounded-lg p-2 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
              <table className="w-full text-left">
                <tbody>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      State ID
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {stateData?.state_id}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      State
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {stateData?.state}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Country
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {stateData?.country}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Total Districts
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {stateData?.total_districts}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Total Tehsils
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {stateData?.total_tehsils}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Total Villages
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {stateData?.total_villages}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex w-full md:w-1/2 border border-gray-200 rounded-lg p-2 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
              hello
            </div>
          </div>
          <div className="flex w-full flex-col md:w-1/3 border border-gray-200 rounded-lg p-2 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
            <h3 className="flex w-full font-bold text-slate-950 mb-4">
              Quick Facts
            </h3>
            <table className="w-full text-left">
              <tbody>
                <tr>
                  <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                    State
                  </td>
                  <td className="p-3 text-sm border-b border-gray-200">
                    {stateData?.state}
                  </td>
                </tr>
                <tr>
                  <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                    Districts
                  </td>
                  <td className="p-3 text-sm border-b border-gray-200">
                    {stateData?.total_districts}
                  </td>
                </tr>
                <tr>
                  <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                    Tehsils
                  </td>
                  <td className="p-3 text-sm border-b border-gray-200">
                    {stateData?.total_tehsils}
                  </td>
                </tr>

                <tr>
                  <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                    Villages
                  </td>
                  <td className="p-3 text-sm border-b border-gray-200">
                    {stateData?.total_villages}
                  </td>
                </tr>
                <tr>
                  <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                    Population
                  </td>
                  <td className="p-3 text-sm border-b border-gray-200">
                    {stateData?.total_population}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="flex w-full mt-8 flex-col">
        <h2 className="text-lg md:text-2xl mb-3 pl-3 border-l-[5px] border-l-blue-600 font-bold">
          Population of {stateData?.state} (Census {stateData?.census_year})
        </h2>
        <div className="flex w-full gap-4 flex-wrap md:flex-nowrap">
          <div className="flex w-full md:w-2/3 flex-col gap-4 md:flex-row">
            <div className="flex w-full border border-gray-200 rounded-lg p-2 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
              <table className="w-full text-left">
                <tbody>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Total Population
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {stateData?.total_population}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Male Population
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {stateData?.male_population}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Female Population
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {stateData?.female_population}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      SC Population
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {stateData?.sc_population}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      ST Population
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {stateData?.st_population}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Total Households
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {stateData?.total_households}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/**total Districts */}
      <div className="flex w-full mt-8 flex-col">
        <h2 className="text-lg md:text-2xl mb-3 pl-3 border-l-[5px] border-l-blue-600 font-bold">
          Districts in {stateData?.state}
        </h2>
        <div className="flex w-full gap-4 flex-wrap md:flex-nowrap">
          <div className="flex w-full md:w-2/3 flex-col gap-4 md:flex-row">
            <div className="flex w-full border border-gray-200 rounded-lg p-2 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
              <table className="w-full text-left">
                <tbody>
                  <tr>
                    <th className="font-medium p-3 text-sm bg-slate-50 w-1/3 border-b border-gray-200">
                      District Name
                    </th>
                    <th className="font-medium p-3 text-sm bg-slate-50 w-1/3 border-b border-gray-200">
                      Population
                    </th>
                    <th className="font-medium p-3 text-sm bg-slate-50 w-1/3 border-b border-gray-200">
                      Total Tehsils
                    </th>
                  </tr>
                  {districts?.map(
                    (district: {
                      _id: string;
                      district: string;
                      district_slug: string;
                      total_population: number | string;
                      total_tehsils: number | string;
                    }) => (
                      <tr key={district._id}>
                        <td className="p-3 text-sm border-b border-gray-200">
                          <Link
                            href={`/${stateData?.state_slug}/${district.district_slug}`}
                            className="text-blue-600"
                          >
                            {district.district}
                          </Link>
                        </td>
                        <td className="p-3 text-sm border-b border-gray-200">
                          {district.total_population}
                        </td>
                        <td className="p-3 text-sm border-b border-gray-200">
                          {district.total_tehsils}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/** all state link */}
      <div className="flex mt-8 text-sm gap-2 w-full md:w-2/3 border border-gray-200 rounded-lg p-4 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
        Explore more:{" "}
        <Link href="/" className="text-blue-600">
          All States of India
        </Link>
      </div>
    </main>
  );
}
