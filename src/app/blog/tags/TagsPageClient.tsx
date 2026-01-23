"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import BlogPostListItem from "@/components/BlogPostListItem";
import MultiSelectTagList from "@/components/MultiSelectTagList";
import { PostDataProps } from "@/types/posts";

interface TagItem {
  key: string;
  value: number;
}

interface TagsPageClientProps {
  postList: PostDataProps[];
  tagList: TagItem[];
}

const normalizeTag = (tag: string): string => {
  return tag.trim().toLowerCase().replace(/\s+/g, "-").replace(/-+/g, "-");
};

const TagsPageClient = ({ postList, tagList }: TagsPageClientProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL에서 선택된 태그 가져오기
  const selectedTagsFromUrl = useMemo(() => {
    const tagsParam = searchParams.get("tags");
    if (!tagsParam) return [];
    return tagsParam.split(",").filter((t) => t.trim());
  }, [searchParams]);

  const [selectedTags, setSelectedTags] =
    useState<string[]>(selectedTagsFromUrl);

  // URL 변경 시 상태 동기화
  useEffect(() => {
    setSelectedTags(selectedTagsFromUrl);
  }, [selectedTagsFromUrl]);

  // OR 방식 필터링: 선택된 태그를 모두 포함하는 게시물만 표시
  const filteredPosts = useMemo(() => {
    if (selectedTags.length === 0) return postList;

    return postList.filter((post) => {
      const postTagsNormalized = post.tags.map(normalizeTag);
      return selectedTags.some((tag) => postTagsNormalized.includes(tag));
    });
  }, [postList, selectedTags]);

  // 태그 선택/해제 핸들러
  const handleTagToggle = (tag: string) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];

    setSelectedTags(newSelectedTags);

    // URL 업데이트
    const params = new URLSearchParams();
    if (newSelectedTags.length > 0) {
      params.set("tags", newSelectedTags.join(","));
    }
    const newUrl =
      newSelectedTags.length > 0
        ? `/blog/tags?${params.toString()}`
        : "/blog/tags";
    router.replace(newUrl, { scroll: false });
  };

  // 전체 선택 해제
  const handleClearAll = () => {
    setSelectedTags([]);
    router.replace("/blog/tags", { scroll: false });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          태그 검색
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {selectedTags.length > 0
            ? `${selectedTags.length}개 태그 선택됨 · ${filteredPosts.length}개의 포스트`
            : `${postList.length}개의 포스트`}
        </p>
      </div>

      {/* 태그 선택 목록 */}
      <MultiSelectTagList
        tagList={tagList}
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
        onClearAll={handleClearAll}
      />

      {/* 게시물 리스트 */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <BlogPostListItem
              key={post.slug}
              title={post.title}
              description={post.description}
              createdAt={post.createdAt}
              slug={post.slug}
              thumbnail={post.thumbnail}
              category={post.category}
              subCategory={post.subCategory}
            />
          ))
        ) : (
          <div className="py-16 text-center text-gray-500 dark:text-gray-400">
            선택한 태그와 일치하는 게시물이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default TagsPageClient;
