<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useGameStore} from "@/store/useGameStore.ts";
import {computed} from "vue";
import type {Component} from "vue";

import TopMenu from "@/components/UI/TopMenu.vue";
import StatusBar from "@/components/StatusBar/StatusBar.vue";
import Inventory from "@/components/Subwindows/Inventory.vue";
import Recipes from "@/components/Subwindows/Recipes.vue";
import Status from "@/components/Subwindows/Status.vue";
import Journal from "@/components/Subwindows/Journal.vue";
import LocationInfo from "@/components/Map/LocationInfo.vue";
import Quests from "@/components/Subwindows/Quests.vue";
import Hunt from "@/views/battle/Hunt.vue";

const {windowsVisibility, hints, quests} = storeToRefs(useGameStore())

const activeWindowComponent = computed<Component>(() => {
  let activeComponent: Component = Hunt

  if (windowsVisibility.value.activeMainWindow === 'Inventory') activeComponent = Inventory
  else if (windowsVisibility.value.activeMainWindow === 'Recipes') activeComponent = Recipes
  else if (windowsVisibility.value.activeMainWindow === 'Status') activeComponent = Status
  else if (windowsVisibility.value.activeMainWindow === 'Journal') activeComponent = Journal
  else if (windowsVisibility.value.activeMainWindow === 'info') activeComponent = LocationInfo
  else if (windowsVisibility.value.activeMainWindow === 'Quests') activeComponent = Quests
  else if (windowsVisibility.value.activeMainWindow === 'Hunt') activeComponent = Hunt
  else activeComponent = Hunt

  return activeComponent
})
</script>

<template>
  <div class="ui">
    <StatusBar />

    <TopMenu v-model:main-window-visibility="windowsVisibility.mainWindowVisibility"
             v-model:active-main-window="windowsVisibility.activeMainWindow"
             v-model:new-hints="hints.newHints"
             v-model:new-quests="quests.newQuests"
    >
      <template #journal>Журнал</template>
      <template #quests>Задания</template>
      <template #recipes>Рецепты</template>
      <template #inventory>Инвентарь</template>
      <template #status>Статус</template>
    </TopMenu>

    <div class="ui__window main__texture" :class="{_closed: !windowsVisibility.mainWindowVisibility}">
      <span class="window__close"
            @click="windowsVisibility.mainWindowVisibility = false">X</span>
      <Component :is="activeWindowComponent" />
    </div>
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