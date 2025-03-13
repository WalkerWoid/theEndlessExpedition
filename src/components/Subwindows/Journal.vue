<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useGameStore} from "@/store/useGameStore.ts";

import type {Hint} from "@/classes/hints.ts";

const gameStore = useGameStore()
const {journal, hints, windowsVisibility} = storeToRefs(gameStore)

const deleteHint = (hint: Hint) => {
  hints.value.deleteHint(hint, journal.value)
  hints.value.addHint(journal.value, 'deleteHint')
}
</script>

<template>
  <h2 class="subWindow__header">Журнал</h2>

  <p v-if="journal.length === 0">Журнал пуст, как желудок Гримма...</p>

  <div v-else class="container _flex">
    <p v-for="hint in journal"
       class="_pointer"
       :class="{_green: hint.wasNotified}"
       @mouseover="hints.clearHint(hint)"
       @click="deleteHint(hint)">
      {{hint.text}}
    </p>
  </div>
</template>

<style>

</style>