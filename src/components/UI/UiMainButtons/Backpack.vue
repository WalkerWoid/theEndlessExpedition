<script setup>
/**
 * Компонент рюкзака. Тут будут отображаться все ресурсы */

import Resource from "@/components/Resources/Resource.vue";
const definedProps = defineProps(['resources']);
</script>
<template>
  <h2 class="h2__header">Рюкзак</h2>
  <p v-if="!Object.keys(definedProps.resources).length" class="main__text">Настолько пусто, что даже повешеной мыши нет!</p>

  <div class="resources" v-else>
    <Resource v-for="resource of resources" :resource="resource" :key="resource.name"/>
  </div>
</template>
<style>
.resources {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.resources p {
  flex: 1 1 40%;
}
</style>
