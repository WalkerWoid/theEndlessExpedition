<script setup lang="ts">
import {storeToRefs} from "pinia";
import {computed, ref, watch} from "vue";

import {useGameStore} from "@/store/useGameStore.ts";
import type {InventoryItemsTypes, InventoryResourceSimple} from "@/classes/player.ts";

import {resourcesDescription} from "@/classes/resourcesDescription.ts";
import {useIsArmorOrWeapon} from "@/composables/useIsArmorOrWeapon.ts";
import {useGetClone} from "@/composables/useGetClone.ts";

const {player, windowsVisibility, notifications} = storeToRefs(useGameStore())
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
  console.log(activeResource.value)
  if (newActiveResource && resourcesDescription[newActiveResource.engName]) {
    activeResourceDescription.value = resourcesDescription[newActiveResource.engName]
  } else {
    activeResourceDescription.value = 'Описания еще нет'
  }
})
watch(() => activeResource.value.count, (newCount) => {
  if (newCount === 0)
    activeResource.value = placeholderResource
})
</script>

<!-- todo подумать над тем, что бы сделать мини игру, в которой впесто простого "создать" у рецептов, "создать" будет в
      инвентаре и надо будет выбирать(клацать) на ресурсы и нажимать "создать". -->

<!-- todo в журнале написать, что при нажатии на пкм на ресурсе, можно будет открыть дополнительное окно -->

<!-- todo подумать еще над подокном для ресурса. Может просто сделать, что бы при нажатии, котрывалось окно там, где
      находится курсор. -->

<!--  todo для каждого ресурса нарисовать свою иконку вместо того, что бы выводить названия. Названия выводить при ховере через title  -->

<!-- todo сделать так, что бы предметы в инвентаре подсвечивались как-то, если они сейчас выбраны. Сделать у предметов
        isActive, который будет за это отвечать -->

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

    <!-- todo не видно сраные ебаные блять типы заебали они меня  -->

    <template v-else-if="useIsArmorOrWeapon(activeResource)">
      <div class="items__action">
        <p class="_little">{{ activeResource.name }}: {{activeResource.durability}} прочности;</p>

        <button type="button" class="_little item__button"
                @click="player.putOnItemHandler(activeResource, notifications)">
          <span class="_top">Надеть</span>
          <span class="_center">Надеть</span>
          <span class="_bottom">Надеть</span>
        </button>

        <button type="button" class="_little item__button"
                @click="player.takeOffItem(useGetClone(activeResource), notifications)">
          <span class="_top">Снять</span>
          <span class="_center">Снять</span>
          <span class="_bottom">Снять</span>
        </button>

        <button type="button" class="_little item__button">
          <span class="_top">Разобрать</span>
          <span class="_center">Разобрать</span>
          <span class="_bottom">Разобрать</span>
        </button>
      </div>
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
  flex-wrap: wrap;
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
.items__action {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--gap);
}
.item__button {
  cursor: pointer;
  position: relative;
  min-height: 20px;
  overflow: hidden;
  display: block;
  border-bottom: 1px solid var(--border-color);
}
.item__button ._top,
.item__button ._bottom {
  transition-duration: .3s;
  position: absolute;
}
.item__button ._top {
  transform: translateY(-100%);
}
.item__button ._center {
  color: transparent;
}
.item__button ._bottom {
  top: 0;
  left: 0;
}
.item__button:hover ._top{
  transform: translateY(0);
}
.item__button:hover ._bottom{
  transform: translateY(100%);
}
</style>