import { getTehsils, getVillages } from "@/utils/common";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    state: string;
    district: string;
    tehsil: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, district, tehsil } = await params;
  const tehsilsData = await getTehsils({
    state_slug: state,
    district_slug: district,
    block_slug: tehsil,
  });

  return {
    title: `${tehsilsData?.block_tehsil} Tehsil, ${tehsilsData?.district}, ${tehsilsData?.state} – Villages List, Population and Census`,
    description: `${tehsilsData?.block_tehsil} is a tehsil in ${tehsilsData?.district} district of ${tehsilsData?.state}. This page provides tehsil-level statistics including total villages, population data and literacy rates.`,
    openGraph: {
      title: `${tehsilsData?.block_tehsil} Tehsil, ${tehsilsData?.district}, ${tehsilsData?.state} – Villages List, Population and Census`,
      description: `${tehsilsData?.block_tehsil} is a tehsil in ${tehsilsData?.district} district of ${tehsilsData?.state}. Explore villages, population and census data.`,
    },
  };
}

export default async function TehsilPage({ params }: Props) {
  const { state, district, tehsil } = await params;

  const tehsilsData = await getTehsils({
    state_slug: state,
    district_slug: district,
    block_slug: tehsil,
  });

  const villagesData = await getVillages({
    state_slug: state,
    district_slug: district,
    block_slug: tehsil,
  });

  // Show 404 if district not found
  if (!tehsilsData || tehsilsData?.status === 404) {
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
        ›{" "}
        <Link href={`/${state}/${district}`} className="text-indigo-600">
          {district}
        </Link>{" "}
        › {district}
      </div>
      <div className="flex w-full flex-col border gap-4 border-gray-200 rounded-2xl bg-linear-to-b from-slate-50 to-white p-4.5 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
        <div className="flex w-full flex-wrap gap-4 md:flex-nowrap">
          <div className="flex w-full md:w-2/3 flex-col gap-4">
            <h1 className="text-lg md:text-2xl font-bold">
              {tehsilsData?.block_tehsil} Tehsil, {tehsilsData?.district},{" "}
              {tehsilsData?.state} – Villages List, Population and Census
            </h1>
            <p className="text-slate-700 text-sm">
              {tehsilsData?.block_tehsil} is a tehsil (sub-district) located in{" "}
              {tehsilsData?.district} district of {tehsilsData?.state}, India.
              This page provides tehsil profile, total villages, population
              summary, literacy and connectivity details.
            </p>
          </div>
          <div className="flex w-full md:w-1/3 flex-col gap-1 border border-gray-200 rounded-xl bg-linear-to-b from-slate-50 to-white p-4.5 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
            <p className="text-xs text-slate-500">District Snapshot</p>
            <p className="text-sm text-slate-950 font-bold">
              {tehsilsData?.block_tehsil} Tehsil
            </p>
            <p className="text-sm text-slate-500">
              District: <strong>{tehsilsData?.district}</strong>
            </p>
            <p className="text-sm text-slate-500">
              State: <strong>{tehsilsData?.state}</strong>
            </p>
            <p className="text-sm text-slate-500">
              HQ Town: <strong>{tehsilsData?.headquarter_town}</strong>
            </p>
            <p className="text-sm text-slate-500">
              Census: <strong>{tehsilsData?.census_year}</strong>
            </p>
          </div>
        </div>
        <div className="flex w-full gap-4 flex-wrap md:flex-nowrap">
          <div className="flex w-full md:w-1/3 gap-1 flex-col border border-gray-200 rounded-xl bg-linear-to-b from-slate-50 to-white p-3 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
            <p className="text-xs text-slate-500">Total Villages</p>
            <p className="text-sm text-slate-950 font-bold">
              {tehsilsData?.total_villages}
            </p>
          </div>
          <div className="flex w-full md:w-1/3 gap-1 flex-col border border-gray-200 rounded-xl bg-linear-to-b from-slate-50 to-white p-3 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
            <p className="text-xs text-slate-500">
              Population (Census {tehsilsData?.census_year})
            </p>
            <p className="text-sm text-slate-950 font-bold">
              {tehsilsData?.total_population}
            </p>
          </div>
          <div className="flex w-full md:w-1/3 gap-1 flex-col border border-gray-200 rounded-xl bg-linear-to-b from-slate-50 to-white p-3 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
            <p className="text-xs text-slate-500">Avg Literacy Rate</p>
            <p className="text-sm text-slate-950 font-bold">
              {tehsilsData?.avg_literacy_rate}%
            </p>
          </div>
        </div>
      </div>
      {/**overview */}
      <div className="flex w-full mt-8 flex-col">
        <h2 className="text-lg md:text-2xl mb-3 pl-3 border-l-[5px] border-l-blue-600 font-bold">
          Overview of {tehsilsData?.block_tehsil} Tehsil
        </h2>
        <div className="flex w-full gap-4 flex-wrap md:flex-nowrap">
          <div className="flex w-full md:w-2/3 flex-col gap-4 md:flex-row">
            <div className="flex w-full md:w-1/2 border border-gray-200 rounded-lg p-2 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
              <table className="w-full text-left">
                <tbody>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Tehsil ID
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {tehsilsData?.block_id}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Tehsil Name
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {tehsilsData?.block_tehsil}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      District
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {tehsilsData?.district}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      State
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {tehsilsData?.state}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Country
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {tehsilsData?.country}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Total Villages
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {tehsilsData?.total_villages}
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
                      {tehsilsData?.main_occupation}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Major Crops
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {tehsilsData?.major_crops}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Roads Overview
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {tehsilsData?.roads}
                    </td>
                  </tr>

                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Nearest City
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {tehsilsData?.nearest_city}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Nearest Railway Station
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {tehsilsData?.nearest_railway_station}
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
                    Tehsil
                  </td>
                  <td className="p-3 text-sm border-b border-gray-200">
                    {tehsilsData?.block_tehsil}
                  </td>
                </tr>
                <tr>
                  <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                    District
                  </td>
                  <td className="p-3 text-sm border-b border-gray-200">
                    {tehsilsData?.district}
                  </td>
                </tr>
                <tr>
                  <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                    State
                  </td>
                  <td className="p-3 text-sm border-b border-gray-200">
                    {tehsilsData?.state}
                  </td>
                </tr>
                <tr>
                  <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                    Total Villages
                  </td>
                  <td className="p-3 text-sm border-b border-gray-200">
                    {tehsilsData?.total_villages}
                  </td>
                </tr>

                <tr>
                  <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                    Population
                  </td>
                  <td className="p-3 text-sm border-b border-gray-200">
                    {tehsilsData?.total_population}
                  </td>
                </tr>
                <tr>
                  <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                    Avg Literacy
                  </td>
                  <td className="p-3 text-sm border-b border-gray-200">
                    {tehsilsData?.avg_literacy_rate}
                  </td>
                </tr>
                <tr>
                  <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                    HQ Town
                  </td>
                  <td className="p-3 text-sm border-b border-gray-200">
                    {tehsilsData?.headquarter_town}
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
          Population of {tehsilsData?.district} Tehsil (Census{" "}
          {tehsilsData?.census_year})
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
                      {tehsilsData?.total_population}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Male Population
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {tehsilsData?.male_population}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Female Population
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {tehsilsData?.female_population}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      SC Population
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {tehsilsData?.sc_population}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      ST Population
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {tehsilsData?.st_population}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Total Households
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {tehsilsData?.total_households}
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
          Literacy of {tehsilsData?.district} District
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
                      {tehsilsData?.avg_literacy_rate}%
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Avg Male Literacy
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {tehsilsData?.avg_male_literacy}%
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Avg Female Literacy
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {tehsilsData?.avg_female_literacy}%
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
                      {tehsilsData?.nearest_airport}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Primary Health Center
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {tehsilsData?.primary_health_center}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      District Hospital
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {tehsilsData?.district_hospital}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/**total village */}
      <div className="flex w-full mt-8 flex-col">
        <h2 className="text-lg md:text-2xl mb-3 pl-3 border-l-[5px] border-l-blue-600 font-bold">
          Village List in {tehsilsData?.block_tehsil} Tehsil
        </h2>
        <div className="flex w-full gap-4 flex-wrap md:flex-nowrap">
          <div className="flex w-full md:w-2/3 flex-col gap-4 md:flex-row">
            <div className="flex w-full flex-col border border-gray-200 rounded-lg p-2 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
              <p className="text-slate-700 text-sm mb-4">
                Below is the list of villages in {tehsilsData?.block_tehsil}{" "}
                tehsil with population and nearest town details.
              </p>
              <table className="w-full text-left">
                <tbody>
                  <tr>
                    <th className="font-medium p-3 text-sm bg-slate-50 w-1/3 border-b border-gray-200">
                      Village Name
                    </th>
                    <th className="font-medium p-3 text-sm bg-slate-50 w-1/3 border-b border-gray-200">
                      Population
                    </th>
                    <th className="font-medium p-3 text-sm bg-slate-50 w-1/3 border-b border-gray-200">
                      Nearest Town
                    </th>
                  </tr>
                  {villagesData?.map(
                    (village: {
                      _id: string;
                      village_name: string;
                      village_slug: string;
                      total_population: number | string;
                      nearest_town: string;
                    }) => (
                      <tr key={village._id}>
                        <td className="p-3 text-sm border-b border-gray-200">
                          <Link
                            href={`/${tehsilsData?.state_slug}/${tehsilsData?.district_slug}/${tehsilsData?.block_slug}/${village.village_slug}`}
                            className="text-blue-600"
                          >
                            {village.village_name}
                          </Link>
                        </td>
                        <td className="p-3 text-sm border-b border-gray-200">
                          {village.total_population}
                        </td>
                        <td className="p-3 text-sm border-b border-gray-200">
                          {village.nearest_town}
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
      <div className="flex items-center mt-8 text-sm gap-2 w-full md:w-2/3 border border-gray-200 rounded-lg p-4 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
        Explore more:{" "}
        <Link
          href={`/${tehsilsData?.state_slug}/${tehsilsData?.district_slug}/`}
          className="text-blue-600"
        >
          Tehsil in {tehsilsData?.district} district
        </Link>{" "}
        <span className="w-1 h-1 bg-black rounded-full"></span>
        <Link href={`/${tehsilsData?.state_slug}/`} className="text-blue-600">
          All district in {tehsilsData?.state} state
        </Link>
      </div>
    </main>
  );
}
