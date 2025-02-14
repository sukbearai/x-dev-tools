import type { Plugin } from 'vue'
import { XButton } from './XButton'
import { XElButtonGroups } from './XElButtonGroups'
import { XElUpload } from './XElUpload'
import { XDraggableDemo } from './XDraggableDemo'

export default [
  XButton,
  XElButtonGroups,
  XElUpload,
  XDraggableDemo,
  // 其他组件
] as unknown as Plugin[]
