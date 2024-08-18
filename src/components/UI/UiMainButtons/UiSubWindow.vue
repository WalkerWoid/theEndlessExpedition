<script setup>
/**
 * Компонент подокна для кнопок сверху. Тут отображаются данные Рюкзака, Верстака и так далее */

import {onUpdated} from "vue";

const definedProps = defineProps(['currentTab', 'uiSubWindowIsVisible', 'resources', 'workbench'])
const definedEmits = defineEmits(['closeSubWindow'])

// onMounted(() => {
//   console.log('Подокно для кнопок сверху mounted')
//   console.log(definedProps.uiSubWindowIsVisible)
// })
onUpdated(() => {
  console.log(definedProps.currentTab)
  console.log('Подокно для кнопок сверху updated')
})
</script>

<template>
  <div class="subWindow ui__subWindow  main__texture" :class="{'_closed': !uiSubWindowIsVisible}">
    <span class="subWindow__close" @click="$emit('closeSubWindow', $event.target.parentNode)">Х</span>

    <div class="subWindow__wrapper">
      <Component :is="currentTab" v-if="currentTab.__name === 'Backpack'" :resources />
      <Component :is="currentTab" v-else-if="currentTab.__name === 'Workbench'" :workbench />
    </div>
  </div>
</template>

<style>
.ui__subWindow {
  bottom: 0;
  right: 0;
  width: 500px;
  height: 300px;
  border-radius: var(--radius) 0 0 0;
  padding: 0 15px 15px;
}
.ui__subWindow._closed {
  transform: translateY(100%);
}
</style>