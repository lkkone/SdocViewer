import React, { useState, useEffect, useRef } from 'react';
import './App.css';

interface User {
  username: string;
  role: string;
}

interface FileInfo {
  name: string;
  path: string;
  size: number;
  modified: string;
}

interface FileData {
  name: string;
  content: string;
  rawContent?: string;
}

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

type Theme = 'light' | 'dark' | 'system';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [currentFile, setCurrentFile] = useState<FileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const [theme, setTheme] = useState<Theme>('system');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  // 设置相关状态
  const [showSettings, setShowSettings] = useState(false);
  const [showUserManagementModal, setShowUserManagementModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  
  // 用户管理相关状态
  const [users, setUsers] = useState<Array<{username: string, role: string}>>([]);
  const [newUserData, setNewUserData] = useState({
    username: '',
    password: ''
  });
  
  // 确认对话框状态
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'delete' | 'reset';
    username: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);
  // 修改密码数据
  const [changePasswordData, setChangePasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const fileContentRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 检查是否已经登录
    const token = localStorage.getItem('token');
    if (token) {
      // 设置loading状态，避免闪烁
      setLoading(true);
      verifyToken(token);
    }
    
        // 从localStorage获取主题设置
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
    
    // 获取用户列表
    fetchUsers();
  }, []);

  useEffect(() => {
    // 应用主题
    applyTheme(theme);
  }, [theme]);

  const applyTheme = (selectedTheme: Theme) => {
    const root = document.documentElement;
    
    if (selectedTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.setAttribute('data-theme', systemTheme);
    } else {
      root.setAttribute('data-theme', selectedTheme);
    }
    
    localStorage.setItem('theme', selectedTheme);
  };

  const toggleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return '☀️';
      case 'dark':
        return '🌙';
      case 'system':
        return '💻';
      default:
        return '💻';
    }
  };

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('/api/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsLoggedIn(true);
        fetchFiles(token);

      } else {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      }
    } catch (error) {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        setIsLoggedIn(true);
        setUsername('');
        setPassword('');
        setError(''); // 清除错误信息
        fetchFiles(data.token);
      } else {
        setError(data.message || '登录失败');
        showToast('error', data.message || '登录失败');
      }
    } catch (error) {
      setError('网络错误，请重试');
      showToast('error', '网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  const fetchFiles = async (token: string) => {
    try {
      const response = await fetch('/api/files', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFiles(data.files);
        // 如果有文件，自动加载第一个
        if (data.files.length > 0) {
          fetchFileContent(data.files[0].name, token);
        }
      }
    } catch (error) {
      console.error('获取文件列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFileContent = async (filename: string, token: string) => {
    try {
      const response = await fetch(`/api/files/${filename}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentFile(data);
      }
    } catch (error) {
      console.error('获取文件内容失败:', error);
    }
  };

  const handleFileSelect = (filename: string) => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchFileContent(filename, token);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    setCurrentFile(null);
    setFiles([]);
  };



  // 获取用户列表
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        const errorData = await response.json();
        showToast('error', `获取用户列表失败：${errorData.error || '请重试'}`);
      }
    } catch (error) {
      console.error('获取用户列表失败:', error);
      showToast('error', '获取用户列表失败，请重试');
    }
  };

  // 新增用户
  const handleAddUser = async () => {
    if (!newUserData.username.trim() || !newUserData.password.trim()) {
      showToast('error', '用户名和密码不能为空');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showToast('error', '未登录，无法添加用户');
        return;
      }

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newUserData)
      });

      if (response.ok) {
        showToast('success', '用户添加成功！');
        setNewUserData({ username: '', password: '' });
        fetchUsers(); // 刷新用户列表
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || '添加用户失败');
      }
    } catch (error) {
      console.error('添加用户失败:', error);
      showToast('error', `添加用户失败：${error instanceof Error ? error.message : '请重试'}`);
    }
  };

  // 删除用户
  const handleDeleteUser = async (username: string) => {
    if (username === 'admin') {
      showToast('error', '不能删除管理员用户');
      return;
    }

    setConfirmAction({
      type: 'delete',
      username,
      message: `确定要删除用户 ${username} 吗？`,
      onConfirm: async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) return;

          const response = await fetch(`/api/users/${username}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            showToast('success', '用户删除成功！');
            fetchUsers(); // 刷新用户列表
          } else {
            const errorData = await response.json();
            throw new Error(errorData.error || '删除用户失败');
          }
        } catch (error) {
          console.error('删除用户失败:', error);
          showToast('error', `删除用户失败：${error instanceof Error ? error.message : '请重试'}`);
        }
        setShowConfirmDialog(false);
        setConfirmAction(null);
      }
    });
    setShowConfirmDialog(true);
  };

  // 重置用户密码
  const handleResetPassword = async (username: string) => {
    setConfirmAction({
      type: 'reset',
      username,
      message: `确定要重置用户 ${username} 的密码吗？`,
      onConfirm: async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) return;

          const response = await fetch(`/api/users/${username}/reset-password`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            showToast('success', `用户 ${username} 的密码已重置为: ${data.newPassword}`);
          } else {
            const errorData = await response.json();
            throw new Error(errorData.error || '重置密码失败');
          }
        } catch (error) {
          console.error('重置密码失败:', error);
          showToast('error', `重置密码失败：${error instanceof Error ? error.message : '请重试'}`);
        }
        setShowConfirmDialog(false);
        setConfirmAction(null);
      }
    });
    setShowConfirmDialog(true);
  };

  // 修改密码
  const handleChangePassword = async () => {
    if (!changePasswordData.oldPassword.trim() || !changePasswordData.newPassword.trim()) {
      showToast('error', '当前密码和新密码不能为空');
      return;
    }

    if (changePasswordData.newPassword !== changePasswordData.confirmPassword) {
      showToast('error', '新密码和确认密码不匹配');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showToast('error', '未登录，无法修改密码');
        return;
      }

      const response = await fetch('/api/users/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPassword: changePasswordData.oldPassword,
          newPassword: changePasswordData.newPassword
        })
      });

      if (response.ok) {
        showToast('success', '密码修改成功！');
        setShowChangePasswordModal(false);
        setChangePasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || '修改密码失败');
      }
    } catch (error) {
      console.error('修改密码失败:', error);
      showToast('error', `修改密码失败：${error instanceof Error ? error.message : '请重试'}`);
    }
  };



  const scrollToTop = () => {
    if (fileContentRef.current) {
      fileContentRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // 处理代码块复制
  const handleCodeCopy = (codeText: string) => {
    navigator.clipboard.writeText(codeText).then(() => {
      // 可以添加一个临时的成功提示
      console.log('代码已复制到剪贴板');
    }).catch(err => {
      console.error('复制失败:', err);
    });
  };

  // 在组件挂载后为代码块添加复制按钮
  useEffect(() => {
    if (currentFile && fileContentRef.current) {
      const codeBlocks = fileContentRef.current.querySelectorAll('pre code');
      codeBlocks.forEach((codeBlock: Element) => {
        const pre = codeBlock.parentElement;
        if (pre && !pre.querySelector('.copy-button')) {
          const copyButton = document.createElement('button');
          copyButton.className = 'copy-button';
          copyButton.innerHTML = '📋';
          copyButton.title = '复制代码';
          copyButton.onclick = () => handleCodeCopy((codeBlock as HTMLElement).textContent || '');
          
          pre.style.position = 'relative';
          pre.appendChild(copyButton);
        }
      });
    }
  }, [currentFile]);

  const handleEditToggle = () => {
    if (isEditing) {
      // 退出编辑模式，恢复原始内容
      setIsEditing(false);
      setEditContent('');
    } else {
      // 进入编辑模式，加载当前文件内容
      if (currentFile) {
        // 如果有rawContent使用rawContent，否则使用content
        setEditContent(currentFile.rawContent || currentFile.content);
        setIsEditing(true);
      }
    }
  };

  const handleSave = async () => {
    if (!currentFile || !editContent.trim()) return;
    
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('未登录，无法保存');
        return;
      }
      const response = await fetch(`/api/files/${currentFile.name}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: editContent })
      });

      if (response.ok) {
        // 更新本地状态
        setCurrentFile({ ...currentFile, content: editContent });
        setIsEditing(false);
        setEditContent('');
        // 刷新文件列表
        fetchFiles(token);
        showToast('success', '文件保存成功！');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || '保存失败');
      }
    } catch (error) {
      console.error('保存文件失败:', error);
              showToast('error', `保存失败：${error instanceof Error ? error.message : '请重试'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent('');
  };

  const handleNewFile = () => {
    setShowNewFileModal(true);
  };

  const handleCreateFile = async () => {
    if (!newFileName.trim()) return;
    
    const fileName = newFileName.endsWith('.md') ? newFileName : `${newFileName}.md`;
    setIsCreating(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('未登录，无法创建文件');
        return;
      }
      
      const response = await fetch('/api/files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          name: fileName, 
          content: `# ${newFileName.replace('.md', '')}\n\n在这里开始编写你的文档...` 
        })
      });

      if (response.ok) {
        // 刷新文件列表并选择新文件
        await fetchFiles(token);
        handleFileSelect(fileName);
        setShowNewFileModal(false);
        setNewFileName('');
        setIsCreating(false);
        showToast('success', '文件创建成功！');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || '创建文件失败');
      }
    } catch (error) {
      console.error('创建文件失败:', error);
              showToast('error', `创建文件失败：${error instanceof Error ? error.message : '请重试'}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 检查文件类型
    if (!file.name.endsWith('.md')) {
      alert('只支持上传 .md 文件');
      return;
    }

    // 检查文件大小（限制为5MB）
    if (file.size > 5 * 1024 * 1024) {
      alert('文件大小不能超过5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('未登录，无法上传文件');
          return;
        }
        
        const response = await fetch('/api/files', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            name: file.name, 
            content: content 
          })
        });

        if (response.ok) {
          // 刷新文件列表并选择新文件
          await fetchFiles(token);
          handleFileSelect(file.name);
          showToast('success', '文件上传成功！');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || '上传文件失败');
        }
      } catch (error) {
        console.error('上传文件失败:', error);
        showToast('error', `上传文件失败：${error instanceof Error ? error.message : '请重试'}`);
      }
    };
    reader.readAsText(file);
    
    // 清空input值，允许重复上传同一文件
    event.target.value = '';
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  if (isLoggedIn) {
    return (
      <div className="app">
        <header className="header">
          <h1>SdocViewer</h1>
          <div className="header-controls">
            <div className="edit-actions">
              {currentFile && (
                <>
                  <button 
                    onClick={handleEditToggle}
                    className={`edit-btn ${isEditing ? 'editing' : ''}`}
                    title={isEditing ? '退出编辑' : '编辑文件'}
                  >
                    {isEditing ? '✕ 退出编辑' : '✏️ 编辑文件'}
                  </button>
                  {isEditing && (
                    <>
                      <button 
                        onClick={handleSave}
                        className="save-btn"
                        disabled={isSaving}
                        title="保存文件"
                      >
                        {isSaving ? '保存中...' : '💾 保存'}
                      </button>
                      <button 
                        onClick={handleCancelEdit}
                        className="cancel-btn"
                        title="取消编辑"
                      >
                        ❌ 取消
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
            <div className="file-actions">
              <button 
                onClick={handleNewFile}
                className="action-btn new-btn"
                title="新建文件"
              >
                📄 新建
              </button>
              <button 
                onClick={triggerFileUpload}
                className="action-btn upload-btn"
                title="上传文件"
              >
                📤 上传
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".md"
                onChange={handleUploadFile}
                style={{ display: 'none' }}
              />
            </div>
            <button onClick={toggleTheme} className="theme-toggle" title="切换主题">
              {getThemeIcon()}
            </button>
            <button onClick={handleLogout} className="logout-btn" title="退出登录">
              🚪
            </button>
          </div>
        </header>
        
        {/* Toast 提示消息 */}
        <div className="toast-container">
          {toasts.map(toast => (
            <div key={toast.id} className={`toast toast-${toast.type}`}>
              {toast.message}
            </div>
          ))}
        </div>

        <div className="main-container">
          <aside className="sidebar">
            <div className="file-list">
              {files.map((file) => (
                <div
                  key={file.name}
                  className={`file-item ${currentFile?.name === file.name ? 'active' : ''}`}
                  onClick={() => handleFileSelect(file.name)}
                >
                  <span className="file-name">{file.name.replace(/\.md$/, '')}</span>
                  <span className="file-info">{file.size}</span>
                </div>
              ))}
            </div>
          </aside>

          <main className="main-content">
            {currentFile ? (
              <div className="file-content" ref={fileContentRef}>
                
                {isEditing ? (
                  <div className="edit-mode">
                    <div className="edit-header">
                      <h3>编辑模式 - {currentFile.name}</h3>
                      <p className="edit-tip">支持Markdown语法，修改完成后点击保存按钮</p>
                    </div>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="edit-textarea"
                      placeholder="在此输入Markdown内容..."
                      spellCheck="false"
                    />
                  </div>
                ) : (
                  <div
                    className="markdown-body"
                    dangerouslySetInnerHTML={{ 
                      __html: currentFile.content 
                    }}
                  />
                )}
              </div>
            ) : (
              <div className="no-file">
                <p>请选择一个文件查看，或点击"新建"创建新文件</p>
              </div>
            )}
          </main>
        </div>

        {/* 新建文件模态框 */}
        {showNewFileModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>新建文件</h3>
                <button 
                  onClick={() => setShowNewFileModal(false)}
                  className="modal-close"
                >
                  ✕
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="newFileName">文件名</label>
                  <input
                    type="text"
                    id="newFileName"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="请输入文件名（不需要.md后缀）"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleCreateFile();
                      }
                    }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  onClick={() => setShowNewFileModal(false)}
                  className="btn-secondary"
                >
                  取消
                </button>
                <button 
                  onClick={handleCreateFile}
                  className="btn-primary"
                  disabled={isCreating || !newFileName.trim()}
                >
                  {isCreating ? '创建中...' : '创建文件'}
                </button>
              </div>
            </div>
          </div>
        )}



        {currentFile && !isEditing && (
          <button onClick={scrollToTop} className="scroll-to-top" title="回到顶部">
            ▲
          </button>
        )}

        {/* 设置按钮 - 只有admin用户才能看到 */}
        {user && user.role === 'admin' && (
          <button onClick={() => setShowSettings(!showSettings)} className="settings-btn" title="设置">
            ⚙️
          </button>
        )}

                {/* 设置面板 */}
        {showSettings && (
          <div className="settings-panel">
            <div className="settings-header">
              <h3>设置</h3>
              <button onClick={() => setShowSettings(false)} className="settings-close">
                ✕
              </button>
            </div>
            <div className="settings-content">
              <button onClick={() => setShowUserManagementModal(true)} className="settings-item">
                👥 管理用户
              </button>
              <button onClick={() => setShowChangePasswordModal(true)} className="settings-item">
                🔒 修改密码
              </button>
            </div>
          </div>
        )}

        {/* 用户管理模态框 */}
        {showUserManagementModal && (
          <div className="modal-overlay">
            <div className="modal user-management-modal">
              <div className="modal-header">
                <h3>用户管理</h3>
                <button onClick={() => setShowUserManagementModal(false)} className="modal-close">✕</button>
              </div>
              <div className="modal-body">
                {/* 新增用户表单 */}
                <div className="add-user-section">
                  <h4>新增用户</h4>
                  <div className="form-group">
                    <label htmlFor="newUsername">用户名</label>
                    <input
                      type="text"
                      id="newUsername"
                      value={newUserData.username}
                      onChange={(e) => setNewUserData({...newUserData, username: e.target.value})}
                      placeholder="请输入用户名"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="newUserPassword">密码</label>
                    <input
                      type="password"
                      id="newUserPassword"
                      value={newUserData.password}
                      onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
                      placeholder="请输入密码"
                    />
                  </div>
                  <button onClick={handleAddUser} className="btn-primary">添加用户</button>
                </div>

                {/* 用户列表 */}
                <div className="users-list-section">
                  <h4>用户列表</h4>
                  <div className="users-list">
                    {users.map((user, index) => (
                      <div key={index} className="user-item">
                        <div className="user-info">
                          <span className="username">{user.username}</span>
                          <span className="role">{user.role}</span>
                        </div>
                        <div className="user-actions">
                          {user.username !== 'admin' && (
                            <button 
                              onClick={() => handleDeleteUser(user.username)}
                              className="btn-danger btn-small"
                              title="删除用户"
                            >
                              🗑️
                            </button>
                          )}
                          <button 
                            onClick={() => handleResetPassword(user.username)}
                            className="btn-secondary btn-small"
                            title="重置密码"
                          >
                            🔄
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button onClick={() => setShowUserManagementModal(false)} className="btn-secondary">关闭</button>
              </div>
            </div>
          </div>
        )}

        {/* 修改密码模态框 */}
        {showChangePasswordModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>修改密码</h3>
                <button onClick={() => setShowChangePasswordModal(false)} className="modal-close">✕</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="oldPassword">当前密码</label>
                  <input
                    type="password"
                    id="oldPassword"
                    value={changePasswordData.oldPassword}
                    onChange={(e) => setChangePasswordData({...changePasswordData, oldPassword: e.target.value})}
                    placeholder="请输入当前密码"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newPassword">新密码</label>
                  <input
                    type="password"
                    id="newPassword"
                    value={changePasswordData.newPassword}
                    onChange={(e) => setChangePasswordData({...changePasswordData, newPassword: e.target.value})}
                    placeholder="请输入新密码"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">确认新密码</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={changePasswordData.confirmPassword}
                    onChange={(e) => setChangePasswordData({...changePasswordData, confirmPassword: e.target.value})}
                    placeholder="请再次输入新密码"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button onClick={() => setShowChangePasswordModal(false)} className="btn-secondary">取消</button>
                <button onClick={handleChangePassword} className="btn-primary">修改密码</button>
              </div>
            </div>
          </div>
        )}

        {/* 确认对话框 */}
        {showConfirmDialog && confirmAction && (
          <div className="modal-overlay">
            <div className="modal confirm-dialog">
              <div className="modal-header">
                <h3>确认操作</h3>
                <button onClick={() => {
                  setShowConfirmDialog(false);
                  setConfirmAction(null);
                }} className="modal-close">✕</button>
              </div>
              <div className="modal-body">
                <p>{confirmAction.message}</p>
              </div>
              <div className="modal-footer">
                <button onClick={() => {
                  setShowConfirmDialog(false);
                  setConfirmAction(null);
                }} className="btn-secondary">取消</button>
                <button onClick={confirmAction.onConfirm} className="btn-primary">
                  {confirmAction.type === 'delete' ? '删除' : '重置'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  // 如果正在验证token，显示loading状态
  if (loading && !isLoggedIn) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>正在验证登录状态...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="login-container">
        {/* 主题切换按钮 - 页面右上角 */}
        <button onClick={toggleTheme} className="theme-toggle login-page-theme-toggle" title="切换主题">
          {getThemeIcon()}
        </button>
        
        <div className="login-card">
          <div className="login-header">
            <h1>SdocViewer</h1>
          </div>
          <p className="login-subtitle">请登录以查看文档内容</p>
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="username">用户名</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入用户名"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">密码</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                required
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button 
              type="submit" 
              className="login-btn"
              disabled={loading}
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
