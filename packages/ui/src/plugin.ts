import type { App, Plugin } from 'vue'
import { version } from '../package.json'

const INSTALLED_KEY = Symbol('X_DEV_TOOLS_UI_Installed')

export function createInstaller(components: Plugin[] = []) {
  const install = (app: App) => {
    if ((app as any)[INSTALLED_KEY])
      return

    (app as any)[INSTALLED_KEY] = true
    components.forEach(c => app.use(c))
  }

  return {
    version,
    install,
  }
}
