<script setup>
/**
 * Компонент Инвентаря */
import {onMounted} from "vue";

const definedProps = defineProps(['inventory'])

onMounted(() => {
  console.log(definedProps.inventory);
})
</script>

<template>
  <h2>Инвентарь</h2>

  <p v-if="inventory.length === 0">Пуста! Даже повешенной мышки нет(</p>

  <div class="ui__subWindow" v-else>
    <ul class="inventory">
      <!--  todo для каждого ресурса нарисовать свою иконку вместо того, что бы выводить названия. Названия выводить при ховере через title  -->
      <li v-for="resource of inventory" class="resource">{{resource.name}}: {{resource.count}}</li>
    </ul>
  </div>
</template>

<style>
.inventory {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>