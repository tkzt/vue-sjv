# Simple Json Viewer

This is a deadly simple Vue3 JSON viewer component, just as it is named.


## Demo

[Here](https://sjv.tkzt.cn) is what it looks like.


## Getting Started

### Before everything

A Vue3 project.

### Installation

```
npm i vue-sjv
```

### Usage/Examples

```html
<template>
  <div>
    <SimpleJsonViewer :model-value="{foo: 'bar'}" />
  </div>
</template>
<script lang="ts" setup>
import { SimpleJsonViewer } from 'vue-sjv';
</script>
```