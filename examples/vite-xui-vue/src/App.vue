<script setup lang="ts">
import { ref } from 'vue'

const checked2 = ref(false)

function handleSetCheck() {
  checked2.value = !checked2.value
}
</script>

<template>
  <div wrapper gap-2>
    <x-button disabled type="primary" @click="handleSetCheck">
      {{ checked2 ? 'uncheck' : 'check' }} value2
    </x-button>
    <x-el-button-groups />
  </div>
</template>

<style>
:root{
  background-color: #ffffff;
  color: #222222;
}

.dark {
  background-color: #1a1817;
  color: #ffffff;
}
</style>
