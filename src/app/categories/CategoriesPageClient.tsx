"use client";

import classNames from "classnames";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import BlogPostListItem from "@/components/BlogPostListItem";
import type { PostDataProps } from "@/types/posts";
import { formatTagDisplay } from "@/utils/tag";

interface TagItem {
  key: string;
  value: number;
}

interface CategoriesPageClientProps {
  postList: PostDataProps[];
  tagList: TagItem[];
}

const normalizeTag = (tag: string): string =>
  tag.trim().toLowerCase().replace(/\s+/g, "-").replace(/-+/g, "-");

const CategoriesPageClient = ({
  postList,
  tagList,
}: CategoriesPageClientProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedTagsFromUrl = useMemo(() => {
    const tagsParam = searchParams.get("tags");
    if (!tagsParam) return [];
    return tagsParam.split(",").filter((t) => t.trim());
  }, [searchParams]);

  const [selectedTags, setSelectedTags] =
    useState<string[]>(selectedTagsFromUrl);

  useEffect(() => {
    setSelectedTags(selectedTagsFromUrl);
  }, [selectedTagsFromUrl]);

  const filteredPosts = useMemo(() => {
    if (selectedTags.length === 0) return postList;
    return postList.filter((post) => {
      const postTagsNormalized = post.tags.map(normalizeTag);
      return selectedTags.some((tag) => postTagsNormalized.includes(tag));
    });
  }, [postList, selectedTags]);

  const handleTagToggle = (tag: string) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];

    setSelectedTags(newSelectedTags);

    if (newSelectedTags.length === 0) {
      router.replace("/categories", { scroll: false });
      return;
    }

    const params = new URLSearchParams();
    params.set("tags", newSelectedTags.join(","));
    router.replace(`/categories?${params.toString()}`, { scroll: false });
  };

  const handleClearAll = () => {
    setSelectedTags([]);
    router.replace("/categories", { scroll: false });
  };

  return (
    <div className="w-full">
      <header className="mb-sk-section-lg">
        <h1 className="text-sk-h1 font-bold text-theme">카테고리</h1>
        <p className="mt-2 text-sk-meta text-muted">
          {selectedTags.length > 0
            ? `${selectedTags.length}개 선택됨 · ${filteredPosts.length}개의 글`
            : `${postList.length}개의 글`}
        </p>
      </header>

      <div className="mb-sk-section-lg flex flex-wrap items-baseline gap-x-4 gap-y-2">
        {tagList.map(({ key, value }) => {
          const isSelected = selectedTags.includes(key);

          return (
            <button
              key={key}
              type="button"
              onClick={() => handleTagToggle(key)}
              aria-pressed={isSelected}
              className={classNames(
                "text-sk-label transition-opacity hover:opacity-[.55]",
                isSelected ? "text-theme" : "text-muted",
              )}
            >
              #{formatTagDisplay(key)}
              <sup className="ml-0.5 font-normal text-muted">{value}</sup>
            </button>
          );
        })}

        {selectedTags.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-sk-label text-muted underline underline-offset-4 transition-opacity hover:opacity-[.55]"
          >
            전체 해제
          </button>
        )}
      </div>

      <div className="flex flex-col gap-sk-item">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <BlogPostListItem
              key={post.slug}
              title={post.title}
              createdAt={post.createdAt}
              slug={post.slug}
            />
          ))
        ) : (
          <p className="py-16 text-sk-meta text-muted">
            선택한 태그와 일치하는 글이 없습니다.
          </p>
        )}
      </div>
    </div>
  );
};

export default CategoriesPageClient;
