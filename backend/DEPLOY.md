# Docker 部署指南：从零到云端

> 适合新手的完整部署教程，手把手带你将 idea-render-backend 打包成 Docker 镜像并部署到云端。

---

## 你的项目概况

在开始之前，先了解你的后端是什么：

- **技术栈**：Node.js + TypeScript + Express 5
- **对外接口**：`POST /api/generate`（SSE 流式返回）
- **监听端口**：`3001`
- **外部依赖**：只需要智谱 GLM 的 API（通过环境变量传入）
- **无数据库、无缓存**：架构极简，非常适合容器化！

---

## 第一阶段：准备工作（本地操作）

### 步骤 1：添加生产启动脚本

> **为什么**：你现在的 `package.json` 只有 `dev` 脚本，用的是 `tsx watch`（开发专用）。Docker 容器里要用更轻量的方式启动。

打开 `package.json`，在 `scripts` 里添加 `build` 和 `start` 命令：

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

然后在本地测试是否能编译成功：

```bash
cd backend
npm run build
```

成功后会生成 `dist/` 目录，里面是编译好的 JS 文件。

---

### 步骤 2：创建 `.dockerignore` 文件

> **为什么**：避免把不需要的文件（如 node_modules、.env）打包进镜像，让镜像更小更安全。

在 `backend/` 目录下创建 `.dockerignore` 文件：

```
node_modules
dist
.env
.env.local
*.log
npm-debug.log*
.DS_Store
```

---

### 步骤 3：创建 `Dockerfile`

> **为什么**：Dockerfile 是"配方"，告诉 Docker 怎么把你的代码打包成镜像。

在 `backend/` 目录下创建 `Dockerfile` 文件：

```dockerfile
# ---- 第一阶段：构建 ----
FROM node:22-alpine AS builder

# 设置工作目录
WORKDIR /app

# 先复制依赖文件（利用 Docker 缓存层加速构建）
COPY package*.json ./
COPY tsconfig.json ./

# 安装所有依赖（包括 devDependencies，因为需要 tsc 编译）
RUN npm ci

# 复制源代码
COPY src/ ./src/

# 编译 TypeScript → JavaScript
RUN npm run build

# ---- 第二阶段：运行 ----
FROM node:22-alpine AS runner

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
```

**解释**：这里用了"多阶段构建"，第一阶段编译代码，第二阶段只保留运行所需的内容，镜像体积会小很多（约 150MB vs 800MB+）。

---

### 步骤 4：创建 `.env` 的生产版本

> **重要安全提醒**：永远不要把 `.env` 文件打包进 Docker 镜像！密钥要通过环境变量在运行时传入。

先确认你的 `.env` 文件里有哪些变量（对照 `.env.example`）：

```
PORT=3001
AI_BASE_URL=https://open.bigmodel.cn/api/paas/v4
AI_API_KEY=你的密钥
AI_MODEL=glm-5
```

把这些变量记下来，后面云端部署时会用到。

---

### 步骤 5：本地测试 Docker 镜像

> **前提**：需要先安装 Docker Desktop（https://www.docker.com/products/docker-desktop/）

```bash
# 在 backend/ 目录下，构建镜像（注意最后有个点）
docker build -t idea-render-backend:latest .

# 运行容器（用 -e 传入环境变量）
docker run -p 3001:3001 \
  -e AI_BASE_URL="https://open.bigmodel.cn/api/paas/v4" \
  -e AI_API_KEY="你的密钥" \
  -e AI_MODEL="glm-5" \
  idea-render-backend:latest

# 测试接口是否正常（另开一个终端）
curl -X POST http://localhost:3001/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "创建一个销售仪表盘"}'
```

看到流式输出说明镜像工作正常！

---

## 第二阶段：推送镜像到仓库

> 云服务器需要从某个地方拉取你的镜像。常用的镜像仓库有：
> - **Docker Hub**（最常用，免费）
> - **阿里云容器镜像服务**（国内速度快，免费）

### 方案 A：使用 Docker Hub（推荐新手）

```bash
# 1. 注册 Docker Hub 账号：https://hub.docker.com/

# 2. 本地登录
docker login

# 3. 给镜像打标签（把 your-username 替换成你的 Docker Hub 用户名）
docker tag idea-render-backend:latest your-username/idea-render-backend:latest

# 4. 推送
docker push your-username/idea-render-backend:latest
```

### 方案 B：使用阿里云镜像服务（国内推荐）

```bash
# 1. 开通阿里云容器镜像服务（免费）：
#    https://cr.console.aliyun.com/

# 2. 创建命名空间和镜像仓库后，按阿里云提供的命令操作：
docker login --username=你的阿里云账号 registry.cn-hangzhou.aliyuncs.com

docker tag idea-render-backend:latest \
  registry.cn-hangzhou.aliyuncs.com/你的命名空间/idea-render-backend:latest

docker push registry.cn-hangzhou.aliyuncs.com/你的命名空间/idea-render-backend:latest
```

---

## 第三阶段：云端部署

> 选一个平台即可，推荐新手先用 Railway 或 Render（最简单）。

---

### 选项 1：Railway（最简单，推荐新手）

> 免费额度每月 $5，适合个人项目。

1. 注册：https://railway.app
2. 点击 **"New Project"** → **"Deploy from Docker Image"**
3. 输入你的镜像地址：`your-username/idea-render-backend:latest`
4. 在 **Variables** 标签页添加环境变量：
   ```
   AI_BASE_URL = https://open.bigmodel.cn/api/paas/v4
   AI_API_KEY  = 你的密钥
   AI_MODEL    = glm-5
   PORT        = 3001
   ```
5. 点击部署，等待 2-3 分钟，Railway 会自动分配一个域名给你

---

### 选项 2：Render（免费额度，适合学习）

> 免费套餐有冷启动（30秒），付费后无冷启动。

1. 注册：https://render.com
2. 点击 **"New"** → **"Web Service"**
3. 选择 **"Deploy an existing image from a registry"**
4. 镜像地址：`docker.io/your-username/idea-render-backend:latest`
5. 添加环境变量（同上）
6. 点击 **"Create Web Service"**

---

### 选项 3：腾讯云 / 阿里云容器服务（国内方案）

如果你需要国内访问速度更快，可以用腾讯云 Cloud Run 或阿里云 SAE：

**腾讯云 Cloud Run（推荐）**：
1. 进入腾讯云控制台 → 云原生 → Cloud Run
2. 创建服务，填入镜像地址
3. 配置端口 `3001`，添加环境变量
4. 按量计费，无请求不收费

**阿里云 SAE（Serverless 应用引擎）**：
1. 进入 SAE 控制台
2. 创建应用，选择"镜像"方式
3. 填入阿里云镜像服务的地址（速度最快）

---

### 选项 4：在云服务器（ECS/CVM）上手动部署

> 如果你已经有一台云服务器，可以直接 SSH 进去操作：

```bash
# 登录服务器后

# 1. 安装 Docker（以 Ubuntu 为例）
curl -fsSL https://get.docker.com | sh
sudo systemctl start docker
sudo systemctl enable docker

# 2. 拉取你的镜像
docker pull your-username/idea-render-backend:latest

# 3. 运行容器（-d 表示后台运行，--restart=always 表示服务器重启后自动启动）
docker run -d \
  --name idea-render-backend \
  --restart=always \
  -p 3001:3001 \
  -e AI_BASE_URL="https://open.bigmodel.cn/api/paas/v4" \
  -e AI_API_KEY="你的密钥" \
  -e AI_MODEL="glm-5" \
  your-username/idea-render-backend:latest

# 4. 查看运行状态
docker ps
docker logs idea-render-backend
```

---

## 第四阶段：验证部署成功

```bash
# 把 your-domain.com 替换成你的实际域名或 IP
curl -X POST https://your-domain.com/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "创建一个销售仪表盘"}'

# 看到流式数据返回 = 部署成功！
```

---

## 常见问题排查

| 问题 | 原因 | 解决方法 |
|------|------|----------|
| 容器启动后立刻退出 | 环境变量缺失或编译失败 | `docker logs 容器名` 查看错误 |
| 接口返回 500 | AI_API_KEY 错误 | 检查环境变量是否正确传入 |
| 无法访问接口 | 端口未开放 | 云服务器安全组/防火墙开放 3001 端口 |
| 镜像构建失败 | TypeScript 编译错误 | 先本地 `npm run build` 排查错误 |
| 前端跨域报错 | CORS 配置 | 目前 cors() 已全开，不应有此问题 |

---

## 文件清单：部署完成后你应该有这些文件

```
backend/
├── Dockerfile          ← 新增：Docker 配置
├── .dockerignore       ← 新增：Docker 忽略文件
├── package.json        ← 修改：添加 build 和 start 脚本
├── tsconfig.json       ← 不变
├── .env                ← 不变（本地用，不进镜像）
├── .env.example        ← 不变
└── src/
    ├── index.ts        ← 不变
    └── prompt.ts       ← 不变
```

---

## 推荐部署路径（按难度排序）

```
新手入门  →  Railway 或 Render（最简单，有免费额度）
进阶学习  →  云服务器手动部署（理解最深）
国内项目  →  腾讯云 Cloud Run 或阿里云 SAE（速度快）
```

---

> 如果你按步骤操作遇到任何问题，把报错信息发给我，我来帮你排查！
