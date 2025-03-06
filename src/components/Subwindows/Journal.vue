<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useGameStore} from "@/store/useGameStore.ts";

const gameStore = useGameStore()
const {journal, hints, windowsVisibility} = storeToRefs(gameStore)
</script>

<template>
  <div class="subWindow__header">Журнал</div>
  <p @click="hints.addHint(journal, 'awakingThoughts1', windowsVisibility)">Добавить подсказку</p>
  <p @click="hints.addHint(journal, 'awakingThoughts2', windowsVisibility)">Добавить подсказку2</p>
  <p @click="hints.addHint(journal, 'awakingThoughts3', windowsVisibility)">Добавить подсказку3</p>

  <p v-if="journal.length === 0">Журнал пуст, как желудок Гримма...</p>

  <div v-else class="container _flex">
    <p v-for="hint in journal"
       class="_pointer"
       :class="{_green: hint.wasNotified}" @mouseover="hints.clearHint(hint)">
      {{hint.text}}
    </p>
  </div>
</template>

<style>

</style>