# 代码块测试

## 行内代码

这里有一些 `行内代码` 的例子，比如 `const x = 1` 和 `function() {}`。

## 基础代码块

```
这是一个没有语法高亮的代码块
可以包含任何文本内容
支持多行
```

## JavaScript 代码

```javascript
// 这是一个JavaScript代码块
function greet(name) {
    if (name) {
        console.log(`Hello, ${name}!`);
    } else {
        console.log('Hello, World!');
    }
}

// 使用示例
greet('Alice');
greet();
```

## Python 代码

```python
# 这是一个Python代码块
def fibonacci(n):
    """计算斐波那契数列"""
    if n <= 1:
        return n
    else:
        return fibonacci(n-1) + fibonacci(n-2)

# 使用示例
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")
```

## Bash 脚本

```bash
#!/bin/bash
# 这是一个Bash脚本示例

echo "开始执行脚本..."

# 检查参数
if [ $# -eq 0 ]; then
    echo "错误：请提供文件名参数"
    exit 1
fi

filename=$1

# 检查文件是否存在
if [ -f "$filename" ]; then
    echo "文件 $filename 存在"
    echo "文件大小: $(du -h "$filename" | cut -f1)"
else
    echo "文件 $filename 不存在"
fi

echo "脚本执行完成"
```

## SQL 查询

```sql
-- 这是一个SQL查询示例
SELECT 
    u.username,
    u.email,
    COUNT(p.id) as post_count
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
WHERE u.created_at >= '2024-01-01'
GROUP BY u.id, u.username, u.email
HAVING COUNT(p.id) > 0
ORDER BY post_count DESC
LIMIT 10;
```

## HTML 代码

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>示例页面</title>
    <style>
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .highlight {
            background-color: yellow;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>欢迎访问</h1>
        <p>这是一个 <span class="highlight">HTML示例</span>。</p>
    </div>
</body>
</html>
```

## CSS 样式

```css
/* 这是一个CSS样式示例 */
:root {
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --success-color: #28a745;
    --danger-color: #dc3545;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
}

.button {
    display: inline-block;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.3s ease;
}

.button-primary {
    background-color: var(--primary-color);
    color: white;
}

.button-primary:hover {
    background-color: darken(var(--primary-color), 10%);
    transform: translateY(-2px);
}
```

## 数学公式

```math
E = mc^2

\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}

\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
```
