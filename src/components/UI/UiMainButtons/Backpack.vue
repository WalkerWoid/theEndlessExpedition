<script setup>
/**
 * Компонент рюкзака. Тут будут отображаться все ресурсы */

import Resource from "@/components/Resources/Resource.vue";
const definedProps = defineProps(['resources']);
</script>
<template>
  <div>
    <h2 class="h2__header">Рюкзак</h2>
    <p v-if="!Object.keys(definedProps.resources).length" class="main__text">Настолько пусто, что даже повешеной мыши нет!</p>

    <div class="resources" v-else>
      <Resource v-for="resource of resources" :resource="resource" :key="resource.name"/>
    </div>
  </div>
</template>
<style>
.resources {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
</style>
