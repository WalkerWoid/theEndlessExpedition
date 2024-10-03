<script setup>
/**
 * Компонент Инвентаря */
import {ref, onMounted} from "vue";

const definedProps = defineProps(['player'])
const activeResource = ref(null)

/**
 * Массив с описаниями всех ресурсов */
const resourcesDescription = {
  grass: 'Обычная трава. Ничего необычного.',
  stick: 'Жаль, не похожа на автомат, которым ты играл в детстве.',
  commonFlower: 'Охапка полевых цветов. С ними ты выглядишь как жених.',
  goldenFlower: `Второе название - Золотой цветок. Очень редкий полевой цветок. Назван так из свойства переливаться
                 характерным свечением на солнце. Его лепестки обладают хорошими лечебными свойствами.`,
  littleStone: `Камушек. Используется в большом количестве при игре в "Камушки". И нет, они не могут делать того, о чем
                ты подумал. Произнеси сто раз, что бы потерять смысл слова.`
}

onMounted(() => {
  console.log('Инвентарь, после открытия окна инвентаря', definedProps.player.inventory);
})

const setActiveResource = (resource) => {
  activeResource.value = resource
}
const clearActiveResource = () => {
  if (!definedProps.player.getInventoryItem(activeResource.value, true)) {
    setActiveResource(null)
  }
}
</script>

<!-- todo подумать над тем, что бы сделать мини игру, в которой впесто простого "создать" у рецептов, "создать" будет в
      инвентаре и надо будет выбирать(клацать) на ресурсы и нажимать "создать". -->

<!-- todo в журнале написать, что при нажатии на пкм на ресурсе, можно будет открыть дополнительное окно -->

<!-- todo вынести activeResource в компонент повыше. Там же, как раз, есть методы открытия и закрытия подокон -->

<!-- todo подумать еще над подокном для ресурса. Может просто сделать, что бы при нажатии, котрывалось окно там, где
      находится курсор. -->

<!-- todo выделять зеленым те предметы, что надеты -->

<template>
  <h2>Инвентарь</h2>

  <p v-if="player.inventory.length === 0">Пуста! Даже повешенной мышки нет(</p>

  <div class="ui__subWindow" v-else>
    <ul class="inventory">
      <!--  todo для каждого ресурса нарисовать свою иконку вместо того, что бы выводить названия. Названия выводить при ховере через title  -->
      <!--  todo сделать отдельный метод для проверки цвета  -->
      <li v-for="resource of player.inventory"
          class="resource"
          @click="setActiveResource(resource); console.log(activeResource)"
          :title="resource.durability ? `Оставшаяся прочность: ${resource.durability}` : ''"
          :class="{
            '_green': resource.isEquipped,
            '_orange': resource.info ? resource.durability < player.getItemInfo(resource, 'startedDurability').value && resource.durability >= (Math.floor(player.getItemInfo(resource, 'startedDurability').value/2)) : '',
            '_red': resource.info ? resource.durability < (Math.floor(player.getItemInfo(resource, 'startedDurability').value/2)) : '',
          }"
      >
        {{resource.name}}: {{resource.count}}
      </li>
    </ul>

    <div class="resource__subWindow _top main__texture">
      <template v-if="!activeResource">
        <p class="_little">Нажмите на ресурс, что бы увидеть способы взаимодействия с ним!</p>
      </template>
      <template v-else-if="activeResource.type === 'resource'">
        <p class="_little">
          {{resourcesDescription[activeResource.engName] ? resourcesDescription[activeResource.engName] : 'Описания нет'}}
        </p>
      </template>
      <template v-else-if="activeResource.type === 'armor' || activeResource.type === 'weapon'">
        <p class="_little">{{activeResource.name}}(прочность: {{activeResource.durability}}):</p>

        <div class="resource__actions">
          <button type="button" @click="player.destroyItemHandler(activeResource); clearActiveResource()">Разобрать</button>
          <button type="button" @click="player.putOnItemHandler(activeResource); clearActiveResource()">Надеть</button>
          <button type="button" @click="player.takeOffItem(activeResource); clearActiveResource()">Снять</button>
        </div>
      </template>
      <template v-else-if="activeResource.type === 'medical'">
        <p class="_little">{{activeResource.name}}:</p>

        <div class="resource__actions">
          <button type="button">Использовать</button>
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