import { PostDataProps } from "@/types/posts";
import MainPostCard, { MainPostCardVariant } from "@/components/MainPostCard";
import classNames from "classnames";

export interface PostSectionProps {
  postList: PostDataProps[];
}

// 벤토 UI 레이아웃에 맞춰 variant 할당 (순수 레이아웃 크기만)
const getCardVariant = (index: number): MainPostCardVariant => {
  // 0: large (8컬럼, 2행)
  // 1: side (4컬럼, 2행)
  // 2-4: standard (4컬럼)
  // 5: wide (12컬럼, 전체 너비)
  // 나머지: standard
  const variantMap: MainPostCardVariant[] = [
    "large",
    "side",
    "standard",
    "standard",
    "standard",
    "wide",
  ];
  return variantMap[index] || "standard";
};

// variant에 따른 그리드 클래스 반환
const getGridClass = (variant: MainPostCardVariant): string => {
  switch (variant) {
    case "large":
      return "min-md:col-span-8 min-md:row-span-2";
    case "side":
      return "min-md:col-span-4 min-md:row-span-2";
    case "wide":
      return "min-md:col-span-12";
    case "standard":
    default:
      return "min-md:col-span-4";
  }
};

const PostSectionTemplate = ({ postList }: PostSectionProps) => {
  if (!postList.length) {
    return (
      <div className="flex items-center w-full justify-center text-gray-500 p-3 min-h-60 md:min-h-30">
        게시물이 없습니다
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 min-md:grid-cols-12 gap-4 min-md:gap-6 auto-rows-auto">
      {postList.map(
        (
          {
            title,
            description,
            createdAt,
            slug,
            tags,
            category,
            subCategory,
            thumbnail,
          },
          index,
        ) => {
          const variant = getCardVariant(index);
          return (
            <li
              key={slug}
              className={classNames("h-full", getGridClass(variant))}
            >
              <MainPostCard
                link={`/posts/${slug}`}
                title={title}
                description={description}
                createdAt={createdAt}
                tags={tags}
                category={category}
                subCategory={subCategory}
                thumbnail={thumbnail}
                variant={variant}
              />
            </li>
          );
        },
      )}
    </ul>
  );
};

export default PostSectionTemplate;
