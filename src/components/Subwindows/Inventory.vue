<script setup lang="ts">
import {storeToRefs} from "pinia";
import {computed, ref, watch} from "vue";

import {useGameStore} from "@/store/useGameStore.ts";
import type {InventoryItemsTypes, InventoryResourceSimple} from "@/classes/player.ts";

import {resourcesDescription} from "@/classes/resourcesDescription.ts";

const gameStore = useGameStore()
const {player, windowsVisibility} = storeToRefs(gameStore)
const placeholderResource: InventoryResourceSimple = {
  name: 'placeholder', engName: 'placeholder', count: 0, type: 'placeholder'
}
const activeResource = ref<InventoryItemsTypes>(placeholderResource)
const activeResourceDescription = ref<string>('')

const setActiveResource = (newResource: InventoryItemsTypes) => {
  activeResource.value = newResource
}
const isActiveResourcePlaceholder = computed<boolean>(() => {
  return activeResource.value.type === 'placeholder'
})
const isActiveResourceSimple = computed<boolean>(() => {
  return activeResource.value.type === 'resource' || activeResource.value.type === 'food'
})

watch(() => activeResource.value, (newActiveResource) => {
  if (newActiveResource && resourcesDescription[newActiveResource.engName]) {
    activeResourceDescription.value = resourcesDescription[newActiveResource.engName]
  } else {
    activeResourceDescription.value = 'Описания еще нет'
  }
})
</script>

<!-- todo подумать над тем, что бы сделать мини игру, в которой впесто простого "создать" у рецептов, "создать" будет в
      инвентаре и надо будет выбирать(клацать) на ресурсы и нажимать "создать". -->

<!-- todo в журнале написать, что при нажатии на пкм на ресурсе, можно будет открыть дополнительное окно -->

<!-- todo подумать еще над подокном для ресурса. Может просто сделать, что бы при нажатии, котрывалось окно там, где
      находится курсор. -->

<!--  todo для каждого ресурса нарисовать свою иконку вместо того, что бы выводить названия. Названия выводить при ховере через title  -->

<!--  todo когда в описании златограйник, то при скрытии окна инвентаря оно уходит не полностью-->

<template>
  <div class="subWindow__header">Инвентарь</div>

  <div class="resource__subWindow main__texture"
       :class="{_show: windowsVisibility.mainWindow && player.inventory.playerInventory.length !== 0}">

    <template v-if="isActiveResourcePlaceholder">
      <p class="_little">Нажмите на ресурс, что бы увидеть способы взаимодействия с ним!</p>
    </template>

    <template v-else-if="isActiveResourceSimple">
      <p class="_little">{{activeResourceDescription}}</p>
    </template>
  </div>

  <p v-if="player.inventory.playerInventory.length === 0">Пуста! Даже повешенной мышки нет(</p>

  <div v-else class="container _flex">
    <ul class="inventory">
      <li class="resource"
          v-for="resourceUnit of player.inventory.playerInventory"
          @click="setActiveResource(resourceUnit)" :key="resourceUnit.engName">
        {{resourceUnit.name}}: {{resourceUnit.count}}
      </li>
    </ul>
  </div>

</template>

<style>
.resource {
  cursor: pointer;
}
.inventory {
  flex-direction: row;
  display: flex;
  gap: var(--gap);
}
.resource__subWindow {
  margin-top: auto;
  position: absolute;
  bottom: 100%;
  left: calc(var(--gap) * 2);
  right: 0;
  padding: var(--gap);
  border-radius: var(--radius) 0 0 0;
  border-right: none;
  transition-duration: var(--transition);
  transform: translateX(100%);
}
.resource__subWindow._show {
  transform: translateX(0);
}
</style>