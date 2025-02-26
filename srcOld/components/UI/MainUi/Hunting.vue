<script setup>
/**
 * Компонент окна охоты */

import {computed, inject} from "vue";
import UIWindowHeader from "@/components/UIUnits/UIWindowHeader.vue";

const player = inject('player')
const battleWindowVisibility = inject('battleWindowVisibility')
const eventsWindowVisibility = inject('eventsWindowVisibility')
const locationEnemies = computed(() => {
  return player.getLocation(player.currentLocation).enemies
})
const activeEnemy = computed(() => {
  return player.enemies[locationEnemies[0]]
})
</script>

<!-- todo сделать список всех, на кого можно будет поохотиться -->

<template>
  <UIWindowHeader><template #header>Охота</template></UIWindowHeader>

  <button @click="eventsWindowVisibility = true; player.activeEnemy = player.enemies[locationEnemies[0]];"
          class="main__btn _little _pointer">Начать охоту</button>
</template>

<style></style>