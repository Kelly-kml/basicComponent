---
group:
  title: hooks
  order: 1
nav:
  title: useDebounce
  order: 2
---

# useDebounce

防抖就是在事件触发后，在规定时间内只会执行一次，重新触发这个了这个事件，则会重新计时（一般用于搜索框内输入字段）。

简单来说就像打游戏，防抖函数的执行就像是在回城，如果回城时就被打断，再次回城的话，需要重新计时。

**防抖函数 一个需要频繁触发的函数，在规定时间内，只让最后一次生效，前面的不生效**

### 常见应用

input 的输入，value 需要设置防抖，保证是数据输入完成再记录 value 的值，如果还没输入完毕需要设置防抖，暂时不记录 value 的值

### 基本使用

```tsx | pure
import { useDebounce } from 'KellyCOM';
import { useState } from 'react';
const Home = (props) => {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);

  const [cancel] = useDebounce(
    () => {
      setB(a);
    },
    2000,
    [a],
  );

  const changeIpt = (e) => {
    setA(e.target.value);
  };

  return (
    <div>
      <Input type="text" onChange={changeIpt} onCancel={cancel} />
      {b} {a}
    </div>
  );
};
```
