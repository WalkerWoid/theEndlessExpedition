<script setup lang="ts">
import {useGameStore} from "@/store/useGameStore.ts";
import {storeToRefs} from "pinia";

const gameStore = useGameStore()
const {hints, journal} = storeToRefs(gameStore)

const mainWindowVisibility = defineModel<boolean>('main-window-visibility')
const activeMainWindow = defineModel<string>('active-main-window')
const newHints = defineModel<number>('new-hints')

const openMainWindow = (newActiveWindow: string): void => {
  mainWindowVisibility.value = true
  activeMainWindow.value = newActiveWindow
}
const openMainWindowHandler = (newActiveWindow: string, addedHintTitle: string) => {
  openMainWindow(newActiveWindow)
  hints.value.addHint(journal.value, addedHintTitle)
}
</script>

<template>
  <ul class="ui__buttons">
    <li class="main__btn _lil" @click="openMainWindowHandler('Journal', '')">
      <slot name="journal" />
      <span class="_unseen _little" v-if="newHints">+ {{newHints}}</span>
    </li>
    <li class="main__btn _lil"
        @click="openMainWindowHandler('Quests', 'firstTimeOpenQuests')">
      <slot name="quests" />
    </li>
    <li class="main__btn _lil"
        @click="openMainWindowHandler('Recipes', 'firstTimeOpenRecipes')">
      <slot name="recipes" />
    </li>
    <li class="main__btn _lil"
        @click="openMainWindowHandler('Inventory', 'firstTimeOpenInventory')">
      <slot name="inventory" />
    </li>
    <li class="main__btn _lil"
        @click="openMainWindowHandler('Status', 'firstTimeOpenStatus')">
      <slot name="status" />
    </li>
  </ul>
</template>

<style>
.ui__buttons {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1;
  gap: var(--gap-half);
  display: flex;
  align-items: center;
  margin-left: auto;
}
.ui__buttons li {
  cursor: pointer;
  transition-duration: var(--transition);
  transform: translateY(-16px);
  position: relative;
}
.ui__buttons li:hover {
  transform: translateY(0);
}
</style>