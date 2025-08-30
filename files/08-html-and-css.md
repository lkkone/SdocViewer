# HTML和CSS测试

## HTML标签测试

### 基础HTML标签

<strong>粗体文本</strong>
<em>斜体文本</em>
<u>下划线文本</u>
<s>删除线文本</s>

### 标题标签

<h1>H1标题</h1>
<h2>H2标题</h2>
<h3>H3标题</h3>
<h4>H4标题</h4>
<h5>H5标题</h5>
<h6>H6标题</h6>

### 段落和换行

<p>这是一个段落标签。</p>
<p>这是另一个段落，<br>包含换行标签。</p>

### 列表标签

<ul>
  <li>无序列表项1</li>
  <li>无序列表项2</li>
  <li>无序列表项3</li>
</ul>

<ol>
  <li>有序列表项1</li>
  <li>有序列表项2</li>
  <li>有序列表项3</li>
</ol>

### 表格标签

<table border="1">
  <thead>
    <tr>
      <th>表头1</th>
      <th>表头2</th>
      <th>表头3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>数据1</td>
      <td>数据2</td>
      <td>数据3</td>
    </tr>
    <tr>
      <td>数据4</td>
      <td>数据5</td>
      <td>数据6</td>
    </tr>
  </tbody>
</table>

### 表单元素

<form>
  <label for="name">姓名：</label>
  <input type="text" id="name" name="name" placeholder="请输入姓名"><br><br>
  
  <label for="email">邮箱：</label>
  <input type="email" id="email" name="email" placeholder="请输入邮箱"><br><br>
  
  <label for="message">留言：</label>
  <textarea id="message" name="message" rows="4" cols="50" placeholder="请输入留言"></textarea><br><br>
  
  <input type="submit" value="提交">
  <input type="reset" value="重置">
</form>

### 媒体元素

<audio controls>
  <source src="audio.mp3" type="audio/mpeg">
  您的浏览器不支持音频标签。
</audio>

<video width="320" height="240" controls>
  <source src="video.mp4" type="video/mp4">
  您的浏览器不支持视频标签。
</video>

### 语义化标签

<header>
  <h1>页面标题</h1>
  <nav>
    <a href="#home">首页</a> |
    <a href="#about">关于</a> |
    <a href="#contact">联系</a>
  </nav>
</header>

<main>
  <article>
    <h2>文章标题</h2>
    <p>文章内容...</p>
  </article>
  
  <aside>
    <h3>侧边栏</h3>
    <p>侧边栏内容...</p>
  </aside>
</main>

<footer>
  <p>&copy; 2024 版权所有</p>
</footer>

## CSS样式测试

### 内联样式

<p style="color: red; font-size: 18px; background-color: yellow;">这是带有内联样式的段落</p>

<div style="border: 2px solid blue; padding: 20px; margin: 10px; border-radius: 10px;">
  <h3 style="color: blue; text-align: center;">带样式的标题</h3>
  <p style="font-family: Arial, sans-serif; line-height: 1.6;">这是带样式的文本内容。</p>
</div>

### 样式属性组合

<div style="
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  color: white;
  padding: 30px;
  margin: 20px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  text-align: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
">
  <h2 style="margin: 0 0 20px 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
    渐变背景标题
  </h2>
  <p style="margin: 0; font-size: 16px; line-height: 1.5;">
    这是一个带有渐变背景、阴影和圆角的样式化区块。
  </p>
</div>

### 响应式设计

<div style="
  max-width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
">
  <h3 style="color: #495057; margin-top: 0;">响应式容器</h3>
  <p style="color: #6c757d; margin-bottom: 0;">
    这个容器会根据屏幕宽度自动调整，支持移动端和桌面端。
  </p>
</div>

### 动画效果

<div style="
  width: 100px;
  height: 100px;
  background-color: #007bff;
  border-radius: 50%;
  margin: 20px auto;
  animation: bounce 2s infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
">
  弹跳
</div>

<style>
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
}
</style>

### 网格布局

<div style="
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
  background-color: #e9ecef;
  border-radius: 8px;
">
  <div style="background-color: #007bff; color: white; padding: 20px; border-radius: 5px; text-align: center;">
    网格项1
  </div>
  <div style="background-color: #28a745; color: white; padding: 20px; border-radius: 5px; text-align: center;">
    网格项2
  </div>
  <div style="background-color: #dc3545; color: white; padding: 20px; border-radius: 5px; text-align: center;">
    网格项3
  </div>
</div>

### Flexbox布局

<div style="
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin: 20px 0;
">
  <div style="background-color: #6f42c1; color: white; padding: 15px; border-radius: 5px;">
    左侧内容
  </div>
  <div style="background-color: #fd7e14; color: white; padding: 15px; border-radius: 5px;">
    中间内容
  </div>
  <div style="background-color: #20c997; color: white; padding: 15px; border-radius: 5px;">
    右侧内容
  </div>
</div>

### 伪元素和伪类

<div style="
  position: relative;
  padding: 20px;
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  margin: 20px 0;
">
  <h4 style="margin-top: 0; color: #856404;">伪元素示例</h4>
  <p style="margin-bottom: 0; color: #856404;">
    这个元素使用了伪元素样式。
  </p>
</div>

### 媒体查询示例

<div style="
  padding: 20px;
  background-color: #d1ecf1;
  border: 1px solid #bee5eb;
  border-radius: 8px;
  margin: 20px 0;
">
  <h4 style="margin-top: 0; color: #0c5460;">响应式设计</h4>
  <p style="margin-bottom: 0; color: #0c5460;">
    在不同屏幕尺寸下，这个元素会显示不同的样式。
  </p>
</div>
