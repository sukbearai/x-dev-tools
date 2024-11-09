import type { ExtractPropTypes } from 'vue'
import { disabled, loadable, readonly, sizeable } from '@/composables/useProps'

export const elButtonGroupsProps = {
  size: sizeable,
  disabled,
  readonly,
  loading: loadable,
}

export type XElButtonGroupsProps = ExtractPropTypes<typeof elButtonGroupsProps>
