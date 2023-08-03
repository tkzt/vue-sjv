<script setup lang="ts">
import { onMounted, ref } from 'vue';
import SimpleJsonViewer from '../packages'
import '../dist/style.css'
import Mock from 'mockjs'

const jsonValue = ref(null)

function refreshJson() {
  jsonValue.value = {
    ...Mock.mock({
      'root|5-10': [{
        'foo': '@string(15, 400)',
        'bar|1': ['@boolean', '@int', '@float'],
        'quz|1': [null, undefined, NaN]
      }],
    }), func() { }, sym: Symbol()
  }
}

onMounted(() => {
  refreshJson()
})
</script>

<template>
  <div class="
    text-center text-sm pa-2 c-gray-700 b-1 b-solid b-gray-200 rd-2 mb-4 w-fit bg-slate-800 c-white
    hover:bg-slate-700 active:bg-slate-600 cursor-pointer select-none
  " @click="refreshJson">
    Refresh
  </div>
  <div class="pa-2 rd-2 bg-white w-fit box-border max-w-200">
    <SimpleJsonViewer :model-value="jsonValue" />
  </div>
</template>