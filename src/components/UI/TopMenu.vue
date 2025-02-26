<script setup lang="ts">
const mainWindowVisibility = defineModel<boolean>('main-window-visibility')
const activeMainWindow = defineModel<string>('active-main-window')

const openMainWindow = (newActiveWindow: string): void => {
  mainWindowVisibility.value = true
  activeMainWindow.value = newActiveWindow
}
</script>

<template>
  <ul class="ui__buttons">
<!--    <li class="main__btn _lil" @click="openSubWindow('Journal')" :class="{_green: menuCounters.journal.greenBorder}">-->
<!--      <slot name="journal" />-->
<!--      <span v-if="menuCounters.journal.journalNewMessages >= 1" class="_green _little messagesCounter">-->
<!--        +{{menuCounters.journal.journalNewMessages}}-->
<!--      </span>-->
<!--    </li>-->
<!--    <li class="main__btn _lil" @click="openSubWindow('Questions')" :class="{_green: menuCounters.quests.greenBorder}">-->
<!--      <slot name="quests" />-->
<!--      <span v-if="menuCounters.quests.new >= 1" class="_green _little messagesCounter">-->
<!--        +{{menuCounters.quests.new}}-->
<!--      </span>-->
<!--    </li>-->
<!--    <li class="main__btn _lil" @click="openSubWindow('Recipes')"><slot name="recipes" /></li>-->
<!--    <li class="main__btn _lil" @click="openSubWindow('Inventory')"><slot name="inventory" /></li>-->
<!--    <li class="main__btn _lil" @click="openSubWindow('Status')"><slot name="status" /></li>-->
    <li class="main__btn _lil" @click="openMainWindow('Journal')"><slot name="journal" /></li>
    <li class="main__btn _lil" @click="openMainWindow('Quests')"><slot name="quests" /></li>
    <li class="main__btn _lil" @click="openMainWindow('Recipes')"><slot name="recipes" /></li>
    <li class="main__btn _lil" @click="openMainWindow('Inventory')"><slot name="inventory" /></li>
    <li class="main__btn _lil" @click="openMainWindow('Status')"><slot name="status" /></li>
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