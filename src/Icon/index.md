---
group:
  title: 通用组件
---

# Icon

`Icon` 组件，依赖阿里图标文件，加载来自公共静态资源下的[cdd-iconfont.js](http://172.16.200.21/common-static/cdd-iconfont.js)。

主要功能 🎉：

- 基于 `createFromIconfontCN` 封装的图标组件

注意事项 🎯：

- 图标来自[iconfont](https://www.iconfont.cn/)，生成的`Symbol` 类型图标
- 图标必须放在 `public目录下`

---

## 常用示例

---

### 基本使用

```tsx
import { Icon } from 'KellyCOM';

const Demo = () => {
  return (
    <div>
      <Icon type="UserOutlined" />
      <Icon type="type2" style={{ marginLeft: 20, fontSize: 24 }} />
    </div>
  );
};

export default Demo;
```

## API

<a href="https://ant-design.gitee.io/components/icon-cn/#components-icon-demo-basic" target="_blank">查看 Ant-Design Icon 图标使用</a>
