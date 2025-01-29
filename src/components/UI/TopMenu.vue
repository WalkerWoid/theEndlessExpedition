<script setup>
/**
 * Компонент верхнего меню */

import {computed, inject, onUpdated, reactive, ref, watch} from "vue";
const player = inject('player')

const activeWindow = defineModel('activeWindow')
const definedProps = defineProps({
  uiWindowsVisibility: Object
})
const openSubWindow = (newActiveWindow) => {
  activeWindow.value = `${newActiveWindow}`
  definedProps.uiWindowsVisibility.topMenu = true
}

/**
 * Наблюдение за записями в журнал и квестами */
const journal = player.journal

const menuCounters = reactive({
  journal: {
    journalNewMessages: 4,
    greenBorder: true
  },
  quests: {
    new: 1,
    greenBorder: true
  }
})

const clearJournalNotifications = () => {
  menuCounters.journal.journalNewMessages = 0
  menuCounters.journal.greenBorder = false
}
const addNotifications = (notificationType) => {
  if (activeWindow.value !== notificationType) {
    menuCounters[notificationType].new += 1
    menuCounters[notificationType].greenBorder = true
  }
}
const clearNotifications = (notificationType) => {
  menuCounters[notificationType].new = 0
  menuCounters[notificationType].greenBorder = false
}

watch(() => journal.length, (newLength, oldLength) => {
  if (activeWindow.value !== 'Journal') {
    menuCounters.journal.journalNewMessages += 1
    menuCounters.journal.greenBorder = true
  }
})
watch(() => Object.keys(player.activeQuests).length, (newQuests, oldQuests) => {
  if (activeWindow.value !== 'Questions') {
    addNotifications('quests')
  }
}, {deep: true})
watch(() => activeWindow.value, (newActiveWindow, oldActiveWindow) => {
  if (newActiveWindow === 'Journal') {
    clearJournalNotifications()
  }
  if (newActiveWindow === 'Questions') {
    clearNotifications('quests')
  }
})
</script>

<template>
  <ul class="ui__buttons">
    <li class="main__btn _lil" @click="openSubWindow('Journal')" :class="{_green: menuCounters.journal.greenBorder}">
      <slot name="journal" />
      <span v-if="menuCounters.journal.journalNewMessages >= 1" class="_green _little messagesCounter">
        +{{menuCounters.journal.journalNewMessages}}
      </span>
    </li>
    <li class="main__btn _lil" @click="openSubWindow('Questions')" :class="{_green: menuCounters.quests.greenBorder}">
      <slot name="quests" />
      <span v-if="menuCounters.quests.new >= 1" class="_green _little messagesCounter">
        +{{menuCounters.quests.new}}
      </span>
    </li>
    <li class="main__btn _lil" @click="openSubWindow('Recipes')"><slot name="recipes" /></li>
    <li class="main__btn _lil" @click="openSubWindow('Inventory')"><slot name="inventory" /></li>
    <li class="main__btn _lil" @click="openSubWindow('Status')"><slot name="status" /></li>
  </ul>
</template>

<style>
.ui__buttons {
  display: flex;
  z-index: 3;
  position: relative;
  gap: 6px;
  justify-content: flex-end;
}
.ui__buttons li {
  cursor: pointer;
  transition-duration: var(--transition);
  transform: translateY(-50%);
  position: relative;
}
.ui__buttons li:hover {
  transform: translateY(0);
}

.messagesCounter {
  padding-left: 10px;
}
</style>
