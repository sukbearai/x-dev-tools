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
  border: 1px solid #ddd;
  margin: 5px 0;
  cursor: move;
  position: relative;
}

.is-over {
  background: transparent;
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
