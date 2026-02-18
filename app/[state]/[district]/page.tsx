import { getDistricts, getTehsils } from "@/utils/common";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    state: string;
    district: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, district } = await params;
  const districts = await getDistricts({
    state_slug: state,
    district_slug: district,
  });

  return {
    title: `${districts?.district} District, ${districts?.state} – Tehsils, Villages List, Population and Census`,
    description: `${districts?.district} is a district in ${districts?.state}. This page provides district-level statistics including total tehsils, villages, population data and literacy rates.`,
    openGraph: {
      title: `${districts?.district} District, ${districts?.state} – Tehsils, Villages List, Population and Census`,
      description: `${districts?.district} is a district in ${districts?.state}. Explore tehsils, villages, population and census data.`,
    },
  };
}

export default async function DistrictPage({ params }: Props) {
  const { state, district } = await params;

  const districts = await getDistricts({
    state_slug: state,
    district_slug: district,
  });

  // Tehsils API endpoint not available yet
  const tehsilsData = await getTehsils({
    state_slug: state,
    district_slug: district,
  });

  // Show 404 if district not found
  if (!districts || districts?.status === 404) {
    notFound();
  }

  return (
    <main className="flex w-full md:max-w-275 m-auto p-4 flex-wrap">
      <div className="flex w-full text-sm gap-1 mb-4 capitalize">
        <Link href="/" className="text-indigo-600">
          Home
        </Link>{" "}
        ›{" "}
        <Link href={`/${state}`} className="text-indigo-600">
          {state}
        </Link>{" "}
        › {districts?.district}
      </div>
      <div className="flex w-full flex-col border gap-4 border-gray-200 rounded-2xl bg-linear-to-b from-slate-50 to-white p-4.5 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
        <div className="flex w-full flex-wrap gap-4 md:flex-nowrap">
          <div className="flex w-full md:w-2/3 flex-col gap-4">
            <h1 className="text-lg md:text-2xl font-bold">
              {districts?.district} District, {districts?.state} – Tehsils,
              Villages List, Population and Census
            </h1>
            <p className="text-slate-700 text-sm">
              {districts?.district} is a district in {districts?.state}. This
              page provides district-level statistics including total tehsils,
              villages, population data and literacy rates.
            </p>
          </div>
          <div className="flex w-full md:w-1/3 flex-col gap-1 border border-gray-200 rounded-xl bg-linear-to-b from-slate-50 to-white p-4.5 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
            <p className="text-xs text-slate-500">District Snapshot</p>
            <p className="text-sm text-slate-950 font-bold">
              {districts?.district} District
            </p>
            <p className="text-sm text-slate-500">
              State: <strong>{districts?.state}</strong>
            </p>
            <p className="text-sm text-slate-500">
              Total Villages: <strong>{districts?.total_villages}</strong>
            </p>
            <p className="text-sm text-slate-500">
              Total Tehsils: <strong>{districts?.total_tehsils}</strong>
            </p>
          </div>
        </div>
        <div className="flex w-full gap-4 flex-wrap md:flex-nowrap">
          <div className="flex w-full md:w-1/3 gap-1 flex-col border border-gray-200 rounded-xl bg-linear-to-b from-slate-50 to-white p-3 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
            <p className="text-xs text-slate-500">Total Villages</p>
            <p className="text-sm text-slate-950 font-bold">
              {districts?.total_villages}
            </p>
          </div>
          <div className="flex w-full md:w-1/3 gap-1 flex-col border border-gray-200 rounded-xl bg-linear-to-b from-slate-50 to-white p-3 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
            <p className="text-xs text-slate-500">Population</p>
            <p className="text-sm text-slate-950 font-bold">
              {districts?.total_population}
            </p>
          </div>
          <div className="flex w-full md:w-1/3 gap-1 flex-col border border-gray-200 rounded-xl bg-linear-to-b from-slate-50 to-white p-3 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
            <p className="text-xs text-slate-500">Avg Literacy Rate</p>
            <p className="text-sm text-slate-950 font-bold">
              {districts?.avg_literacy_rate}%
            </p>
          </div>
        </div>
      </div>
      {/**overview */}
      <div className="flex w-full mt-8 flex-col">
        <h2 className="text-lg md:text-2xl mb-3 pl-3 border-l-[5px] border-l-blue-600 font-bold">
          Overview of {districts?.state}
        </h2>
        <div className="flex w-full gap-4 flex-wrap md:flex-nowrap">
          <div className="flex w-full md:w-2/3 flex-col gap-4 md:flex-row">
            <div className="flex w-full md:w-1/2 border border-gray-200 rounded-lg p-2 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
              <table className="w-full text-left">
                <tbody>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      District ID
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {districts?.district_id}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      District
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {districts?.district}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      State
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {districts?.state}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Country
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {districts?.country}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Total Tehsils
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {districts?.total_tehsils}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Total Blocks
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {districts?.total_blocks}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Total Villages
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {districts?.total_villages}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex w-full md:w-1/2 border border-gray-200 rounded-lg p-2 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
              <table className="w-full text-left">
                <tbody>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Main Occupation
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {districts?.main_occupation}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Major Crops
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {districts?.major_crops}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Roads Overview
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {districts?.roads}
                    </td>
                  </tr>

                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Nearest City
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {districts?.nearest_city}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Nearest Railway Station
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {districts?.nearest_railway_station}
                    </td>
                  </tr>
                </tbody>
              </table>
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
                    District
                  </td>
                  <td className="p-3 text-sm border-b border-gray-200">
                    {districts?.district}
                  </td>
                </tr>
                <tr>
                  <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                    State
                  </td>
                  <td className="p-3 text-sm border-b border-gray-200">
                    {districts?.state}
                  </td>
                </tr>
                <tr>
                  <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                    Total Tehsils
                  </td>
                  <td className="p-3 text-sm border-b border-gray-200">
                    {districts?.total_tehsils}
                  </td>
                </tr>

                <tr>
                  <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                    Total Villages
                  </td>
                  <td className="p-3 text-sm border-b border-gray-200">
                    {districts?.total_villages}
                  </td>
                </tr>
                <tr>
                  <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                    Population
                  </td>
                  <td className="p-3 text-sm border-b border-gray-200">
                    {districts?.total_population}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/**population */}
      <div className="flex w-full mt-8 flex-col">
        <h2 className="text-lg md:text-2xl mb-3 pl-3 border-l-[5px] border-l-blue-600 font-bold">
          Population of {districts?.district} (Census {districts?.census_year})
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
                      {districts?.total_population}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Male Population
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {districts?.male_population}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Female Population
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {districts?.female_population}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      SC Population
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {districts?.sc_population}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      ST Population
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {districts?.st_population}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Total Households
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {districts?.total_households}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/**overview */}
      <div className="flex w-full mt-8 flex-col">
        <h2 className="text-lg md:text-2xl mb-3 pl-3 border-l-[5px] border-l-blue-600 font-bold">
          Literacy of {districts?.district} District
        </h2>
        <div className="flex w-full gap-4 flex-wrap md:flex-nowrap">
          <div className="flex w-full md:w-2/3 flex-col gap-4 md:flex-row">
            <div className="flex w-full md:w-1/2 border border-gray-200 rounded-lg p-2 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
              <table className="w-full text-left">
                <tbody>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Avg Literacy Rate
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {districts?.avg_literacy_rate}%
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Avg Male Literacy
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {districts?.avg_male_literacy}%
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Avg Female Literacy
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {districts?.avg_female_literacy}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex w-full md:w-1/2 border border-gray-200 rounded-lg p-2 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
              <table className="w-full text-left">
                <tbody>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Nearest Airport
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {districts?.nearest_airport}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Primary Health Center
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {districts?.primary_health_center}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      District Hospital
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {districts?.district_hospital}
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
          Tehsils in {districts?.district} District
        </h2>
        <div className="flex w-full gap-4 flex-wrap md:flex-nowrap">
          <div className="flex w-full md:w-2/3 flex-col gap-4 md:flex-row">
            <div className="flex w-full border border-gray-200 rounded-lg p-2 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
              <table className="w-full text-left">
                <tbody>
                  <tr>
                    <th className="font-medium p-3 text-sm bg-slate-50 w-1/3 border-b border-gray-200">
                      Tehsil Name
                    </th>
                    <th className="font-medium p-3 text-sm bg-slate-50 w-1/3 border-b border-gray-200">
                      Population
                    </th>
                    <th className="font-medium p-3 text-sm bg-slate-50 w-1/3 border-b border-gray-200">
                      Total Villages
                    </th>
                  </tr>
                  {tehsilsData?.map(
                    (tehsil: {
                      _id: string;
                      block_tehsil: string;
                      block_slug: string;
                      total_population: number | string;
                      total_tehsils: number | string;
                    }) => (
                      <tr key={tehsil._id}>
                        <td className="p-3 text-sm border-b border-gray-200">
                          <Link
                            href={`/${districts?.state_slug}/${districts?.district_slug}/${tehsil.block_slug}`}
                            className="text-blue-600"
                          >
                            {tehsil.block_tehsil}
                          </Link>
                        </td>
                        <td className="p-3 text-sm border-b border-gray-200">
                          {tehsil.total_population}
                        </td>
                        <td className="p-3 text-sm border-b border-gray-200">
                          {tehsil.total_tehsils}
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
        <Link href={`/${state}`} className="text-blue-600">
          Districts in {districts?.state}
        </Link>
      </div>
    </main>
  );
}
