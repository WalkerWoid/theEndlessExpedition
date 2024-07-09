<script setup>
/**
 * Компонент кнопок(табов), которые будут находиться сверху и отвечать за UI. */

import {onMounted} from "vue";

defineProps(['button'])
</script>
<template>
  <div class="ui__unit _closed main__texture">
    <h2 class="h2__header">{{ button.btnName }}</h2>
  </div>
</template>
<style>

</style>