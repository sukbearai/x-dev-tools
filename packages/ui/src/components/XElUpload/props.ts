import type { ExtractPropTypes } from 'vue'
import { disabled, loadable, readonly, sizeable } from '@/composables/useProps'

export const xElUploadProps = {
  size: sizeable,
  disabled,
  readonly,
  loading: loadable,
  onParseExcelSuccess: {
    type: Function,
    default: () => {},
  },
}

export type XElUploadProps = ExtractPropTypes<typeof xElUploadProps>
