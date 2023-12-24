/*
 * @Description:
 * @author: kelly
 * @Date: 2023-10-25 22:08:22
 * @LastEditTime: 2023-10-25 22:38:00
 */
import { defineConfig } from 'dumi';

// let base = '/kelly-ui';
// let publicPath = '/kelly-ui/';

// if (process.env.SITE_BUILD_ENV === 'PREVIEW') {
//   base = undefined;
//   publicPath = undefined;
// }

export default defineConfig({
  title: 'KELLY UI',
  mode: 'site',
  outputPath: 'doc-site',
  exportStatic: {}, // 后续会部署到 github pages 直接全部生成静态页面 不走前端路由
  dynamicImport: {}, // 拆包 站点过大时可以优化首屏加载速度
  webpack5: {},
  // base,
  // publicPath,
  define: {
    isComponentDev: 'FALSE',
    isDocProd: 'FALSE',
  },
  locales: [{ id: 'zh-CN', name: '中文' }],
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
    ],
    [
      '@simbathesailor/babel-plugin-use-what-changed',
      {
        active: process.env.NODE_ENV === 'development',
      },
    ],
  ],
  headScripts: [``],
  chainWebpack(memo) {
    // memo.module
  },
  menus: {},
  styles: [
    `
    #root { width: 100%; height: 100%}
  `,
  ],
});
