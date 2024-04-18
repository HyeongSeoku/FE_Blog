# 1단계: 빌드 환경 설정
FROM node:16-alpine as builder

# 작업 디렉토리를 설정합니다.
WORKDIR /usr/src/backend


# package.json과 npm.lock 파일을 컨테이너에 복사합니다.
COPY package*.json ./
RUN npm install
COPY . .

# NestJS 프로젝트를 빌드합니다.
RUN npm run build

# 2단계: 실행 환경 설정
# 알파인 버전을 다시 사용하여 최종 실행 이미지 크기를 줄입니다.
FROM node:16-alpine

WORKDIR /usr/src/backend

# 빌드 단계에서 생성된 node_modules 와 빌드 파일만 복사합니다.
COPY --from=builder /usr/src/backend/node_modules ./node_modules
COPY --from=builder /usr/src/backend/dist ./dist
COPY --from=builder /usr/src/backend/cert ./cert

# 애플리케이션을 실행하는 포트를 노출합니다.
EXPOSE 3000

# 애플리케이션 실행 커맨드를 지정합니다.
CMD ["node", "dist/main"]