<script lang='ts' setup>
import { ref, useAttrs } from 'vue'
import { ElButton, ElUpload } from 'element-plus'
import type { UploadFile, UploadInstance } from 'element-plus'
import { parseExcel } from '@suwujs/utils'
import { xElUploadProps } from './props'

defineOptions({
  name: 'XElUpload',
})

const props = defineProps(xElUploadProps)

defineSlots<{
  trigger: () => any
  tip: () => any
}>()

const uploadRef = ref<UploadInstance>()
const attrs = useAttrs()

async function handleChange(file: UploadFile) {
  try {
    const data = await parseExcel(file.raw!)
    // 发送解析成功事件
    props.onParseExcelSuccess?.(data)
  }
  catch (error) {
    console.error('Parse excel failed:', error)
  }
}
</script>

<template>
  <ElUpload
    ref="uploadRef"
    :auto-upload="false"
    v-bind="attrs"
    action="#"
    :on-change="handleChange"
  >
    <template #trigger>
      <slot name="trigger">
        <ElButton type="primary">
          上传文件
        </ElButton>
      </slot>
    </template>
    <template #tip>
      <slot name="tip" />
    </template>
  </ElUpload>
</template>
