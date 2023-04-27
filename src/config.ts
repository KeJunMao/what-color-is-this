import { computed, reactive, ref } from '@vue/reactivity'
import { workspace } from 'vscode'
import type { ColorEntry } from './types'

const _configState = ref(0)

function getConfig<T = any>(key: string): T | undefined {
  return workspace
    .getConfiguration()
    .get<T>(key)
}

async function setConfig(key: string, value: any, isGlobal = true) {
  // update value
  return await workspace
    .getConfiguration()
    .update(key, value, isGlobal)
}

function createConfigRef<T>(key: string, defaultValue: T, isGlobal = true) {
  return computed({
    get: () => {
      // to force computed update
      // eslint-disable-next-line no-unused-expressions
      _configState.value
      return getConfig<T>(key) ?? defaultValue
    },
    set: (v) => {
      setConfig(key, v, isGlobal)
    },
  })
}

export const config = reactive({
  inplace: createConfigRef('what-color-is-this.inplace', true),
  enabled: createConfigRef('what-color-is-this.enabled', true),
  colorNameMap: createConfigRef('what-color-is-this.colorNameMap', {}),
})

export const colorNameEntries = computed<ColorEntry[]>(() => Object.entries<string>(config.colorNameMap))

export async function onConfigUpdated() {
  _configState.value = +new Date()
}
