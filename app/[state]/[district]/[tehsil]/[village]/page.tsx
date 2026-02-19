import { getVillages } from "@/utils/common";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    state: string;
    district: string;
    tehsil: string;
    village: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, district, tehsil, village } = await params;
  const villagesData = await getVillages({
    state_slug: state,
    district_slug: district,
    block_slug: tehsil,
    village_slug: village,
  });

  return {
    title: `${villagesData?.village_name} Village, ${villagesData?.district}, ${villagesData?.state} – Population, Census, Map & Connectivity`,
    description: `${villagesData?.village_name} is a village in ${villagesData?.block_tehsil} block of ${villagesData?.district} district of ${villagesData?.state}. This page provides village-level statistics including population data, connectivity and map details.`,
    openGraph: {
      title: `${villagesData?.village_name} Village, ${villagesData?.district}, ${villagesData?.state} – Population, Census, Map & Connectivity`,
      description: `${villagesData?.village_name} is a village in ${villagesData?.block_tehsil} block of ${villagesData?.district} district of ${villagesData?.state}. Explore village-level statistics including population data, connectivity and map details.`,
    },
  };
}

export default async function VillagePage({ params }: Props) {
  const { state, district, tehsil, village } = await params;

  const villagesData = await getVillages({
    state_slug: state,
    district_slug: district,
    block_slug: tehsil,
    village_slug: village,
  });

  // Show 404 if district not found
  if (!villagesData || villagesData?.status === 404) {
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
          {district} district
        </Link>{" "}
        ›{" "}
        <Link
          href={`/${state}/${district}/${tehsil}`}
          className="text-indigo-600"
        >
          {tehsil} tehsil
        </Link>{" "}
        › {villagesData?.village_name}
      </div>
      <div className="flex w-full flex-col border gap-4 border-gray-200 rounded-2xl bg-linear-to-b from-slate-50 to-white p-4.5 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
        <div className="flex w-full flex-wrap gap-4 md:flex-nowrap">
          <div className="flex w-full md:w-2/3 flex-col gap-4">
            <h1 className="text-lg md:text-2xl font-bold">
              {villagesData?.village_name} Village, {villagesData?.district},{" "}
              {villagesData?.state} – Population, Census, Map & Connectivity
            </h1>
            <p className="text-slate-700 text-sm">
              {villagesData?.village_name} is a village located in{" "}
              {villagesData?.block_tehsil} block of {villagesData?.district}{" "}
              district in {villagesData?.state}, India.
            </p>
            <div className="flex w-full justify-between gap-4">
              <div className="flex w-full md:w-1/3 px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold">
                PinCode : {villagesData?.pin_code}
              </div>
              <div className="flex w-full md:w-1/3 px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold">
                Internet :{villagesData?.internet}
              </div>
              <div className="flex w-full md:w-1/3 px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold">
                Mobile : {villagesData?.mobile_networks}
              </div>
            </div>
          </div>
          <div className="flex w-full md:w-1/3 flex-col gap-1 border border-gray-200 rounded-xl bg-linear-to-b from-slate-50 to-white p-4.5 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
            <p className="text-xs text-slate-500">Quick Facts</p>
            <p className="text-sm text-slate-950 font-bold">
              {villagesData?.village_name}
            </p>
            <p className="text-sm text-slate-500">
              Block: <strong>{villagesData?.block_tehsil}</strong>
            </p>
            <p className="text-sm text-slate-500">
              District: <strong>{villagesData?.district}</strong>
            </p>
            <p className="text-sm text-slate-500">
              State: <strong>{villagesData?.state}</strong>
            </p>
            <p className="text-sm text-slate-500">
              Gram Panchayat: <strong>{villagesData?.gram_panchayat}</strong>
            </p>
          </div>
        </div>
        <div className="flex w-full gap-4 flex-wrap md:flex-nowrap">
          <div className="flex w-full md:w-1/3 gap-1 flex-col border border-gray-200 rounded-xl bg-linear-to-b from-slate-50 to-white p-3 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
            <p className="text-xs text-slate-500">
              Population (Census {villagesData?.census_year})
            </p>
            <p className="text-sm text-slate-950 font-bold">
              {villagesData?.total_population}
            </p>
          </div>
          <div className="flex w-full md:w-1/3 gap-1 flex-col border border-gray-200 rounded-xl bg-linear-to-b from-slate-50 to-white p-3 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
            <p className="text-xs text-slate-500">Avg Literacy Rate</p>
            <p className="text-sm text-slate-950 font-bold">
              {villagesData?.avg_literacy_rate}%
            </p>
          </div>
          <div className="flex w-full md:w-1/3 gap-1 flex-col border border-gray-200 rounded-xl bg-linear-to-b from-slate-50 to-white p-3 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
            <p className="text-xs text-slate-500">Nearest Town</p>
            <p className="text-sm text-slate-950 font-bold">
              {villagesData?.nearest_town}
            </p>
          </div>
        </div>
      </div>
      {/**overview */}
      <div className="flex w-full mt-8 flex-col">
        <h2 className="text-lg md:text-2xl mb-3 pl-3 border-l-[5px] border-l-blue-600 font-bold">
          Overview of {villagesData?.village_name} Village
        </h2>
        <div className="flex w-full gap-4 flex-wrap md:flex-nowrap">
          <div className="flex w-full flex-col gap-4 md:flex-row">
            <div className="flex w-full md:w-1/2 border border-gray-200 rounded-lg p-2 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
              <table className="w-full text-left">
                <tbody>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Village ID
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {villagesData?.village_id}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Village Name
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {villagesData?.village_name}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Block / Tehsil
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {villagesData?.block_tehsil}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      District
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {villagesData?.district}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      State
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {villagesData?.state}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Country
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {villagesData?.country}
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
                      Road Quality
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {villagesData?.roads}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Water Source
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {villagesData?.drinking_water}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Electricity
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {villagesData?.electricity}
                    </td>
                  </tr>

                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Nearest City
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {villagesData?.nearest_city}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Distance to Town (km)
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {villagesData?.distance_to_town_km}
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
          Location of {villagesData?.village_name} Village & Google Map
        </h2>
        <div className="flex w-full gap-4 flex-wrap md:flex-nowrap">
          <div className="flex w-full flex-col gap-4 md:flex-row">
            <div className="flex w-full md:w-1/2 border border-gray-200 rounded-lg p-2 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
              <table className="w-full text-left">
                <tbody>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Latitude
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {villagesData?.latitude}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Longitude
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {villagesData?.longitude}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Nearest Town
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {villagesData?.nearest_town}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      PIN Code
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {villagesData?.pin_code}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Police Station
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {villagesData?.police_station}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Gram Panchayat
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {villagesData?.gram_panchayat}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex w-full md:w-1/2 border border-gray-200 rounded-lg p-2 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
              <iframe
                loading="lazy"
                width="100%"
                height="100%"
                src={`https://www.google.com/maps?q=${villagesData?.latitude},${villagesData?.longitude}&output=embed`}
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/**overview */}
      <div className="flex w-full mt-8 flex-col">
        <h2 className="text-lg md:text-2xl mb-3 pl-3 border-l-[5px] border-l-blue-600 font-bold">
          How to Reach {villagesData?.village_name} Village
        </h2>
        <div className="flex w-full gap-4 flex-wrap md:flex-nowrap">
          <div className="flex w-full flex-col gap-4 md:flex-row">
            <div className="flex w-full flex-col md:w-1/3 border border-gray-200 rounded-lg p-2 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
              <p className="font-semibold">Road Connectivity</p>
              <p className="text-sm">{villagesData?.road_connectivity}</p>
            </div>
            <div className="flex w-full flex-col md:w-1/3 border border-gray-200 rounded-lg p-2 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
              <p className="font-semibold">Nearest Railway Station</p>
              <p className="text-sm">{villagesData?.nearest_railway_station}</p>
            </div>
            <div className="flex w-full flex-col md:w-1/3 border border-gray-200 rounded-lg p-2 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
              <p className="font-semibold">Nearest Airport</p>
              <p className="text-sm">{villagesData?.nearest_airport}</p>
            </div>
          </div>
        </div>
      </div>
      {/**population */}
      <div className="flex w-full mt-8 flex-col">
        <h2 className="text-lg md:text-2xl mb-3 pl-3 border-l-[5px] border-l-blue-600 font-bold">
          Population of {villagesData?.district} Tehsil (Census{" "}
          {villagesData?.census_year})
        </h2>
        <div className="flex w-full gap-4 flex-wrap md:flex-nowrap">
          <div className="flex w-full flex-col gap-4 md:flex-row">
            <div className="flex w-full border border-gray-200 rounded-lg p-2 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
              <table className="w-full text-left">
                <tbody>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Total Population
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {villagesData?.total_population}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Male Population
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {villagesData?.male_population}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Female Population
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {villagesData?.female_population}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Child Population (0–6)
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {villagesData?.child_population_0_6}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Sex Ratio
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {villagesData?.sex_ratio}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      SC Population
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {villagesData?.sc_population}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      ST Population
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {villagesData?.st_population}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Total Households
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {villagesData?.total_households}
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
          Literacy of {villagesData?.village_name}
        </h2>
        <div className="flex w-full gap-4 flex-wrap md:flex-nowrap">
          <div className="flex w-full flex-col gap-4 md:flex-row">
            <div className="flex w-full md:w-1/2 border border-gray-200 rounded-lg p-2 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
              <table className="w-full text-left">
                <tbody>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Overall Literacy (%)
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {villagesData?.avg_literacy_rate}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Male Literacy (%)
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {villagesData?.male_literacy_rate}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Female Literacy (%){" "}
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {villagesData?.female_literacy_rate}
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
                      Dominant Religion
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {villagesData?.major_religions}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Major Festivals
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {villagesData?.festivals}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Terrain / Geography
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {villagesData?.terrain_geography}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium p-3 text-sm bg-slate-50 w-[48%] border-b border-gray-200">
                      Climate / Weather
                    </td>
                    <td className="p-3 text-sm border-b border-gray-200">
                      {villagesData?.climate_weather}
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
          Facilities & Development in {villagesData?.village_name}
        </h2>
        <div className="flex w-full gap-4 flex-wrap md:flex-nowrap">
          <div className="flex w-full flex-col gap-4 md:flex-row">
            <div className="flex w-full flex-col md:w-1/3 border border-gray-200 rounded-lg p-2 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
              <p>Economy & Occupation</p>
              <ul className="w-full mt-4 text-sm text-slate-700 list-disc list-inside">
                <li>
                  <strong>Main Occupation:</strong>{" "}
                  {villagesData?.main_occupation}
                </li>
                <li>
                  <strong>Major Crops:</strong> {villagesData?.major_crops}
                </li>
              </ul>
            </div>
            <div className="flex w-full flex-col md:w-1/3 border border-gray-200 rounded-lg p-2 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
              <p>Infrastructure</p>
              <ul className="w-full mt-4 text-sm text-slate-700 list-disc list-inside">
                <li>
                  <strong>Sanitation:</strong> {villagesData?.sanitation}
                </li>
                <li>
                  <strong>Roads:</strong> {villagesData?.roads}
                </li>
                <li>
                  <strong>Internet:</strong> {villagesData?.internet}
                </li>
                <li>
                  <strong>Mobile Networks:</strong>{" "}
                  {villagesData?.mobile_networks}
                </li>
              </ul>
            </div>
            <div className="flex w-full flex-col md:w-1/3 border border-gray-200 rounded-lg p-2 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
              <p>Education</p>
              <ul className="w-full mt-4 text-sm text-slate-700 list-disc list-inside">
                <li>
                  <strong>Primary School:</strong>{" "}
                  {villagesData?.primary_school}
                </li>
                <li>
                  <strong>Secondary School:</strong>{" "}
                  {villagesData?.secondary_school}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/** all state link */}
      <div className="flex items-center mt-8 text-sm gap-2 w-full border border-gray-200 rounded-lg p-4 shadow-[0_6px_18px_rgba(15,23,42,0.05)]">
        Explore more:{" "}
        <Link
          href={`/${villagesData?.state_slug}/${villagesData?.district_slug}/${villagesData?.block_slug}/`}
          className="text-blue-600"
        >
          Villages in {villagesData?.block_tehsil} Tehsil
        </Link>{" "}
        <span className="w-1 h-1 bg-black rounded-full"></span>
        <Link
          href={`/${villagesData?.state_slug}/${villagesData?.district_slug}`}
          className="text-blue-600"
        >
          Villages in {villagesData?.district} district
        </Link>
        <span className="w-1 h-1 bg-black rounded-full"></span>
        <Link href={`/${villagesData?.state_slug}`} className="text-blue-600">
          Villages in {villagesData?.state} state
        </Link>
      </div>
    </main>
  );
}
