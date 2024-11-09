import type { DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'

const Components: DefaultTheme.SidebarItem[] = [
  {
    text: '基础',
    collapsed: false,
    items: [
      { text: 'Button', link: '/components/button' },
      { text: 'ElButtonGroups', link: '/components/ElButtonGroups' },
      // { text: 'Link', link: '/components/link' },
      // { text: 'Text', link: '/components/text' },
    ],
  },
]

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'x-dev-tools',
  description: 'x-dev-tools',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config

    sidebar: [
      {
        text: '组件',
        items: Components,
      },
    ],
  },
})
