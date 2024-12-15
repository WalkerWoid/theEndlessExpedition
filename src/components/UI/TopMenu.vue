<script setup>
/**
 * Компонент верхнего меню */
const activeWindow = defineModel('activeWindow')
const definedProps = defineProps({
  uiWindowsVisibility: Object
})
const openSubWindow = (newActiveWindow) => {
  activeWindow.value = `${newActiveWindow}`
  definedProps.uiWindowsVisibility.topMenu = true
}
</script>

<template>
  <ul class="ui__buttons">
    <li class="main__btn _lil" @click="openSubWindow('Recipes')"><slot name="recipes" /></li>
    <li class="main__btn _lil" @click="openSubWindow('Inventory')"><slot name="inventory" /></li>
    <li class="main__btn _lil" @click="openSubWindow('Status')"><slot name="status" /></li>
  </ul>
</template>

<style>
.ui__buttons {
  display: flex;
  z-index: 3;
  position: relative;
  gap: 6px;
  justify-content: flex-end;
}
.ui__buttons li {
  cursor: pointer;
  transition-duration: var(--transition);
  transform: translateY(-50%);
}
.ui__buttons li:hover {
  transform: translateY(0);
}
</style>
