<script setup lang="ts">
import {computed, ref, watch} from "vue"

import type {InventoryItemsTypes, InventoryResourceSimple} from "@/classes/player.ts"
import type {RecipeInfo} from "@/classes/allRecipes.ts"

import {useGameStore} from "@/store/useGameStore.ts";
import {storeToRefs} from "pinia"
import {resourcesDescription} from "@/classes/resourcesDescription.ts"

import {useIsArmorOrWeapon} from "@/composables/useIsArmorOrWeapon.ts"
import {useGetClone} from "@/composables/useGetClone.ts"
import {useIsMedical} from "@/composables/useIsMedical.ts";

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

const isEquippedColor = (resource: InventoryItemsTypes): boolean => {
  if (useIsArmorOrWeapon(resource)) {
    return resource.isEquipped
  }
  return false
}
const isSemiDamagedColor = (resource: InventoryItemsTypes): boolean => {
  if (!useIsArmorOrWeapon(resource)) return false

  const startedDurability = player.value.inventory.getItemInfoLine(resource, 'startedDurability') as RecipeInfo

  return resource.durability < startedDurability.value && resource.durability >= Math.floor(startedDurability.value / 2)
}

const getDamagesColor = (resource: InventoryItemsTypes): 'orange' | 'red' | undefined => {
  if (!useIsArmorOrWeapon(resource)) return

  const startedDurability = player.value.inventory.getItemInfoLine(resource, 'startedDurability') as RecipeInfo
  if (resource.durability < startedDurability.value
      && resource.durability >= Math.floor(startedDurability.value / 2)) return 'orange'
  if (resource.durability < Math.floor(startedDurability.value / 2)) return 'red'
}
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
  <p @click="player.calcEffects">Иммитация времени</p>

  <div class="resource__subWindow main__texture"
       :class="{_show: windowsVisibility.mainWindowVisibility && player.inventory.playerInventory.length !== 0}">

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

        <button type="button" class="_little jumping__button item__button"
                @click="player.putOnItemHandler(activeResource, notifications)">
          <span class="_top">Надеть</span>
          <span class="_center">Надеть</span>
          <span class="_bottom">Надеть</span>
        </button>

        <button type="button" class="_little jumping__button item__button"
                @click="player.takeOffItem(useGetClone(activeResource), notifications)">
          <span class="_top">Снять</span>
          <span class="_center">Снять</span>
          <span class="_bottom">Снять</span>
        </button>

        <button type="button" class="_little jumping__button item__button"
                @click="player.dismantleItem(useGetClone(activeResource), notifications)">
          <span class="_top">Разобрать</span>
          <span class="_center">Разобрать</span>
          <span class="_bottom">Разобрать</span>
        </button>
      </div>
    </template>

    <template v-else-if="useIsMedical(activeResource)">
      <div class="items__action" @click="player.useMedical(useGetClone(activeResource), notifications)">
        <button type="button" class="_little item__button jumping__button">
          <span class="_top">Использовать</span>
          <span class="_center">Использовать</span>
          <span class="_bottom">Использовать</span>
        </button>
      </div>
    </template>
  </div>

  <p v-if="player.inventory.playerInventory.length === 0">Пуста! Даже повешенной мышки нет(</p>

  <div v-else class="container _flex">
    <ul class="inventory">
      <template v-for="resourceUnit of player.inventory.playerInventory"
                :key="resourceUnit.engName">
        <li class="resource"
            @click="setActiveResource(resourceUnit)"
            :class="{_green: isEquippedColor(resourceUnit),
                     _orange: getDamagesColor(resourceUnit) === 'orange',
                     _red: getDamagesColor(resourceUnit) === 'red'}">
          {{resourceUnit.name}}: {{resourceUnit.count}}
        </li>
      </template>
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
  border-bottom: 1px solid var(--border-color);
}
</style>