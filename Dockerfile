# 使用本地镜像
FROM node:18-alpine

WORKDIR /app

# 设置npm淘宝镜像源
RUN npm config set registry https://registry.npmmirror.com

# 复制package文件
COPY package*.json ./
COPY client/package*.json ./client/

# 安装依赖（使用npm install而不是npm ci）
RUN npm install --only=production --no-audit --no-fund
RUN cd client && npm install --no-audit --no-fund && cd ..

# 复制源代码
COPY . .

# 构建前端
RUN cd client && npm run build && cd ..

# 创建非root用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 && \
    chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3001

CMD ["node", "server.js"]
