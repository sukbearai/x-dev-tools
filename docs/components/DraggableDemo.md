---
outline: deep
---

# useDraggable

强大的基于 HTML5 拖放 API 的可组合式拖拽函数，支持自定义数据结构和灵活的拖拽位置控制

<x-draggable-demo />

### <i i-logos-vue /> useDraggable.ts

```ts
/* eslint-disable ts/no-unsafe-function-type */
import { ref } from 'vue'

// eslint-disable-next-line no-restricted-globals
const target = typeof window === 'undefined' ? global : window

const raf = target.requestAnimationFrame
const caf = target.cancelAnimationFrame

export { raf, caf }

export type DropPosition = -1 | 0 | 1 // -1: 放在目标之前, 0: 成为子节点, 1: 放在目标之后

export function throttleByRaf(cb: (...args: any[]) => void) {
  let timer = 0

  const throttle = (...args: any[]): void => {
    if (timer)
      caf(timer)

    timer = raf(() => {
      cb(...args)
      timer = 0
    })
  }

  throttle.cancel = () => {
    caf(timer)
    timer = 0
  }

  return throttle
}

/**
 * 可拖拽组合函数
 * @param id - 拖拽元素的唯一标识
 * @returns {object} 返回拖拽相关的状态和处理函数
 * @property {Ref<boolean>} isDragOver - 是否正在拖拽经过当前元素
 * @property {Ref<DropPosition>} dropPosition - 拖拽放置位置(-1: 放在目标之前, 0: 成为子节点, 1: 放在目标之后)
 * @property {Function} handleDragStart - 开始拖拽的处理函数
 * @property {Function} handleDragOver - 拖拽经过的处理函数
 * @property {Function} handleDragLeave - 拖拽离开的处理函数
 * @property {Function} handleDrop - 拖拽放置的处理函数
 */
export function useDraggable(id: number) {
  const isDragOver = ref(false)
  const dropPosition = ref<DropPosition>(0)

  const updateDropPosition = throttleByRaf((e: DragEvent, element: HTMLElement) => {
    const rect = element.getBoundingClientRect()
    const offsetY = window.pageYOffset + rect.top
    const { pageY } = e
    const gapHeight = rect.height / 4
    const diff = pageY - offsetY

    if (diff < gapHeight)
      dropPosition.value = -1
    else if (diff < rect.height - gapHeight)
      dropPosition.value = 0
    else
      dropPosition.value = 1
  })

  const handleDragStart = (e: DragEvent) => {
    if (e.dataTransfer) {
      e.dataTransfer.setData('text/plain', id.toString())
      e.dataTransfer.effectAllowed = 'move'
    }
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    if (!isDragOver.value)
      isDragOver.value = true

    if (e.currentTarget instanceof HTMLElement)
      updateDropPosition(e, e.currentTarget)
  }

  const handleDragLeave = () => {
    isDragOver.value = false
    dropPosition.value = 0
    updateDropPosition.cancel()
  }

  const handleDrop = (e: DragEvent, emit: Function) => {
    e.preventDefault()
    const draggedId = Number(e.dataTransfer?.getData('text/plain'))
    emit('sort', draggedId, id, dropPosition.value)
    isDragOver.value = false
    dropPosition.value = 0
    updateDropPosition.cancel()
  }

  return {
    isDragOver,
    dropPosition,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  }
}
```

### <i i-logos-vue /> DraggableItem.vue

```vue
<script setup lang="ts">
import { useDraggable } from '@/composables/useDraggable'

interface Props {
  id: number
  text: string
}

const props = defineProps<Props>()

const { isDragOver, dropPosition, handleDragStart, handleDragOver, handleDragLeave, handleDrop } = useDraggable(props.id)
</script>

<template>
  <li
    draggable="true"
    class="drag-item"
    :class="{
      'is-over': isDragOver,
      [`drop-${dropPosition}`]: isDragOver,
    }"
    @dragstart="handleDragStart"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="(e) => handleDrop(e, $emit)"
  >
    {{ text }}
  </li>
</template>

<style scoped>
.drag-item {
  padding: 10px 15px;
  background: #fff;
  border: 1px solid #ddd;
  margin: 5px 0;
  cursor: move;
  position: relative;
}

.is-over {
  background: #f5f5f5;
}

.drop--1::before {
  content: '';
  position: absolute;
  top: -3px;
  left: 0;
  right: 0;
  height: 2px;
  background: #2196f3;
}

.drop-1::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  right: 0;
  height: 2px;
  background: #2196f3;
}

.drop-0 {
  border: 2px solid #2196f3;
}
</style>
```

### <i i-logos-vue /> Demo.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
import DraggableItem from './DraggableItem.vue'

// 示例数据
const items = ref([
  { id: 1, text: '项目 1' },
  { id: 2, text: '项目 2' },
  { id: 3, text: '项目 3' },
  { id: 4, text: '项目 4' },
])

// 处理排序
function handleSort(draggedId: number, targetId: number, position: number) {
  const draggedIndex = items.value.findIndex(item => item.id === draggedId)
  const targetIndex = items.value.findIndex(item => item.id === targetId)
  const draggedItem = items.value[draggedIndex]

  // 从原位置删除
  items.value.splice(draggedIndex, 1)

  // 根据放置位置插入
  let newIndex = targetIndex
  if (position === 1)
    newIndex++
  items.value.splice(newIndex, 0, draggedItem)
}
</script>

<template>
  <div class="draggable-demo">
    <h2>拖拽排序示例</h2>
    <ul class="draggable-list">
      <DraggableItem
        v-for="item in items"
        :id="item.id"
        :key="item.id"
        :text="item.text"
        @sort="handleSort"
      />
    </ul>
  </div>
</template>

<style scoped>
.draggable-demo {
  padding: 20px;
}

.draggable-list {
  list-style: none;
  padding: 0;
  width: 300px;
}
</style>
```
