<script setup>
/**
 * Компонент подокна для кнопок локации, типа "Информация о локации", "Охота" и так далее */
const definedProps = defineProps(['currentLocationTab', 'locationTabIsVisible'])
const emits = defineEmits(['toggleSubWindow'])
</script>

<template>
    <div class="subWindow location__subWindow  main__texture" :class="{_closed: !locationTabIsVisible}">
      <span class="subWindow__close" @click="$emit('toggleSubWindow', $event.target.parentNode)"> > </span>

      <p class="main__text" v-if="!currentLocationTab">Нажмите на значок "i" или любую другую кнопку на локации</p>

      <div class="subWindow__wrapper" v-else>
        <Component :is="currentLocationTab" />
      </div>
    </div>
</template>

<style>
.location__subWindow {
  bottom: 0;
  left: 0;
  height: auto;
  border-radius: 0 var(--radius) 0 0;
  padding: 10px 60px 10px 30px;
  width: 400px;
  max-height: 500px;
  min-height: 70px;
}
.location__subWindow._closed {
  transform: translateX(-90%);
}
.location__subWindow .subWindow__close {
  transform: scale(1);
}
.location__subWindow._closed .subWindow__close {
  margin-top: 7px;
  transform: scale(-1);
}
</style>