# ---- 第一阶段：构建 ----
FROM docker.m.daocloud.io/library/node:22-alpine AS builder

# 设置工作目录
WORKDIR /app

# 先复制依赖文件（利用 Docker 缓存层加速构建）
COPY package*.json ./
COPY tsconfig.json ./

# 安装所有依赖（包含 devDependencies，因为需要 tsc 编译）
RUN npm ci

# 复制源代码
COPY src/ ./src/

# 编译 TypeScript → JavaScript
RUN npm run build

# ---- 第二阶段：运行 ----
FROM docker.m.daocloud.io/library/node:22-alpine AS runner

WORKDIR /app

# 只复制生产依赖配置
COPY package*.json ./

# 只安装生产依赖（不安装 typescript、tsx 等开发工具）
RUN npm ci --omit=dev

# 从构建阶段复制编译好的 JS 文件
COPY --from=builder /app/dist ./dist

# 声明容器监听的端口
EXPOSE 3001

# 启动命令
CMD ["node", "dist/index.js"]
