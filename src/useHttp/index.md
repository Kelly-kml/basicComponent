---
group:
  title: hooks
nav:
  title: useHttp
  order: 0
---

# useHttp

`useHttp` 是最常用的 hook，主要功能也非常单一，仅仅是默认格式化返回的数据。

`useHttp 支持默认返回TS类型提示噢～`

通常后端返回的数据格式如下：

```json
{
  "code": 0,
  "data": [
    {
      "name": "王八",
      "age": 18
    }
  ],
  "msg": "获取成功"
}
```

但是我们调用的时候，`每次都需要判断code是否为0，在取data属性的值`，因此，`useHttp` 就是为了解决这个问题。

**`假如不需要默认的返回和提示，只需要传入formatResult函数自行定义即可`**

## 基本使用

默认格式化后端返回数据

```tsx | pure
import { useHttp } from 'KellyCOM';
import { FC } from 'react';

type DataProps = Promise<{
  code: number;
  data: Array<{ name: string; age: number }>;
  msg: string;
}>;

const getData = (): DataProps =>
  new Promise((resolve, reject) => {
    resolve({
      code: 0,
      data: [{ name: '王八', age: 18 }],
      msg: '',
    });
  });

const Demo: FC = () => {
  const { data } = useHttp(getData, {
    /** 如果需要自定义返回格式
    formatResult(res) {
      return res
    }
    */
  });

  console.log(data); // [{name: '王八', age: 18}]
};
```

## API

<a href="https://ahooks.gitee.io/zh-CN/hooks/async" target="_blank">完全继承于 ahooks 的 useRequest</a>
