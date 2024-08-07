<script setup>
/**
 * Компонент кнопок(табов), которые будут находиться сверху и отвечать за UI. */

defineProps(['button'])
</script>
<template>
  <div class="ui__unit _closed main__texture">
    <h2 class="h2__header">{{ button.btnName }}</h2>
  </div>
</template>
<style>
.ui__unit {
  display: flex;
  padding: 10px 30px;
  justify-content: center;
  align-items: center;
  border-radius: 0 0 var(--radius) var(--radius);
  cursor: pointer;
  transition-duration: .4s;
}

.ui__unit._closed {
  transform: translateY(-45px);
}
</style>