<script setup lang="ts">
const definedProps = defineProps<{
  isVisible: boolean
  popupHeader: string
}>()
</script>

<template>
  <div class="popup__window" :class="{_hidden: !isVisible}">
    <div class="_shadow"></div>

    <div class="popup main__texture" :class="{_hidden: !isVisible}">
      <h1>{{popupHeader}}</h1>

      <slot>Значение для слота не передано.</slot>
    </div>
  </div>
</template>

<style>
.popup__window {
  transition-duration: var(--transition);
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}
.popup__window._hidden {
  z-index: -1;
  transition-delay: .2s;
}

.popup {
  width: 80%;
  height: 80%;
  z-index: 2;
  border-radius: var(--radius-half);
  position: relative;
  padding: var(--gap) calc(var(--gap) * 2);
  display: flex;
  flex-direction: column;
  gap: var(--gap);
  transition-duration: var(--transition);
  transition-delay: .2s;
  overflow: hidden;
}
.popup._hidden {
  transform: translateY(-120%);
  transition-delay: 0s;
  opacity: 1;
}
</style>