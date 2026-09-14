#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_PATH = path.join(process.cwd(), "src/mdx/content");
const VALID_CATEGORIES = ["DEV", "LIFE", "ETC"];

// 바이트 수 계산 (한글 3바이트, 영어 1바이트)
const getByteLength = (str) => {
  let byteLength = 0;
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    if (charCode <= 0x7f) {
      byteLength += 1;
    } else if (charCode <= 0x7ff) {
      byteLength += 2;
    } else {
      byteLength += 3;
    }
  }
  return byteLength;
};

// 태그 유효성 검증 (한글 기준 10자 = 30바이트)
const MAX_TAG_BYTES = 30;

const validateTag = (tag) => {
  const trimmed = tag.trim();
  const byteLength = getByteLength(trimmed);

  if (byteLength > MAX_TAG_BYTES) {
    return {
      valid: false,
      message: `"${trimmed}" (${byteLength}바이트 > ${MAX_TAG_BYTES}바이트)`,
    };
  }

  return { valid: true };
};

// 날짜 형식 검증 (YYYY.MM.DD)
const validateDateFormat = (dateStr) => {
  if (!dateStr) return false;
  const regex = /^\d{4}\.\d{2}\.\d{2}$/;
  return regex.test(dateStr);
};

// MDX 파일 재귀 탐색
const getMdxFilesRecursively = (dir) => {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...getMdxFilesRecursively(fullPath));
    } else if (item.name.endsWith(".mdx")) {
      files.push(fullPath);
    }
  }

  return files;
};

const validatePosts = () => {
  console.log("\n🔍 게시물 유효성 검증 시작...\n");
  console.log("─".repeat(50));

  const files = getMdxFilesRecursively(CONTENT_PATH);
  const errors = [];
  const warnings = [];

  for (const filePath of files) {
    const relativePath = path.relative(CONTENT_PATH, filePath);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContent);

    const fileErrors = [];
    const fileWarnings = [];

    // 필수 필드 검증
    if (!data.title || typeof data.title !== "string" || !data.title.trim()) {
      fileErrors.push("title이 없거나 비어있습니다 (필수)");
    }

    if (
      !data.category ||
      typeof data.category !== "string" ||
      !data.category.trim()
    ) {
      fileErrors.push("category가 없거나 비어있습니다 (필수)");
    } else if (!VALID_CATEGORIES.includes(data.category.toUpperCase())) {
      fileErrors.push(
        `category "${data.category}"이(가) 유효하지 않습니다. (${VALID_CATEGORIES.join(", ")})`,
      );
    }

    if (!data.createdAt) {
      fileErrors.push("createdAt이 없습니다 (필수)");
    } else if (!validateDateFormat(data.createdAt)) {
      fileErrors.push(
        `createdAt "${data.createdAt}" 형식이 올바르지 않습니다 (YYYY.MM.DD)`,
      );
    }

    // 태그 유효성 검증 (선택사항이지만 있으면 길이 검증)
    if (data.tags) {
      const tags = Array.isArray(data.tags) ? data.tags : [data.tags];
      const invalidTags = [];

      for (const tag of tags) {
        if (typeof tag === "string") {
          const result = validateTag(tag);
          if (!result.valid) {
            invalidTags.push(result.message);
          }
        }
      }

      if (invalidTags.length > 0) {
        fileErrors.push(`태그 길이 초과: ${invalidTags.join(", ")}`);
      }
    }

    // 경고 (선택 사항)
    if (!data.description) {
      fileWarnings.push("description이 없습니다");
    }

    if (!data.thumbnail) {
      fileWarnings.push("thumbnail이 없습니다");
    }

    // 결과 수집
    if (fileErrors.length > 0) {
      errors.push({ file: relativePath, errors: fileErrors });
    }

    if (fileWarnings.length > 0) {
      warnings.push({ file: relativePath, warnings: fileWarnings });
    }
  }

  // 결과 출력
  if (warnings.length > 0) {
    console.log("\n⚠️  경고 (선택 사항):\n");
    for (const { file, warnings: warns } of warnings) {
      console.log(`  📄 ${file}`);
      warns.forEach((w) => {
        console.log(`     └─ ${w}`);
      });
    }
  }

  if (errors.length > 0) {
    console.log("\n❌ 오류 (필수 수정):\n");
    for (const { file, errors: errs } of errors) {
      console.log(`  📄 ${file}`);
      errs.forEach((e) => {
        console.log(`     └─ ${e}`);
      });
    }
    console.log("\n─".repeat(50));
    console.log(
      `\n❌ ${errors.length}개 파일에서 오류가 발견되었습니다. 수정 후 다시 시도하세요.\n`,
    );
    process.exit(1);
  }

  console.log("\n─".repeat(50));
  console.log(
    `\n✅ ${files.length}개 파일 검증 완료! 모든 필수 필드가 유효합니다.\n`,
  );
};

validatePosts();
