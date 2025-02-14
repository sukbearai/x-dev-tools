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
