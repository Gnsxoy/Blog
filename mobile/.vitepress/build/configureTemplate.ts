import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Gnsxoy",
  description: "这里是 Gnsxoy 的个人博客，学习记录，技术分享。",
  base: "/",
  themeConfig: {
    logo: '/avatar.jpg',
    search: {
      provider: 'local'
    },
    footer: {
      message: "Powered by Vitepress",
      copyright: 'Copyright © 2024 <a href="https://github.com/gnsxoy">Gnsxoy</a>'
    },

    // https://vitepress.dev/reference/default-theme-config
    nav: [],
    sidebar: [],
    socialLinks: [],
  },
  lastUpdated: true, // 开启最后更新时间
})
