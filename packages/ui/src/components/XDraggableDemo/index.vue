<script setup lang="ts">
import { ref } from 'vue'
import DraggableItem from './DraggableItem.vue'

defineOptions({
  name: 'XDraggableDemo',
  inheritAttrs: false,
})

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

  // 从原位置删除，一定要先删除
  items.value.splice(draggedIndex, 1)

  // 根据放置位置插入
  let newIndex = targetIndex
  // 插到前面
  if (position === 1)
    newIndex++
  // 插入到后面
  else if (position === -1)
    newIndex = Math.max(0, targetIndex)
  items.value.splice(newIndex, 0, draggedItem)
}
</script>

<template>
  <div class="draggable-demo">
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
.draggable-list {
  list-style: none;
  padding: 0;
  width: 80%;
}
</style>
