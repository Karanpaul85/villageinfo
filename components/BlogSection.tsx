import Image from "next/image";
import Link from "next/link";

type BlogItem = {
  url: string;
  imageUrl: string;
  title: string;
  short_description: string;
};

export default function BlogSection({ blogData }: { blogData: BlogItem[] }) {
  return (
    <div className="w-full mt-4">
      <h2 className="mb-4 font-medium text-base">Blogs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {blogData?.map((item, index) => {
          return (
            <Link
              href={item?.url}
              key={index}
              className="flex items-center border border-gray-300 rounded-lg hover:bg-gray-100 transition overflow-hidden"
            >
              {item?.imageUrl && (
                <div className="w-1/3 h-full relative">
                  <Image
                    src={item?.imageUrl}
                    alt="item?.title"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div
                className={`flex ${item?.imageUrl ? "w-2/3" : "w-full"} flex-col p-4 gap-4`}
              >
                <h4 className="text-sm font-medium truncate w-full">
                  {item?.title}
                </h4>
                <p className="text-sm line-clamp-2">
                  {item?.short_description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
