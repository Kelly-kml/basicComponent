---
title: basicHttp - 网络请求
order: 1
nav:
  title: 工具类
  path: /utils
  order: 3
group:
  path: /
---

# basicHttp

`basicHttp` 基于
<a href="https://www.npmjs.com/package/basic-axios-request" target="_blank">basic-axios-request</a>
封装。集成基于权限中心的校验逻辑，默认包含基础白名单、请求头权限、权限失效请求刷新 token 等配置，您可以重新覆盖默认配置

主要功能 🎉：

- `access_token` 失效后会判断失效时间决定是否请求 `refresh_token（默认为：/api/upms/auth/refreshtoken）` 接口更新权限数据
- 支持文件上传和下载
- 支持文件默认下载同时也支持文件自定义下载处理
- 支持自定义扩展`请求前` 、`请求后拦截`

---

## 使用示例

在项目中新建 `utils/Http.ts` 文件

---

### 基本使用

```ts | pure
import { Utils } from '@lt38.03/basic-component';

export default Utils.basicHttp();
```

### 配置请求白名单

```ts | pure
import { Utils } from '@lt38.03/basic-component';

export default Utils.basicHttp({
  whitelist: [
    /**
     * 白名单接口配置
     * 默认配置了 '/login', '/auth/refreshtoken', '/upms/anon/tenant'
     * 如果没有特殊情况无需重新配置白名单
     */
  ],
});
```

### 默认文件下载

```ts | pure
import Http from '@/utils/Http';

export const downloadFile = () => Http.get('/api/download');
```

### 自定义文件下载处理

```ts | pure
import Http from '@/utils/Http';

export const downloadFile = () =>
  Http.get('/api/download', {
    /**
     * 注意，默认封装 responseType = 'blob' 或者 application/vnd.ms-excel
     * 其他需要在此定义说明确定是下载文件类型
     */
    isDownloadFile: true,
    manualDownload: true, // 自定义下载，非默认
    downloadFileName: 'xxx.excel', // 前端定义下载文件名，默认采用后端请求头content-disposition属性值返回的文件名
  });
```

## API

`basicHttp` 函数参数配置扩展于<a href="https://www.npmjs.com/package/basic-axios-request" target="_blank">basic-axios-request</a>

| 属性                       | 说明                                                                                                         | 类型                                                       | 默认值              |
| :------------------------- | :----------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------- | :------------------ |
| enabledDefaultLogic `(选)` | 是否采用 accessToken、refreshToken 逻辑，默认为 true，否则自行设置`beforeRequest`和`afterResponse`处理       | `boolean`                                                  | `true`              |
| getToken `(选)`            | 获取 accessToken、refreshToken 方法                                                                          | `() => ({accessToken: string; refreshToken: string})`      | `默认处理逻辑`      |
| updateAccessToken `(选)`   | 获取新的 accessToken 方法,返回 accessToken，在 accessToken 还有 5 分钟，或者默认过期 15 分钟内会重新调用请求 | `默认处理逻辑`                                             |
| accessTokenExpires `(选)`  | accessToken 有效时间，单位秒                                                                                 | `number`                                                   | 7200 秒             |
| axiosCreateConfig `(选)`   | `axios.create` 方法参数配置                                                                                  | `AxiosRequestConfig`                                       | `{baseURL: '/api'}` |
| whitelist `(选)`           | 接口白名单，不需要带 accessToken                                                                             | `string[]`                                                 | []                  |
| beforeRequest `(选)`       | axios request 拦截函数，如果有返回值，则返回的，没有拦截返回默认的请求配置                                   | `(config: AxiosRequestConfig) => AxiosRequestConfig｜void` | `默认处理逻辑`      |
| afterResponse `(选)`       | axios response 拦截函数，如果有返回值，则返回的，没有拦截返回默认的请求配置                                  | `(response: AxiosResponse) => any`                         | `默认处理逻辑`      |
| onResponseReject `(选)`    | response 响应错误后处理                                                                                      | `(error: AxiosError) => any`                               | -                   |
| logout `(选)`              | accessToken 超过有效时长太久，需要退出登录处理等                                                             | `() => void`                                               | -                   |
| accessTokenInvalid `(选)`  | accessToken 失效时长多久范围内，允许重新请求更新，默认 900 秒（15 分钟）                                     | `number`                                                   | 900                 |
