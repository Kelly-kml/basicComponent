---
group:
  title: hooks
nav:
  title: useThrottle
  order: 1
---

# useThrottle

节流就是规定在一个单位时间内，只能触发一次函数，如果这个单位时间内触发多次函数，只有一次生效，节流会稀释函数执行的次数，（大多数用户按钮的点击事件，在一定时间内无论点击多少次都只执行一次）
从游戏角度来说，节流就像是技能 CD，如果这次使用了，在规定的时间内，你再点击它，他也不会释放技能。

**节流函数 一个函数执行一次后，只有大于设定的执行周期才会执行第二次。有个需要频繁触发的函数，出于优化性能的角度，在规定时间内，只让函数触发的第一次生效，后面的不生效**

### 常见应用

某个 table 加载更多的功能中，需要设置节流，先判断此时是否处于接口请求阶段，如果是的话，就节流阀设置为 true，阻止接口的请求；如果否的话再进行接口的请求，加载下一页的数据。

### 基本使用

```tsx | pure
import { useThrottle } from 'KellyCOM';
import { useState } from 'react';
const Home = (props) => {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);

  const [cancel] = useThrottle(
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
