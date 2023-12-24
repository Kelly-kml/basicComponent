---
group:
  title: 通用组件
---

# Loading

`Loading` 组件，主要是为了缓解页面加载白屏的问题，实现一个页面缓冲的效果。

主要功能 🎉：

- 基于 `ant Design Loading` 封装的图标组件

---

## 常用示例

---

### 基本使用

```tsx
import { Loading } from 'KellyCOM';

const Demo = () => {
  return (
    <div>
      <Loading />
    </div>
  );
};

export default Demo;
```
