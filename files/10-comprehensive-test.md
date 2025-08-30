# 综合测试文件

## 概述

这是一个综合性的Markdown测试文件，包含了各种语法元素的组合使用，用于测试Markdown渲染器的综合表现。

## 基础语法组合

### 文本格式混合

这是一个包含**粗体**、*斜体*、***粗斜体***、~~删除线~~、`行内代码`和[链接](https://example.com)的段落。

### 列表和代码混合

- **项目1**：包含 `代码` 和 [链接](https://example.com)
- **项目2**：包含 *斜体* 和 ~~删除线~~
- **项目3**：包含以下代码块：

```javascript
// 这是一个JavaScript代码块
function example() {
    const message = "Hello, World!";
    console.log(message);
    return message;
}
```

## 表格和格式化混合

### 复杂表格

| 功能 | 状态 | 描述 | 代码示例 |
|------|------|------|----------|
| **粗体文本** | ✅ 支持 | 使用 `**文本**` 语法 | `**粗体**` |
| *斜体文本* | ✅ 支持 | 使用 `*文本*` 语法 | `*斜体*` |
| `行内代码` | ✅ 支持 | 使用 `` `代码` `` 语法 | `` `代码` `` |
| [链接](https://example.com) | ✅ 支持 | 使用 `[文本](URL)` 语法 | `[文本](URL)` |

### 表格中的特殊内容

| 类型 | 示例 | 说明 |
|------|------|------|
| 数学公式 | `E = mc²` | 支持上下标 |
| 化学式 | `H₂O` | 支持Unicode |
| 表情符号 | 😀 🚀 ⭐ | 支持emoji |

## 引用和嵌套

### 基础引用

> 这是一个引用块
> 
> 包含**粗体**和*斜体*文本

### 嵌套引用

> 第一层引用
> 
> > 第二层引用
> > 
> > > 第三层引用
> > > 
> > > 包含 `代码` 和 [链接](https://example.com)

### 引用中的列表

> 引用中的列表：
> 
> 1. **第一项**：包含粗体
> 2. *第二项*：包含斜体
> 3. `第三项`：包含代码
> 4. [第四项](https://example.com)：包含链接

## 代码块和语法高亮

### JavaScript代码

```javascript
// 这是一个复杂的JavaScript示例
class Calculator {
    constructor() {
        this.history = [];
    }
    
    add(a, b) {
        const result = a + b;
        this.history.push({
            operation: 'add',
            operands: [a, b],
            result: result
        });
        return result;
    }
    
    getHistory() {
        return this.history.map(item => 
            `${item.operation}(${item.operands.join(', ')}) = ${item.result}`
        );
    }
}

// 使用示例
const calc = new Calculator();
console.log(calc.add(5, 3)); // 输出: 8
console.log(calc.getHistory());
```

### Python代码

```python
# 这是一个复杂的Python示例
import json
from typing import List, Dict, Any
from dataclasses import dataclass

@dataclass
class User:
    id: int
    name: str
    email: str
    is_active: bool = True
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'is_active': self.is_active
        }

class UserManager:
    def __init__(self):
        self.users: List[User] = []
    
    def add_user(self, user: User) -> None:
        self.users.append(user)
    
    def get_user_by_id(self, user_id: int) -> User:
        return next((u for u in self.users if u.id == user_id), None)
    
    def export_to_json(self, filename: str) -> None:
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump([u.to_dict() for u in self.users], f, indent=2)

# 使用示例
manager = UserManager()
user1 = User(1, "张三", "zhangsan@example.com")
user2 = User(2, "李四", "lisi@example.com")
manager.add_user(user1)
manager.add_user(user2)
manager.export_to_json("users.json")
```

### SQL代码

```sql
-- 这是一个复杂的SQL示例
WITH user_stats AS (
    SELECT 
        u.id,
        u.username,
        u.email,
        COUNT(p.id) as post_count,
        AVG(p.rating) as avg_rating,
        MAX(p.created_at) as last_post_date
    FROM users u
    LEFT JOIN posts p ON u.id = p.user_id
    WHERE u.created_at >= '2024-01-01'
    GROUP BY u.id, u.username, u.email
),
ranked_users AS (
    SELECT 
        *,
        ROW_NUMBER() OVER (ORDER BY post_count DESC, avg_rating DESC) as rank
    FROM user_stats
    WHERE post_count > 0
)
SELECT 
    username,
    email,
    post_count,
    ROUND(avg_rating, 2) as avg_rating,
    last_post_date,
    CASE 
        WHEN rank <= 10 THEN 'Top 10'
        WHEN rank <= 50 THEN 'Top 50'
        ELSE 'Other'
    END as category
FROM ranked_users
WHERE rank <= 100
ORDER BY rank;
```

## 数学公式和科学内容

### 基础数学

行内公式：`x² + y² = z²`，块级公式：

```
E = mc²
```

### 复杂数学表达式

```
∫₀^∞ e^(-x²) dx = √π/2
```

```
∑ᵢ₌₁ⁿ i² = n(n+1)(2n+1)/6
```

### 化学公式

化学反应：`2H₂ + O₂ → 2H₂O`

平衡常数：`K = [H₂O]² / ([H₂]² × [O₂])`

## 特殊字符和Unicode

### 特殊符号

- 箭头：← → ↑ ↓ ↔ ↕ ⇐ ⇒ ⇑ ⇓ ⇔ ⇕
- 数学符号：± × ÷ √ ∞ ≠ ≤ ≥ ≈ ≡
- 货币符号：$ € £ ¥ ₽ ₹ ₩
- 版权符号：© ® ™ ℠

### 表情符号

😀 😃 😄 😁 😆 😅 🤣 😂 😊 😇
🚀 ⭐ 💡 🔥 💯 🎯 🎉 🎊 🎈 🎁
🌍 🌎 🌏 🌐 🌱 🌲 🌳 🌴 🌵 🌾

### 中文标点

，。！？；：""''（）【】《》…—

## 任务列表和进度

### 项目进度

- [x] **项目规划**
  - [x] 需求分析
  - [x] 技术选型
  - [x] 架构设计
- [ ] **开发实施**
  - [x] 前端基础框架
  - [ ] 后端API开发
  - [ ] 数据库设计
- [ ] **测试部署**
  - [ ] 单元测试
  - [ ] 集成测试
  - [ ] 部署上线

### 功能检查清单

- [x] Markdown基础语法
- [x] 代码高亮
- [x] 表格支持
- [x] 数学公式
- [x] 任务列表
- [x] 链接和图片
- [ ] 自定义样式
- [ ] 导出功能

## 性能测试内容

### 大量重复内容

这是一个重复的段落，用来测试渲染性能。Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

这是一个重复的段落，用来测试渲染性能。Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

这是一个重复的段落，用来测试渲染性能。Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

### 长列表

- 列表项 1：这是一个很长的列表项描述，用来测试列表渲染性能。Lorem ipsum dolor sit amet, consectetur adipiscing elit.
- 列表项 2：这是一个很长的列表项描述，用来测试列表渲染性能。Lorem ipsum dolor sit amet, consectetur adipiscing elit.
- 列表项 3：这是一个很长的列表项描述，用来测试列表渲染性能。Lorem ipsum dolor sit amet, consectetur adipiscing elit.
- 列表项 4：这是一个很长的列表项描述，用来测试列表渲染性能。Lorem ipsum dolor sit amet, consectetur adipiscing elit.
- 列表项 5：这是一个很长的列表项描述，用来测试列表渲染性能。Lorem ipsum dolor sit amet, consectetur adipiscing elit.

## 总结

这个综合测试文件包含了：

1. **基础语法**：标题、段落、列表、链接、图片
2. **文本格式**：粗体、斜体、删除线、行内代码
3. **代码块**：多种编程语言的语法高亮
4. **表格**：复杂表格和格式化
5. **引用**：多层嵌套引用
6. **数学公式**：行内和块级数学表达式
7. **特殊字符**：Unicode符号和表情符号
8. **任务列表**：嵌套任务列表
9. **性能测试**：大量重复内容

通过这些内容的组合，可以全面测试Markdown渲染器的功能和性能表现。
