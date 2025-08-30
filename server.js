const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const marked = require('marked');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// 安全中间件
app.use(helmet());
app.use(cors());
app.use(express.json());

// 速率限制 - 放宽限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 1000 // 限制每个IP 15分钟内最多1000个请求
});
app.use(limiter);

// 用户数据文件路径
const USERS_FILE = path.join(__dirname, 'users.json');

// 用户数据（在实际生产环境中应该使用数据库）
let users = [
  {
    username: 'admin',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'admin'
  }
];

// 加载用户数据
const loadUsers = () => {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const usersContent = fs.readFileSync(USERS_FILE, 'utf8');
      users = JSON.parse(usersContent);
      console.log('用户数据加载成功');
    } else {
      console.log('使用默认用户数据');
    }
  } catch (error) {
    console.error('加载用户数据失败:', error);
  }
};

// 保存用户数据
const saveUsers = async () => {
  try {
    await fsPromises.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
    console.log('用户数据保存成功');
  } catch (error) {
    console.error('保存用户数据失败:', error);
  }
};

// 启动时加载用户数据
loadUsers();

// JWT密钥
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// 认证中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: '访问令牌缺失' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: '访问令牌无效' });
    }
    req.user = user;
    next();
  });
};

// 登录端点
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: '用户名和密码都是必需的' });
    }

    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    const token = jwt.sign(
      { username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: '登录成功',
      token,
      user: { username: user.username, role: user.role }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 获取文件列表（需要认证）
app.get('/api/files', authenticateToken, async (req, res) => {
  try {
    const filesDir = path.join(__dirname, 'files');
    const files = await fsPromises.readdir(filesDir);
    
    // 过滤出.md文件
    const markdownFiles = files.filter(file => file.endsWith('.md'));
    
    // 获取文件信息
    const fileList = await Promise.all(
      markdownFiles.map(async (filename) => {
        const filePath = path.join(filesDir, filename);
        const stats = await fsPromises.stat(filePath);
        return {
          name: filename,
          path: filename,
          size: stats.size,
          modified: stats.mtime
        };
      })
    );
    
    res.json({ files: fileList });
  } catch (error) {
    console.error('读取文件列表错误:', error);
    res.status(500).json({ message: '无法读取文件列表' });
  }
});

// 创建新文件
app.post('/api/files', authenticateToken, async (req, res) => {
  try {
    const { name, content = '' } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ error: '文件名不能为空' });
    }
    
    // 验证文件名，防止路径遍历攻击
    if (name.includes('..') || name.includes('/') || name.includes('\\')) {
      return res.status(400).json({ error: '无效的文件名' });
    }
    
    const fileName = name.endsWith('.md') ? name : `${name}.md`;
    const filePath = path.join(__dirname, 'files', fileName);
    
    // 检查文件是否已存在
            if (await fsPromises.access(filePath).then(() => true).catch(() => false)) {
      return res.status(409).json({ error: '文件已存在' });
    }
    
    // 确保files目录存在
    const filesDir = path.dirname(filePath);
    await fsPromises.mkdir(filesDir, { recursive: true });
    
    // 创建文件
    await fsPromises.writeFile(filePath, content, 'utf8');
    
    res.json({ 
      message: '文件创建成功',
      name: fileName
    });
  } catch (error) {
    console.error('创建文件失败:', error);
    res.status(500).json({ error: '创建文件失败，请重试' });
  }
});

// 获取指定文件内容（需要认证）
app.get('/api/files/:filename', authenticateToken, async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, 'files', filename);
    
    // 安全检查：确保文件在files目录内
    const resolvedPath = path.resolve(filePath);
    const filesDir = path.resolve(path.join(__dirname, 'files'));
    
    if (!resolvedPath.startsWith(filesDir)) {
      return res.status(403).json({ message: '访问被拒绝' });
    }
    
    const content = await fsPromises.readFile(filePath, 'utf-8');
    
    // 将Markdown转换为HTML
    const htmlContent = marked.parse(content);
    
    res.json({ 
      name: filename,
      content: htmlContent, 
      rawContent: content
    });
  } catch (error) {
    console.error('读取文件错误:', error);
    res.status(500).json({ message: '无法读取文件' });
  }
});

// 更新文件内容（需要认证）
app.put('/api/files/:filename', authenticateToken, async (req, res) => {
  try {
    const { filename } = req.params;
    const { content } = req.body;
    
    // 安全检查：确保文件在files目录内
    const filePath = path.join(__dirname, 'files', filename);
    const resolvedPath = path.resolve(filePath);
    const filesDir = path.resolve(path.join(__dirname, 'files'));
    
    if (!resolvedPath.startsWith(filesDir)) {
      return res.status(403).json({ error: '访问被拒绝' });
    }

    // 验证文件名，防止路径遍历攻击
    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ error: '无效的文件名' });
    }
    
    if (content === undefined) {
      return res.status(400).json({ error: '文件内容不能为空' });
    }
    
    // 检查文件是否存在
    try {
      await fsPromises.access(filePath);
    } catch (error) {
      return res.status(404).json({ error: '文件不存在' });
    }
    
    // 保存文件
    await fsPromises.writeFile(filePath, content, 'utf8');
    
    res.json({ 
      message: '文件保存成功',
      name: filename
    });
  } catch (error) {
    console.error('保存文件失败:', error);
    res.status(500).json({ error: '保存文件失败，请重试' });
  }
});

// 验证令牌端点
app.get('/api/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// 获取用户列表端点
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    // 检查当前用户是否为管理员
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: '只有管理员才能查看用户列表' });
    }

    // 返回用户列表（不包含密码）
    const usersList = users.map(user => ({
      username: user.username,
      role: user.role
    }));

    res.json({ users: usersList });
  } catch (error) {
    console.error('获取用户列表错误:', error);
    res.status(500).json({ error: '获取用户列表失败，请重试' });
  }
});

// 新增用户端点
app.post('/api/users', authenticateToken, async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码都是必需的' });
    }
    
    // 检查用户是否已存在
    if (users.find(u => u.username === username)) {
      return res.status(409).json({ error: '用户名已存在' });
    }
    
    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 添加新用户
    const newUser = {
      username,
      password: hashedPassword,
      role: 'user'
    };
    
    users.push(newUser);
    
    // 保存用户数据到文件
    await saveUsers();
    
    res.json({ 
      message: '用户创建成功',
      user: { username: newUser.username, role: newUser.role }
    });
  } catch (error) {
    console.error('创建用户错误:', error);
    res.status(500).json({ error: '创建用户失败，请重试' });
  }
});

// 修改密码端点
app.put('/api/users/password', authenticateToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const username = req.user.username;
    
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: '旧密码和新密码都是必需的' });
    }
    
    // 查找用户
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }
    
    // 验证旧密码
    const validOldPassword = await bcrypt.compare(oldPassword, user.password);
    if (!validOldPassword) {
      return res.status(401).json({ error: '旧密码不正确' });
    }
    
    // 加密新密码
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    
    // 保存用户数据到文件
    await saveUsers();
    
    res.json({ message: '密码修改成功' });
  } catch (error) {
    console.error('修改密码错误:', error);
    res.status(500).json({ error: '修改密码失败，请重试' });
  }
});

// 删除用户端点
app.delete('/api/users/:username', authenticateToken, async (req, res) => {
  try {
    // 检查当前用户是否为管理员
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: '只有管理员才能删除用户' });
    }

    const { username } = req.params;
    
    // 不能删除admin用户
    if (username === 'admin') {
      return res.status(400).json({ error: '不能删除管理员用户' });
    }

    // 查找并删除用户
    const userIndex = users.findIndex(u => u.username === username);
    if (userIndex === -1) {
      return res.status(404).json({ error: '用户不存在' });
    }

    users.splice(userIndex, 1);
    
    // 保存用户数据到文件
    await saveUsers();
    
    res.json({ message: '用户删除成功' });
  } catch (error) {
    console.error('删除用户错误:', error);
    res.status(500).json({ error: '删除用户失败，请重试' });
  }
});

// 重置用户密码端点
app.post('/api/users/:username/reset-password', authenticateToken, async (req, res) => {
  try {
    // 检查当前用户是否为管理员
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: '只有管理员才能重置用户密码' });
    }

    const { username } = req.params;
    
    // 查找用户
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // 生成随机密码
    const newPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // 更新密码
    user.password = hashedPassword;
    
    // 保存用户数据到文件
    await saveUsers();
    
    res.json({ 
      message: '密码重置成功',
      newPassword: newPassword
    });
  } catch (error) {
    console.error('重置密码错误:', error);
    res.status(500).json({ error: '重置密码失败，请重试' });
  }
});


// 静态文件服务
app.use(express.static(path.join(__dirname, 'client/build')));

// 所有其他请求返回React应用
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
  console.log(`访问 http://localhost:${PORT} 查看应用`);
});
