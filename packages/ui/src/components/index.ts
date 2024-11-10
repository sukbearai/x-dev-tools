import type { Plugin } from 'vue'
import { XButton } from './XButton'
import { XElButtonGroups } from './XElButtonGroups'

export default [
  XButton,
  XElButtonGroups,
  // 其他组件
] as unknown as Plugin[]
