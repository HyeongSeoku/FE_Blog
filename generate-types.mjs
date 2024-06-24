import fs from "fs";
import path from "path";
import ts from "typescript";
import { fileURLToPath } from "url";

// 현재 모듈의 디렉토리 경로를 설정합니다.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 엔티티 디렉토리와 타입 정의 파일을 저장할 경로를 설정합니다.
const entitiesDir = path.resolve(
  __dirname,
  "apps/backend/src/database/entities",
);
const outputDir = path.resolve(__dirname, "types/entities");

// 디렉토리 전체를 삭제하는 함수
function deleteDirectory(dir) {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach((file) => {
      const currentPath = path.join(dir, file);
      if (fs.lstatSync(currentPath).isDirectory()) {
        deleteDirectory(currentPath);
      } else {
        fs.unlinkSync(currentPath);
      }
    });
    fs.rmdirSync(dir);
  }
}

// 타입 정의 디렉토리를 삭제하고 다시 생성합니다.
if (fs.existsSync(outputDir)) {
  deleteDirectory(outputDir);
}
fs.mkdirSync(outputDir, { recursive: true });

// 엔티티 파일들을 읽어옵니다.
function getEntityFiles(dir) {
  const files = [];
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      files.push(...getEntityFiles(fullPath));
    } else if (file.endsWith(".ts")) {
      files.push(fullPath);
    }
  });
  return files;
}
const entityFiles = getEntityFiles(entitiesDir);

// TypeScript 파일의 AST를 파싱합니다.
function parseFile(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf8");
  return ts.createSourceFile(
    filePath,
    fileContent,
    ts.ScriptTarget.Latest,
    true,
  );
}

// 기본 타입인지 확인하는 함수
const isBuiltinType = (type) => {
  return [
    "string",
    "number",
    "boolean",
    "Date",
    "any",
    "unknown",
    "void",
    "null",
    "undefined",
  ].includes(type);
};

// 엔티티 파일에서 타입 정보를 추출합니다.
function extractTypesAndImports(sourceFile) {
  const types = [];
  const imports = new Set();

  function visit(node) {
    if (ts.isClassDeclaration(node) && node.name) {
      const className = node.name.text;
      const propsName = `${className}Props`;
      types.push(`export interface ${propsName} {`);

      node.members.forEach((member) => {
        if (ts.isPropertyDeclaration(member) && member.name && member.type) {
          const memberName = member.name.text;
          let memberType = member.type.getText(sourceFile);

          if (!isBuiltinType(memberType)) {
            const match = memberType.match(/^([A-Z][a-zA-Z]*)/);
            if (match) {
              const typeName = match[1];
              const importPath = `./${typeName.toLowerCase()}.entity`;
              const propsTypeName = `${typeName}Props`;
              imports.add(`import { ${propsTypeName} } from "${importPath}";`);
              memberType = memberType.replace(typeName, propsTypeName);
            }
          }

          types.push(`  ${memberName}: ${memberType};`);
        }
      });

      types.push("}");
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return {
    types: types.join("\n"),
    imports: Array.from(imports).join("\n"),
  };
}

// 모든 엔티티 파일에서 타입 정보를 추출하고 각 파일로 출력합니다.
entityFiles.forEach((file) => {
  const sourceFile = parseFile(file);
  const { types, imports } = extractTypesAndImports(sourceFile);

  const relativePath = path.relative(entitiesDir, file);
  const outputFilePath = path.join(
    outputDir,
    relativePath.replace(".ts", ".d.ts"),
  );
  const outputFileDir = path.dirname(outputFilePath);

  if (!fs.existsSync(outputFileDir)) {
    fs.mkdirSync(outputFileDir, { recursive: true });
  }

  const content = `${imports}\n\n${types}`;
  fs.writeFileSync(outputFilePath, content, "utf8");
  console.log(
    `Types for ${file} have been generated and saved to ${outputFilePath}`,
  );
});
