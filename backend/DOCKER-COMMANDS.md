# Docker 命令速查手册

> idea-render-backend 项目常用 Docker 命令汇总

---

## 一、构建镜像

### 标准构建（仅限本机架构，本地测试用）
```bash
docker build -t idea-render-backend:latest .
```

### 跨平台构建（Mac M系列 → Linux 服务器，生产用）

第一次需要初始化 builder：
```bash
docker buildx create --use --name mybuilder
```

构建 amd64 镜像并加载到本地 Docker：
```bash
docker buildx build \
  --platform linux/amd64 \
  --load \
  -t idea-render-backend:amd64 \
  .
```

---

## 二、打包镜像（导出为文件）

```bash
docker save -o idea-render-backend-amd64.tar idea-render-backend:amd64
```

> 生成的 `.tar` 文件可直接发给他人或上传到服务器。

---

## 三、导入镜像（服务器 / 他人电脑）

```bash
docker load -i idea-render-backend-amd64.tar
```

---

## 四、运行容器

### 前台运行（看日志，调试用）
```bash
docker run -p 3001:3001 \
  -e AI_BASE_URL="你的接口地址" \
  -e AI_API_KEY="你的密钥" \
  -e AI_MODEL="glm-5" \
  idea-render-backend:amd64
```

### 后台运行（生产部署用）
```bash
docker run -d \
  --name idea-render-backend \
  --restart=always \
  -p 3001:3001 \
  -e AI_BASE_URL="你的接口地址" \
  -e AI_API_KEY="你的密钥" \
  -e AI_MODEL="glm-5" \
  idea-render-backend:amd64
```

> `-d` 后台运行；`--restart=always` 服务器重启后自动拉起；`--name` 给容器取名方便后续操作。

---

## 五、测试接口

```bash
curl -X POST http://localhost:3001/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "创建一个销售仪表盘"}'
```

看到流式 JSON 输出 = 服务正常。

---

## 六、日常管理命令

```bash
# 查看运行中的容器
docker ps

# 查看容器日志
docker logs idea-render-backend

# 实时查看日志（跟踪输出）
docker logs -f idea-render-backend

# 停止容器
docker stop idea-render-backend

# 启动已停止的容器
docker start idea-render-backend

# 重启容器
docker restart idea-render-backend

# 删除容器（需先停止）
docker stop idea-render-backend && docker rm idea-render-backend

# 查看所有镜像
docker images
```

---

## 七、更新代码后重新部署流程

**你的操作（每次改完代码）：**
```bash
# 1. 重新构建
docker buildx build \
  --platform linux/amd64 \
  --load \
  -t idea-render-backend:amd64 \
  .

# 2. 重新打包
docker save -o idea-render-backend-amd64.tar idea-render-backend:amd64

# 3. 发给朋友（或 scp 传到服务器）
scp idea-render-backend-amd64.tar 用户名@服务器IP:/目标路径/
```

**朋友/服务器的操作：**
```bash
# 停止旧容器
docker stop idea-render-backend && docker rm idea-render-backend

# 导入新镜像
docker load -i idea-render-backend-amd64.tar

# 启动新容器
docker run -d \
  --name idea-render-backend \
  --restart=always \
  -p 3001:3001 \
  -e AI_BASE_URL="接口地址" \
  -e AI_API_KEY="密钥" \
  -e AI_MODEL="glm-5" \
  idea-render-backend:amd64
```

---

## 八、常见问题

| 错误信息 | 原因 | 解决方法 |
|---------|------|----------|
| `failed to fetch anonymous token` | 国内无法访问 Docker Hub | Dockerfile 的 FROM 改用 `docker.m.daocloud.io/library/node:22-alpine` |
| `platform does not match` | 架构不兼容 | 用 `--platform linux/amd64` 构建 |
| `repositories: no such file or directory` | tar 格式不兼容 | 先 `buildx --load` 再 `docker save` 导出 |
| `502 Bad Gateway` | buildx 管道不稳定 | 改用 `--load` + `docker save` 两步走 |
| 容器启动后立刻退出 | 环境变量缺失 | `docker logs 容器名` 查看具体错误 |
