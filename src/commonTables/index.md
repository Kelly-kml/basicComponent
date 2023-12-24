---
group:
  title: 通用组件
---

# BasicTable

`BasicTable` 的诞生是为了解决项目中需要写很多 table 的样板代码的问题，所以在其中做了封装了很多常用的逻辑。
这些封装可以简单的分类为预设行为与预设逻辑。

**功能特点：**

- 常规后台分页查询
- 前端分页查询
- 扩展常用 column 列配置，例如，状态按钮渲染、复制当前单元格数据、普通头部查询、高级搜索，动态配置可见列等功能
- 支持列自由拖拽宽度
- 支持拖拽排序列表行、配置可见列表
- 支持 _查询参数_ 数据转换，适用各种奇葩接口的 table
- 🎉 一键开启`选择全部页`功能
- 🔥 支持可编辑列表，单行编辑、多行编辑、全部编辑，可配置单元格编辑。

---

## 常用示例

---

### 后台查询分页表格

在日常开发中，最为常用的表格，后台接口分页

如果需要选择多行功能，搭配 [useTableRowSelection]() 食用更加优雅 🛩️

<code src="./demos/SearchTable.tsx"></code>

### 头部指定字段查询的后台分页表格

<code src="./demos/SearchHeadTable.tsx"></code>

### 本地数据查询分页表格

<code src="./demos/LocalTable.tsx"></code>

### 选择所有项

在业务开发中，存在选择所有数据功能，使用例子如下

<code src="./demos/SelectedAll.tsx"></code>

### 可编辑列表

在业务开发过程中，存在编辑表格，通常有 _单行编辑_、 _多行编辑_ 、 _全部编辑_ 这几种类型，下面 👇 例子为全部编辑

_`例子：数据库服务-MySQL集群-运维操作-MySQL恢复到指定时间点`_

<code src="./demos/Edittable.tsx"></code>

### 跳转页面保留查询结果

通常在业务开发中需要查看详情，然后退回到页面需要保留原有的查询数据。

实现：调用 `tableRef.current.historyPush` 方法，会在路由跳转前保存当前查询数据到 _sessionStorage_ 中.

`为何不使用类似Vue中keep-alive的路由缓存? 实现比较麻烦，现在路由集中配置在权限中心；存在在详情中修改更新了数据，返回列表的时候应该重新更新数据情况`

## API

BasicTable 在 antd 的 Table 上进行了一层封装，支持了一些预设，并且封装了一些行为。这里只列出与 antd Table 不同的 api。

| 属性               | 描述                                                                    | 类型                                                                                                       | 默认值  |
| ------------------ | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------- |
| columns `必`       | 基于原有 antd table 扩展的列配置                                        | `BasicTableColumnsType` [配置项](#columns)                                                                 | -       |
| request            | 获取 `dataSource` 的方法                                                | `(params?: {pageSize: number;current: number;[key: string]: any;},sort,filter) => Promise<RequestData<T>>` | -       |
| emptyColumnsRender | 列为空时展示，默认展示`-`                                               | `(text) => ReactNode`                                                                                      | -       |
| immediate          | 是否需要初次加载获取列表数据，在异步条件的时候设计为 false，默认为 true | `boolean`                                                                                                  | `true`  |
| tableRef           | 对外暴露在 ref 上的方法，通过类似`tableRef.current?.onSearch({})`调用   | `Ref<BasicTableRef<T>>`                                                                                    | -       |
| postData           | 修改或者获取接口返回的列表数据                                          | `(dataSource) => dataSource \| void`                                                                       | -       |
| enableAutoRefresh  | 开启自动刷新 table 数据功能，为`number`时视为多少秒频率刷新             | `boolean \| number`                                                                                        | `false` |
| enableAllSelection | 是否开启选择所有页功能                                                  | `boolean`                                                                                                  | `false` |
| isResizable        | 列是否可拖动伸缩宽度，**注意需要配置每列宽度且为数字类型**              | `boolean`                                                                                                  | `false` |
| isSortable         | 行是否允许拖拽排序                                                      | `boolean`                                                                                                  | `false` |
| isLocal            | 是否是本地前端分页、查询、排序功能                                      | `boolean`                                                                                                  | `false` |
| hiddenHead         | 是否隐藏列表头部工具栏                                                  | `boolean`                                                                                                  | `false` |
| hiddenHighSearch   | 是否隐藏高级搜索功能                                                    | `boolean`                                                                                                  | `false` |

### columns

列描述数据对象，是 columns 中的一项，Column 使用相同的 API。 扩展原有属性，支持搜索、高级搜索、可复制、常用状态展示等一列基本选项。

| 属性         | 描述               | 类型                                   | 默认值 |
| ------------ | ------------------ | -------------------------------------- | ------ |
| search       | 搜索、高级搜索配置 | `Search`[配置项](#Search)              | -      |
| copyable     | 内容是否可复制     | `boolean`                              | -      |
| statusRender | 常用状态渲染       | `tag、text、dotText`                   | -      |
| valueEnum    | 列值枚举           | `{val: ValueEnum}`[配置项](#ValueEnum) | -      |

#### Search

在配置列的时候，可以通过`search`属性配置该列是否是查询项

| 属性      | 描述       | 类型                        | 默认值 |
| --------- | ---------- | --------------------------- | ------ |
| type `必` | 搜索项类型 | `Input、Select、DatePicker` | -      |

#### ValueEnum

值枚举渲染

| 属性      | 描述     | 类型                                      | 默认值 |
| --------- | -------- | ----------------------------------------- | ------ |
| text `必` | 渲染 dom | `ReactNode \| ((text: any) => ReactNode)` | -      |
