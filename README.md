# 📚 SdocViewer

一个现代化的、安全的Markdown文档查看器，支持多用户管理、文件编辑、主题切换等功能。项目采用Docker容器化部署，支持HTTP和HTTPS访问。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

## ✨ 功能特性

### 🔐 用户管理
- **多用户支持**: 支持管理员和普通用户角色
- **用户认证**: JWT token认证机制
- **权限控制**: 基于角色的访问控制
- **用户管理**: 管理员可以新增、删除、重置用户密码

### 📖 文档管理
- **Markdown支持**: 完整的Markdown语法支持
- **文件浏览**: 树形文件结构浏览
- **实时编辑**: 在线编辑和保存文档
- **文件上传**: 支持拖拽上传文件
- **代码高亮**: 语法高亮显示

### 🎨 用户体验
- **主题切换**: 支持亮色、暗色、跟随系统主题
- **响应式设计**: 适配各种屏幕尺寸
- **自定义滚动条**: 美观的滚动条样式
- **Toast提示**: 统一的操作反馈提示

### 🚀 技术特性
- **容器化部署**: Docker一键部署
- **数据持久化**: 用户数据和文件持久化存储
- **API设计**: RESTful API接口
- **安全防护**: 密码加密、请求限流

## 🛠️ 技术栈

### 前端
- **React 18**: 现代化的前端框架
- **TypeScript**: 类型安全的JavaScript
- **CSS3**: 原生CSS，无额外依赖
- **Markdown**: 文档渲染

### 后端
- **Node.js**: 服务端运行环境
- **Express**: Web应用框架
- **JWT**: 用户认证
- **Bcrypt**: 密码加密
- **文件系统**: 本地文件存储

### 部署
- **Docker**: 容器化部署
- **Docker Compose**: 多容器编排

## 🚀 快速开始

### 环境要求
- Docker & Docker Compose
- Node.js 18+ (开发环境)

### 一键部署

1. **克隆项目**
```bash
git clone https://github.com/lkkone/SdocViewer.git
cd SdocViewer
```

2. **启动服务**
```bash
docker-compose up --build
```

3. **访问应用**
打开浏览器访问: http://localhost:3001

4. **默认账户**
- 用户名: `admin`
- 密码: `password`

### 开发环境部署

1. **安装依赖**
```bash
npm install
cd client && npm install
```

2. **启动开发服务器**
```bash
# 启动后端服务
npm run dev

# 启动前端开发服务器
cd client && npm start
```

## 📁 项目结构

```
SdocViewer/
├── client/                 # 前端React应用
│   ├── public/            # 静态资源
│   ├── src/               # 源代码
│   │   ├── App.tsx        # 主应用组件
│   │   ├── App.css        # 样式文件
│   │   └── index.tsx      # 入口文件
│   └── package.json       # 前端依赖
├── files/                  # 文档文件目录
├── server.js               # 后端服务器
├── docker-compose.yml      # Docker编排配置
├── Dockerfile              # Docker镜像配置
├── users.json              # 用户数据文件
├── .gitignore              # Git忽略文件
└── README.md               # 项目说明
```

## 🔧 配置说明

### 环境变量
- `PORT`: 服务端口 (默认: 3001)
- `JWT_SECRET`: JWT密钥 (默认: your-secret-key)

### 文件配置
- `files/`: 文档文件存储目录
- `users.json`: 用户数据文件
- `docker-compose.yml`: 容器配置

### 端口配置
- **容器内部端口**: 3001
- **宿主机端口**: 3003
- **支持访问**: localhost:3003 和本机IP:3003

## 📖 使用说明

### 用户登录
1. 访问应用首页
2. 输入用户名和密码
3. 点击登录按钮

### 文档查看
1. 登录后自动加载文件列表
2. 点击文件名查看内容
3. 支持Markdown语法渲染

### 文档编辑
1. 在文档查看页面点击"编辑"按钮
2. 修改文档内容
3. 点击"保存"按钮保存更改

### 用户管理 (管理员)
1. 点击右下角设置按钮
2. 选择"管理用户"
3. 可以新增、删除、重置用户密码

### 修改密码
1. 点击设置按钮
2. 选择"修改密码"
3. 输入当前密码和新密码

## 🔒 安全特性

- **密码加密**: 使用bcrypt进行密码哈希
- **JWT认证**: 安全的token认证机制
- **权限控制**: 基于角色的访问控制
- **请求限流**: 防止API滥用
- **输入验证**: 服务端数据验证

## 🐳 Docker部署

### 一键部署
```bash
# 构建并启动
docker-compose up --build -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 访问地址
- **本地访问**: http://localhost:3003
- **本机IP访问**: http://你的IP:3003
- **HTTPS代理**: 可在前面配置Nginx等反向代理

### 数据持久化
- 用户数据: `./users.json` → `/app/users.json`
- 文档文件: `./files` → `/app/files`

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 贡献方式
1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 开发规范
- 使用TypeScript进行开发
- 遵循ESLint代码规范
- 添加适当的注释和文档
- 确保代码测试通过

## 📝 更新日志

### v1.0.0 (2024-01-XX)
- ✨ 初始版本发布
- 🔐 用户认证和权限管理
- 📖 Markdown文档查看和编辑
- 🎨 主题切换和响应式设计
- 🐳 Docker容器化部署

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [React](https://reactjs.org/) - 前端框架
- [Express](https://expressjs.com/) - 后端框架
- [Markdown](https://daringfireball.net/projects/markdown/) - 文档格式
- [Docker](https://www.docker.com/) - 容器化平台

## 📞 联系我们

- 项目地址: [https://github.com/lkkone/SdocViewer](https://github.com/lkkone/SdocViewer)
- 问题反馈: [Issues](https://github.com/lkkone/SdocViewer/issues)
- 功能建议: [Discussions](https://github.com/lkkone/SdocViewer/discussions)

---

⭐ 如果这个项目对你有帮助，请给我们一个星标！

---

## 🔒 安全说明

- 用户密码使用 bcrypt 加密存储
- JWT token 认证机制
- 基于角色的访问控制
- 请求频率限制保护
- 敏感文件通过 .gitignore 保护
