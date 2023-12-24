<!--
 * @Description:
 * @author: kelly
 * @Date: 2023-10-25 17:26:17
 * @LastEditTime: 2023-12-24 12:38:16
-->

---

title: 快速开始
order: 2
nav:
path: /guide

---

# 快速开始

`basic-component` 封装了项目大部分的公共组件、Hook、以及常用工具函数

## 安装使用

`basic-component` 发布在个人 Github
<a href="https://github.com/Kelly-kml" target="_blank">私有仓库</a>
在使用前，必须修改`npm源地址`

```shell
# 全局安装源管理工具
npm i -g nrm

```

<!--
_`注意：如果切换后无法安装依赖，请检查全局 .npmrc 文件仅保留 registry=http://172.16.8.10:8081/repository/npm-all/ 此行，删除其他重新安装`_ -->

## 开发环境搭建

现有接入门户项目几乎都是采用`微前端`架构。每个模块作为一个子应用独立开发部署。

为了解决开发环境跨域问题，建议使用 `Nginx` 统一代理，更符合生产实际环境。_`暂时无法热更新`_
