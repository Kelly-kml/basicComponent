/*
 * @Description:
 * @author: kelly
 * @Date: 2023-10-15 13:27:07
 * @LastEditTime: 2023-10-26 12:15:50
 */
import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'KellyCOM',
    nav: [
      { title: '介绍', link: '/guide' },
      { title: '组件', link: '/components/Button' },
    ],
  },
  // styles: [
  //   `.dumi-default-header-left {
  //      width: 220px !important;
  //   }`,
  // ],
  // logo: './public/logo.png',
});
