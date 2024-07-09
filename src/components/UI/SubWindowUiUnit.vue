<script setup>
/**
 * Компонент окна, который будет открываться при нажатии на табы, находящиеся сверху. В этом окне будет отображаться
 * информация, касающаяся того или иного таба. Например, нажали на "Рюкзак", в окне отобразились ресурсы; нажали на
 * "Верстак" - отобразились рецепты. */

defineProps(['currentTab'])

</script>
<template>
  <div class="subWindow__wrapper">
    <Component :is="currentTab"/>
  </div>
</template>
<style>
  .subWindow__wrapper {
    display: flex;
    overflow: auto;
    flex-direction: column;
    height: 100%;
  }
</style>
