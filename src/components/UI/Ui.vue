<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useGameStore} from "@/store/useGameStore.ts";
import {computed} from "vue";
import type {Component} from "vue";

import TopMenu from "@/components/UI/TopMenu.vue";
import Inventory from "@/components/Subwindows/Inventory.vue";
import Recipes from "@/components/Subwindows/Recipes.vue";
import Status from "@/components/Subwindows/Status.vue";

const {windowsVisibility} = storeToRefs(useGameStore())

const activeWindowComponent = computed<Component>(() => {
  let activeComponent: Component = Inventory

  if (windowsVisibility.value.activeMainWindow === 'Inventory') activeComponent = Inventory
  else if (windowsVisibility.value.activeMainWindow === 'Recipes') activeComponent = Recipes
  else if (windowsVisibility.value.activeMainWindow === 'Status') activeComponent = Status
  else activeComponent = Recipes

  return activeComponent
})
</script>

<template>
  <div class="ui">
    <TopMenu v-model:main-window-visibility="windowsVisibility.mainWindow"
             v-model:active-main-window="windowsVisibility.activeMainWindow">
      <template #journal>Журнал</template>
      <template #quests>Задания</template>
      <template #recipes>Рецепты</template>
      <template #inventory>Инвентарь</template>
      <template #status>Статус</template>
    </TopMenu>

    <div class="ui__window main__texture" :class="{_closed: !windowsVisibility.mainWindow}">
      <span class="window__close"
            @click="windowsVisibility.mainWindow = false">X</span>
      <Component :is="activeWindowComponent" />
    </div>
<!--    <div class="ui__top main__texture" :class="{'_hidden': !uiWindowsVisibility.statusMenu}">-->
<!--      <p class="_little status__row status__time">-->
<!--        Время: {{ player.getTime('hours') }}:{{ player.getTime('minutes')}} | День: {{player.days}}</p>-->
<!--      <p class="_little status__row">-->
<!--        <span class="status__bar _health _tiny">-->
<!--          <span class="status__value">{{player.health > 0 ? player.health : 0}}</span>-->
<!--          <span class="_filled" :style="{'width': `${healthPercentage}%`}"></span>-->
<!--        </span>-->
<!--      </p>-->
<!--      <p class="_little status__row">-->
<!--        <span class="status__bar _food _tiny">-->
<!--          <span class="status__value">{{player.food > 0 ? player.food : 0}}</span>-->
<!--          <span class="_filled" :style="{'width': `${foodPercentage}%`}"></span>-->
<!--        </span>-->
<!--      </p>-->
<!--      <p class="_little status__row">-->
<!--        <span class="status__bar _water _tiny">-->
<!--          <span class="status__value">{{player.water > 0 ? player.water : 0}}</span>-->
<!--          <span class="_filled" :style="{'width': `${waterPercentage}%`}"></span>-->
<!--        </span>-->
<!--      </p>-->

<!--      <p class="_little status__key">здоровье</p>-->
<!--      <p class="_little status__key">еда</p>-->
<!--      <p class="_little status__key">вода</p>-->

<!--      <span @click="uiWindowsVisibility.statusMenu = !uiWindowsVisibility.statusMenu"-->
<!--            class="main__texture _big">^</span>-->
<!--    </div>-->

<!--    <TopMenu v-model:active-window="activeWindow" :uiWindowsVisibility="uiWindowsVisibility">-->
<!--      <template #journal>Журнал</template>-->
<!--      <template #quests>Задания</template>-->
<!--      <template #recipes>Рецепты</template>-->
<!--      <template #inventory>Инвентарь</template>-->
<!--      <template #status>Статус</template>-->
<!--    </TopMenu>-->

<!--    <div class="ui__window _main main__texture" :class="{_closed: !uiWindowsVisibility.topMenu}">-->
<!--      <span class="window__close" @click="uiWindowsVisibility.topMenu = false">X</span>-->
<!--      <Component :is="topMenuButtons[activeWindow]" />-->
<!--    </div>-->

<!--    <ul class="resourceBubbles__container">-->
<!--      <li v-for="rowObj of resourcesBubbles" class="main__texture _little">-->
<!--        <span :class="rowObj.className">{{rowObj.text}}</span> {{rowObj.secondText}}-->
<!--      </li>-->
<!--    </ul>-->
  </div>
</template>

<style>
.ui__window {
  position: fixed;
  z-index: 1;
  bottom: 0;
  right: 0;
  height: 600px;
  max-width: 800px;
  width: 100%;
  border-bottom: none;
  border-right: none;
  border-radius: var(--radius) 0 0 0;
  transform: translateY(0);
  transition-duration: var(--transition);
  padding: var(--gap);
  padding-left: calc(var(--gap) * 2);
  display: flex;
  flex-direction: column;
  gap: var(--gap);
}
.ui__window._closed {
  transform: translateY(100%);
}

.subWindow__header {
  font-size: 24px;
}
</style>