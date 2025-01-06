import { getDate } from "@/utils/date";
import { PostDataProps } from "@/utils/mdxServer";
import Link from "next/link";

type GroupedPosts = {
  [key: string]: PostDataProps[];
};

interface PostListProps {
  groupedPosts: GroupedPosts;
  groupingType: "year" | "month";
}

const GroupPostList = ({ groupedPosts, groupingType }: PostListProps) => {
  const isGroupByMonth = groupingType === "month";
  const suffixText = isGroupByMonth ? "월" : "년";

  const keyFormat = (key: string) => {
    if (isGroupByMonth) {
      return key.padEnd(2, "0");
    } else {
      return key.padStart(4, "20");
    }
  };

  const formattedDate = (date: string) => {
    if (isGroupByMonth) {
      return getDate("DD일", date);
    } else {
      return getDate("MM.DD.", date);
    }
  };

  return (
    <div>
      {Object.keys(groupedPosts).map((key) => {
        return (
          <div
            key={key}
            className="mb-8 py-8 px-4 flex gap-32 border-t last:border-b group"
          >
            <h2 className="text-2xl font-bold flex-shrink-0 h-fit group-hover:bg-gray-300 transition-colors">
              {keyFormat(key)}
              {suffixText}
            </h2>
            <ul className="flex flex-col justify-center gap-2 flex-1 group">
              {groupedPosts[key].map(({ slug, title, createdAt }) => (
                <li
                  key={slug}
                  className="group-hover:text-gray-500 hover:bg-gray-500 hover:!text-white transition-colors"
                >
                  <Link
                    href={`/posts/${slug}`}
                    className="flex justify-between items-center p-2"
                  >
                    <span>{title}</span>
                    <span className="text-gray-500">
                      {formattedDate(createdAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default GroupPostList;
