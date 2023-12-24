---
group:
  title: hooks
nav:
  title: useHttp
  order: 3
---

# useTableRowSelection

`useTableRowSelection` 和 `BasicTable` 组件搭配使用，支持选择全部页功能。

### API

```tsx | pure
import { useTableRowSelection } from 'KellyCOM';
import { FC } from 'react';

const Demo: FC = () => {
  const status = useTableRowSelection();
  return <div>Demo</div>;
};

export default Demo;
```
