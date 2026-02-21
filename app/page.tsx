import Link from "next/link";
import { getContent, getStates } from "@/utils/common";
import LordIcon from "@/components/LordIcon";
import { Metadata } from "next";
import HtmlContent from "@/components/htmlContent";

const DEFAULT_METADATA = {
  title: "Village Info India | Explore States, Districts & Villages",
  description:
    "Explore detailed information about villages, tehsils, districts, and states across India. Census data, population stats, literacy rates, and more.",
};

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent("home");

  const title =
    !content?.error && content?.title ? content.title : DEFAULT_METADATA.title;

  const description =
    !content?.error && content?.description
      ? content.description
      : DEFAULT_METADATA.description;

  return {
    title,
    description,
    keywords: [
      "village info india",
      "india villages",
      "district info",
      "tehsil info",
      "india census data",
      "village population",
      "india states",
    ],
    openGraph: {
      title,
      description,
      url: "https://villageinfo.vercel.app",
      siteName: "Village Info India",
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: "https://villageinfo.vercel.app",
    },
  };
}

export default async function Home() {
  const states = await getStates();
  const content = await getContent("home");
  console.log(content, "hello");
  return (
    <main className="flex w-full md:max-w-275 mx-auto p-4 flex-wrap">
      {states.length === 0 ? (
        <p>No states found.</p>
      ) : (
        <>
          {content.top_content && (
            <HtmlContent type="top" content={content.top_content} />
          )}
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
          {content.bottom_content && (
            <HtmlContent type="bottom" content={content.bottom_content} />
          )}
        </>
      )}
    </main>
  );
}
