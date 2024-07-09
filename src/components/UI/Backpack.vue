<script setup>
  import {ref} from "vue";
  import Resource from "@/components/Resources/Resource.vue";

  const resources = ref({
    littleStone: {
      name: 'Маленький камешек',
      count: '200'
    },
    grass: {
      name: 'Трава',
      count: '195'
    },
  })
</script>
<template>
  <h2 class="h2__header">Рюкзак</h2>

  <div class="resources">
    <Resource v-for="resource of resources" :resource="resource" :key="resource.name" />
  </div>
</template>
<style>
.resources {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
</style>
