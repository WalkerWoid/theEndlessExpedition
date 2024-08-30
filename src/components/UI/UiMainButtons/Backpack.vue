<script setup>
/**
 * Компонент рюкзака. Тут будут отображаться все ресурсы */

import Resource from "@/components/Resources/Resource.vue";
const definedProps = defineProps(['resources', 'player']);

const equipItem = (item) => {
  console.clear()
  console.log('Экепируемый предмет:', item)
  console.log('Объект игрока', definedProps.player)

  /** Если предмета больше чем 1, то вычитаем одну штуку. Если дурабилити будет меньше, чем начальное дурабилити, то
        оставим его. */

  if (item.count === 1) definedProps.player.equipItem(item)
  else {
    item.count-=1
    item.wasGreaterThan1 = true
    definedProps.player.equipItem(item)
  }
}
const unEquipItem = (item) => {
  if (item.count === 1) definedProps.player.unEquipItem(item)
  if (item.wasGreaterThan1) {
    item.count += 1
    delete item.wasGreaterThan1
    definedProps.player.unEquipItem(item)
  }
}
</script>

<template>
  <h2 class="h2__header">Рюкзак</h2>
  <p v-if="!Object.keys(definedProps.resources).length" class="main__text">Настолько пусто, что даже повешеной мыши нет!</p>

  <div class="resources" v-else>
    <Resource v-for="resource of resources"
              :resource="resource"
              :key="resource.name"
              @equipItem="equipItem" @unEquipItem="unEquipItem"/>
  </div>
</template>
<style>
.resources {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  max-height: calc(700px - 48px);
  padding: 15px 0;
}
.resources p {
  flex: 1 1 40%;
}
</style>
