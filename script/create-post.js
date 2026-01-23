#!/usr/bin/env node

import fs from "fs";
import path from "path";
import readline from "readline";

const CONTENT_PATH = path.join(process.cwd(), "src/mdx/content");

const CATEGORIES = ["DEV", "LIFE", "ETC"];
const SUB_CATEGORIES = {
  DEV: ["FE", "BE", "INFRA", "CS"],
  LIFE: [],
  ETC: [],
};

// 기존 폴더 목록 가져오기 (재귀)
const getExistingFolders = (dir, basePath = "") => {
  const folders = [];
  if (!fs.existsSync(dir)) return folders;

  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    if (item.isDirectory()) {
      const relativePath = basePath ? `${basePath}/${item.name}` : item.name;
      folders.push(relativePath);
      folders.push(
        ...getExistingFolders(path.join(dir, item.name), relativePath),
      );
    }
  }
  return folders;
};

// 폴더 목록을 그리드로 출력
const printFoldersGrid = (folders) => {
  if (folders.length === 0) {
    console.log("   (없음)");
    return;
  }

  // 터미널 너비 확인 (기본 80)
  const termWidth = process.stdout.columns || 80;
  const cols = termWidth >= 80 ? 5 : 3;

  // 각 항목의 최대 너비 계산 (번호 + 폴더명)
  const items = folders.map((f, i) => `${i + 1}. ${f}`);
  const maxLen = Math.max(...items.map((item) => item.length)) + 2;
  const colWidth = Math.max(maxLen, 15);

  // 그리드로 출력
  for (let i = 0; i < items.length; i += cols) {
    const row = items.slice(i, i + cols);
    const line = row.map((item) => item.padEnd(colWidth)).join("");
    console.log(`   ${line}`);
  }
};

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
      message: `태그 "${trimmed}"이(가) 너무 깁니다. (${byteLength}바이트 > ${MAX_TAG_BYTES}바이트, 한글 기준 10자)`,
    };
  }

  return { valid: true };
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

const today = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};

const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

const createTemplate = ({
  title,
  description,
  category,
  subCategory,
  tags,
  createdAt,
}) => {
  const tagLines =
    tags.length > 0 ? tags.map((t) => `  - ${t}`).join("\n") : "";

  return `---
title: ${title}
description: ${description}
category: ${category}
createdAt: ${createdAt}${subCategory ? `\nsubCategory: ${subCategory}` : ""}${tagLines ? `\ntags:\n${tagLines}` : ""}
thumbnail: ""
---

## 소개

여기에 게시물 내용을 작성하세요.

## 본문

내용을 작성하세요.

## 마무리

마무리 내용을 작성하세요.
`;
};

const main = async () => {
  console.log("\n📝 새 게시물 생성\n");
  console.log("─".repeat(40));

  // 제목 (필수)
  let title = "";
  while (!title.trim()) {
    title = await question("제목 (필수): ");
    if (!title.trim()) {
      console.log("❌ 제목은 필수입니다.");
    }
  }

  // 설명
  const description = await question("설명: ");

  // 카테고리 (필수)
  console.log(`\n카테고리 선택: ${CATEGORIES.join(", ")}`);
  let category = "";
  while (!CATEGORIES.includes(category.toUpperCase())) {
    category = await question("카테고리 (필수): ");
    category = category.toUpperCase();
    if (!CATEGORIES.includes(category)) {
      console.log(`❌ 올바른 카테고리를 입력하세요: ${CATEGORIES.join(", ")}`);
    }
  }

  // 서브카테고리
  let subCategory = "";
  const subCategories = SUB_CATEGORIES[category];
  if (subCategories.length > 0) {
    console.log(`\n서브카테고리 선택 (선택): ${subCategories.join(", ")}`);
    const subInput = await question("서브카테고리: ");
    if (subCategories.includes(subInput.toUpperCase())) {
      subCategory = subInput.toUpperCase();
    }
  }

  // 태그
  console.log("\n태그 입력 (쉼표로 구분, 한글 기준 10자 이내):");
  const tagsInput = await question("태그: ");
  const tags = tagsInput
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t);

  // 태그 유효성 검증
  const invalidTags = [];
  for (const tag of tags) {
    const result = validateTag(tag);
    if (!result.valid) {
      invalidTags.push(result.message);
    }
  }

  if (invalidTags.length > 0) {
    console.log("\n❌ 태그 유효성 검증 실패:");
    invalidTags.forEach((msg) => console.log(`   ${msg}`));
    rl.close();
    process.exit(1);
  }

  // 디렉토리 선택
  const existingFolders = getExistingFolders(CONTENT_PATH);
  console.log("\n📁 디렉토리 선택 (src/mdx/content/ 기준)");
  console.log("   기존 폴더:");
  printFoldersGrid(existingFolders);
  console.log("");
  console.log("   * 숫자: 기존 폴더 선택 | 직접 입력: 새 경로 | 빈칸: 루트\n");

  const dirInput = await question("디렉토리: ");
  let targetDir = "";

  if (dirInput.trim()) {
    const num = parseInt(dirInput, 10);
    if (!isNaN(num) && num >= 1 && num <= existingFolders.length) {
      targetDir = existingFolders[num - 1];
    } else {
      targetDir = dirInput.trim().replace(/^\/+|\/+$/g, ""); // 앞뒤 슬래시 제거
    }
  }

  // 날짜
  const createdAt = today();

  // 파일명 생성
  const slug = slugify(title) || `post-${Date.now()}`;

  // 폴더 경로 결정
  const folderPath = targetDir
    ? path.join(CONTENT_PATH, targetDir)
    : CONTENT_PATH;

  // 폴더 생성
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`\n📁 폴더 생성: ${folderPath}`);
  }

  const filePath = path.join(folderPath, `${slug}.mdx`);

  // 파일 존재 확인
  if (fs.existsSync(filePath)) {
    const overwrite = await question(
      `\n⚠️  ${filePath} 파일이 이미 존재합니다. 덮어쓰시겠습니까? (y/N): `,
    );
    if (overwrite.toLowerCase() !== "y") {
      console.log("❌ 취소되었습니다.");
      rl.close();
      return;
    }
  }

  // 템플릿 생성 및 저장
  const content = createTemplate({
    title,
    description,
    category,
    subCategory,
    tags,
    createdAt,
  });

  fs.writeFileSync(filePath, content, "utf8");

  console.log("\n─".repeat(40));
  console.log(`✅ 게시물 생성 완료!`);
  console.log(`📄 파일: ${filePath}`);
  console.log("─".repeat(40));

  rl.close();
};

main().catch((error) => {
  console.error("❌ 오류 발생:", error);
  rl.close();
  process.exit(1);
});
