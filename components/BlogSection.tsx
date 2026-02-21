import Link from "next/link";

type BlogItem = {
  url: string;
  title: string;
  short_description: string;
};

export default function BlogSection({ blogData }: { blogData: BlogItem[] }) {
  return (
    <div className="w-full mt-4">
      <h2 className="mb-4 font-medium text-base">Blogs</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {blogData?.map((item, index) => {
          return (
            <Link
              href={item?.url}
              key={index}
              className="flex  flex-col items-center border border-gray-300 rounded-lg p-4 hover:bg-gray-100 transition gap-4"
            >
              <h4 className="text-sm font-medium truncate w-full">
                {item?.title}
              </h4>
              <p className="text-sm line-clamp-2">{item?.short_description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
