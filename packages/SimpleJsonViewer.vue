<template>
  <div class="text-left c-slate-600 text-sm font-mono">
    <div class="flex items-center " ref="itemRef" v-if="modelValue || depth > 0">
      <!-- object -->
      <div v-if="valueType === 'object'">
        <div v-if="!expand" class="flex items-center">
          <div :class="buttonCls" v-if="depth === 0" @click="expand = !expand">
            <i size="16" class="i-mdi-chevron-right"></i>
          </div>
          <div class="cursor-pointer mx-2" @click="expand = true">
            {
            <span class="hover:bg-gray-100 rd-1 active:bg-gray-200">...</span>
            }
          </div>
          <div class="c-gray-400 text-xs italic">
            {{ Object.keys(modelValue as Object).length }} {{ singularOrPlural(modelValue) }}
          </div>
          <div :class="buttonCls" v-if="!isOutside" @click="copyContent(modelValue)">
            <i size="12" class="c-green-600 i-mdi-check" v-if="copied"></i>
            <i size="12" class="i-mdi-content-copy" v-else></i>
          </div>
        </div>
        <div v-else class="flex flex-col">
          <div class="flex items-center">
            <div :class="buttonCls" v-if="depth === 0" @click="expand = !expand">
              <i size="16" class="i-mdi-chevron-down"></i>
            </div>
            {
            <span class="c-gray-400 text-xs italic ml-2">
              {{ Object.keys(modelValue as Object).length }} {{ singularOrPlural(modelValue) }}
            </span>
            <div :class="buttonCls" v-if="!isOutside" @click="copyContent(modelValue)">
              <i size="12" class="c-green-600 i-mdi-check" v-if="copied"></i>
              <i size="12" class="i-mdi-content-copy" v-else></i>
            </div>
          </div>

          <teleport :to="teleportTo" :disabled="!teleportTo">
            <div class="relative pl-9.5px">
              <!-- left line -->
              <div class="absolute h-100% w-1px bg-gray-200 top-0"></div>

              <!-- children -->
              <div v-for="[key, value] in Object.entries(modelValue as Object)" :key="key"
                class="flex flex-col pl-15px">
                <div class="flex">
                  <div :class="buttonCls" v-if="checkExpandable(key)" @click="toggleExpand(key)">
                    <i size="16" :class="childrenRefMap[key]?.expand ? 'i-mdi-chevron-down' :
                      'i-mdi-chevron-right'"></i>
                  </div>
                  <div class="mr-2">"{{ key }}":</div>
                  <simple-json-viewer :model-value="value" :depth="depth + 1"
                    :ref="(node) => { updateChildrenRef(node as ChildrenRefType, key) }"
                    :initial-expanded-depth="initialExpandedDepth"
                    :teleportTo="teleportMap['obj-' + key]" />
                </div>
                <div :ref="elem => updateTeleportMap(elem as HTMLElement, 'obj-' + key)"></div>
              </div>
            </div>
            <div class="pl-8px">}</div>
          </teleport>
        </div>
      </div>

      <!-- array -->
      <div v-else-if="valueType === 'array'">
        <div v-if="!expand" class="flex items-center">
          <div :class="buttonCls" v-if="depth === 0" @click="expand = !expand">
            <i size="16" class="i-mdi-chevron-right"></i>
          </div>
          <div class="cursor-pointer mx-2" @click="expand = true">
            [
            <span class=" hover:bg-gray-100 rd-1 active:bg-gray-200">...</span>
            ]
          </div>
          <div class="c-gray-400 text-xs italic">
            {{ (modelValue as unknown[]).length }} {{ singularOrPlural(modelValue) }}
          </div>
          <div :class="buttonCls" v-if="!isOutside" @click="copyContent(modelValue)">
            <i size="12" class="c-green-600 i-mdi-check" v-if="copied"></i>
            <i size="12" class="i-mdi-content-copy" v-else></i>
          </div>
        </div>
        <div v-else class="flex flex-col">
          <div class="flex items-center">
            <div :class="buttonCls" v-if="depth === 0" @click="expand = !expand">
              <i size="16" class="i-mdi-chevron-down"></i>
            </div>
            [
            <span class="c-gray-400 text-xs italic ml-2">
              {{ (modelValue as unknown[]).length }} {{ singularOrPlural(modelValue) }}
            </span>
            <div :class="buttonCls" v-if="!isOutside" @click="copyContent(modelValue)">
              <i size="12" class="c-green-600 i-mdi-check" v-if="copied"></i>
              <i size="12" class="i-mdi-content-copy" v-else></i>
            </div>
          </div>

          <teleport :to="teleportTo" :disabled="!teleportTo">
            <div class="relative pl-9.5px">
              <!-- left line -->
              <div class="absolute h-100% w-1px bg-gray-200 top-0"></div>

              <!-- children -->
              <div v-for="item, index in modelValue" :key="index" class="flex pl-15px flex-col">
                <div class="flex">
                  <div :class="buttonCls" v-if="checkExpandable(index)" @click="toggleExpand(index)">
                    <i size="16" :class="childrenRefMap[index]?.expand ? 'i-mdi-chevron-down' :
                      'i-mdi-chevron-right'" class="inline-block"></i>
                  </div>
                  <div class="mr-2 c-indigo-600">
                    {{ index }}:
                  </div>
                  <simple-json-viewer :model-value="item" :depth="depth + 1"
                    :ref="(node) => { updateChildrenRef(node as ChildrenRefType, index) }"
                    :initial-expanded-depth="initialExpandedDepth"
                    :teleportTo="teleportMap['arr-' + index]" />
                </div>
                <div :ref="elem => updateTeleportMap(elem as HTMLElement, 'arr-' + index)"></div>
              </div>
            </div>
            <div class="pl-8px">]</div>
          </teleport>
        </div>
      </div>

      <div v-else :class="typeColorMap[valueType]" class="break-all">
        <span v-if="valueType === 'string'">"{{ modelValue }}"</span>
        <span v-else-if="['function', 'symbol'].includes(valueType)" class="fw-bold capitalize">{{
          valueType
        }}</span>
        <span v-else>{{ modelValue + '' }}</span>

        <!-- copy btn -->
        <div :class="buttonCls" v-if="!['array', 'object'].includes(valueType) && !isOutside"
          @click="copyContent(['function', 'symbol'].includes(valueType) ? modelValue : modelValue + '')"
          class="important:h-0 translate-y-2px">
          <i class="c-green-600 i-mdi-check" v-if="copied"></i>
          <i v-else class="i-mdi-content-copy"></i>
        </div>
      </div>

    </div>
    <div v-else class="text-sm c-gray-600">
      No data :/
    </div>
  </div>
</template>

<script setup lang="ts">
import { useClipboard, useMouseInElement } from '@vueuse/core'
import { ComponentPublicInstance, computed, ref, watch } from 'vue'

interface ExposedState {
  valueType: string
  expand: boolean
  toggleExpand: () => void
}

type ChildrenRefType = ComponentPublicInstance<ExposedState>

const props = withDefaults(defineProps<{
  modelValue: unknown
  depth?: number
  initialExpandedDepth?: number
  teleportTo?: HTMLElement
}>(), {
  depth: 0,
  initialExpandedDepth: 0,
})

const buttonCls = "w-20px h-20px rd-50% inline-flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 cursor-pointer shrink-0 c-slate-600"
const typeColorMap: Record<string, string> = {
  string: 'c-amber-600',
  number: 'c-blue-600',
  bigint: 'c-blue-900',
  symbol: 'c-pink-600',
  undefined: 'c-gray-400',
  null: 'c-red-600',
  function: 'c-purple-600',
  boolean: 'c-blue-600',
}

const childrenRefMap = ref<Record<string, ChildrenRefType>>({})
const expand = ref<boolean>(props.depth < props.initialExpandedDepth)
const itemRef = ref<HTMLElement>()
const copied = ref(false)
const teleportMap = ref<Record<string, HTMLElement>>({})
const { isOutside } = useMouseInElement(itemRef)
const valueType = computed(() => getValueType(props.modelValue))

function getValueType(value: unknown) {
  const obviousType = typeof value
  if (obviousType === 'object') {
    const [, actualType] = Object.prototype.toString.call(value).match(/\s(.*?)]/)!
    return actualType.toLowerCase() as 'array' | 'object'
  } else {
    return obviousType
  }
}

function updateChildrenRef(node: ComponentPublicInstance<ExposedState>, key: string) {
  childrenRefMap.value[key] = node
}

function updateTeleportMap(node: HTMLElement, key: string) {
  teleportMap.value[key] = node
}

function checkExpandable(key: string) {
  return ['array', 'object'].includes(childrenRefMap.value[key]?.valueType)
}

function toggleExpand(key: string) {
  childrenRefMap.value[key]?.toggleExpand?.()
}

function copyContent(content: unknown) {
  const type = getValueType(content)
  const contentStr = (type === 'string' ? content : JSON.stringify(content) || type) as string

  const clipboard = useClipboard()
  clipboard.copy(contentStr)

  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

function singularOrPlural(items: unknown) {
  const length = Object.keys(items as object).length
  return length > 1 ? 'items' : 'item'
}

watch(expand, () => {
  childrenRefMap.value = {}
  teleportMap.value = {}
})


defineExpose({
  valueType,
  expand,
  toggleExpand() {
    expand.value = !expand.value
  }
})
</script>