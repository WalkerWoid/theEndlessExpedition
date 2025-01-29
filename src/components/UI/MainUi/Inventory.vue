<script setup>
/**
 * Компонент Инвентаря */

import {inject, ref, watch} from "vue";
const player = inject('player')
const activeResource = ref(null)
const activeResourceDescription = ref('')

watch(activeResource, (newActiveResource, oldActiveResource) => {
  // console.log('Новый активный ресурс', newActiveResource)
  if (newActiveResource && resourcesDescription[newActiveResource.engName]) {
    activeResourceDescription.value = resourcesDescription[newActiveResource.engName]
  } else {
    activeResourceDescription.value = 'Описания еще нет'
  }
})

/**
 * Массив с описаниями всех ресурсов */
const resourcesDescription = {
  grass: 'Обычная трава. Ничего необычного.',
  stick: 'Жаль, не похожа на автомат, которым ты играл в детстве.',
  commonFlower: 'Охапка полевых цветов. С ними ты выглядишь как жених.',
  goldenFlower: `Второе название - Золотой цветок. Очень редкий. Назван так из свойства переливаться
                 характерным свечением на Солнце. Лепестки Златограйника обладают хорошими лечебными свойствами.`,
  littleStone: `Камушек. Используется в большом количестве при игре в "Камушки". И нет, они не могут делать того, о чем
                ты подумал. Произнеси сто раз, что бы потерять смысл слова.`
}

const setActiveResource = (resource) => {
  activeResource.value = resource
}
const clearActiveResource = () => {
  // console.log('activeResource.value', activeResource.value)
  if (!player.getInventoryItem(activeResource.value)) {
    setActiveResource(null)
  }
}

const isEquippedColor = (resource) => {
  return resource.isEquipped
}
const isSemiDamagedColor = (resource) => {
  if (!resource.durability) {
    return false
  }

  return resource.durability >= (Math.floor(player.getItemInfo(resource, 'startedDurability')/2)) &&
      resource.durability < player.getItemInfo(resource, 'startedDurability')
}
const isDamagedColor = (resource) => {
  if (!resource.durability) {
    return false
  }

  return resource.durability < (Math.floor(player.getItemInfo(resource, 'startedDurability')/2))
}
</script>

<!-- todo подумать над тем, что бы сделать мини игру, в которой впесто простого "создать" у рецептов, "создать" будет в
      инвентаре и надо будет выбирать(клацать) на ресурсы и нажимать "создать". -->

<!-- todo в журнале написать, что при нажатии на пкм на ресурсе, можно будет открыть дополнительное окно -->

<!-- todo подумать еще над подокном для ресурса. Может просто сделать, что бы при нажатии, котрывалось окно там, где
      находится курсор. -->

<!--  todo для каждого ресурса нарисовать свою иконку вместо того, что бы выводить названия. Названия выводить при ховере через title  -->

<!--  todo когда в описании златограйник, то при скрытии окна инвентаря оно уходит не полностью-->

<template>
  <h2>Инвентарь</h2>

  <p v-if="player.inventory.length === 0">Пуста! Даже повешенной мышки нет(</p>

  <div class="ui__subWindow" v-else>
    <ul class="inventory">

      <li v-for="resource of player.inventory"
          class="resource" @click="setActiveResource(resource)"
          :title="resource.durability ? `Оставшаяся прочность: ${resource.durability}` : ''"
          :class="{
            '_green': isEquippedColor(resource),
            '_orange': isSemiDamagedColor(resource),
            '_red': isDamagedColor(resource),
          }">
        {{resource.name}}: {{resource.count}}
      </li>
    </ul>

    <div class="resource__subWindow _top main__texture">
      <template v-if="!activeResource">
        <p class="_little">Нажмите на ресурс, что бы увидеть способы взаимодействия с ним!</p>
      </template>

      <template v-else-if="activeResource.type === 'resource'">
        <p class="_little">
          {{activeResourceDescription}}
        </p>
      </template>

      <template v-else-if="activeResource.type === 'armor' || activeResource.type === 'weapon'">
        <p class="_little">{{activeResource.name}}(прочность: {{activeResource.durability}}):</p>

        <div class="resource__actions">
          <button type="button" @click="player.disassembleItem(activeResource); clearActiveResource()">Разобрать</button>
          <button type="button" @click="player.putOnItem(activeResource); clearActiveResource()">Надеть</button>
          <button type="button" @click="player.takeOffItem(activeResource); clearActiveResource()">Снять</button>
        </div>
      </template>

      <template v-else-if="activeResource.type === 'medical'">
        <p class="_little">{{activeResource.name}}:</p>

        <div class="resource__actions">
          <button type="button" @click="player.useItem(activeResource)">Использовать</button>
        </div>
      </template>
    </div>
  </div>
</template>

<style>
.inventory {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.resource {
  position: relative;
  cursor: pointer;
}
.resource__subWindow {
  position: absolute;
  bottom: 100%;
  border-radius: var(--radius) 0 0 0;
  padding: 10px;
  left: 40px;
  right: 0;
  border-right: none;
  display: flex;
  align-items: center;
  gap: 6px;
}
.resource__actions {
  display: flex;
  align-self: center;
  gap: 6px;
}
.resource__actions button {
  background-color: transparent;
  padding: 4px 6px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  transition-duration: var(--transition);
}
.resource__actions button:hover {
  background-color: rgb(239, 202, 82);
}
</style>