export const removeMarkdown = (markdownText: string): string => {
  return markdownText
    .replace(/^#+\s(.+)/gm, "$1") // 헤더 제거
    .replace(/\*\*(.+?)\*\*/g, "$1") // 굵게 텍스트 제거
    .replace(/!\[.*?\]\(.*?\)/g, "") // 이미지 링크 제거
    .replace(/\[.*?\]\(.*?\)/g, "") // 링크 제거
    .replace(/`{1,2}([^`]+)`{1,2}/g, "$1") // 인라인 코드 제거
    .replace(/```[\s\S]*?```/g, "") // 코드 블록 제거
    .replace(/[-*+] /g, "") // 리스트 아이템 제거
    .replace(/>\s?/g, "") // 인용문 제거
    .replace(/^\s*\n/gm, "") // 빈 줄 제거
    .replace(/(\r\n|\n|\r)/gm, " ") // 줄 바꿈을 공백으로 변경
    .replace(/<[^>]+>/g, "") // HTML 태그 제거
    .replace(/\s+/g, " ") // 여분의 공백 제거
    .trim(); // 문자열 양끝 공백 제거
};
