<script setup lang="ts">
import {useGameStore} from "@/store/useGameStore.ts";
import {useBattleStore} from "@/store/battle/useBattleStore.ts";
import {storeToRefs} from "pinia";
import {computed} from "vue";

import type {Enemies, Enemy} from "@/types/battle/types";
import {useIsEnemy} from "@/handlers/typeguards/useIsEnemy.ts";
import {useGetClone} from "@/composables/useGetClone.ts";

const {windowsVisibility, currentLocationObj, game, notifications, player} = storeToRefs(useGameStore())
const {activeEnemy} = storeToRefs(useBattleStore())

const getLocationEnemies = computed<Enemies>(() => {
  return currentLocationObj.value.enemies
})
const startHunt = () => {
  if (activeEnemy.value) {
    notifications.value.showNotification({}, 'resolveHunt')
    return
  }

  game.value.changeTime(40, 0, 0)
  const newEnemy: Enemy | undefined = game.value.getEnemy(currentLocationObj.value.enemies)
  activeEnemy.value = useGetClone(newEnemy)

  if (useIsEnemy(newEnemy)) notifications.value.showNotification(newEnemy, 'meetEnemy')
  else notifications.value.showNotification({}, 'meetNoOne')

  console.log('Найденный враг', newEnemy)
}
const getActiveEnemy = computed<Enemy | string>(() => {
  const enemy = activeEnemy.value

  if (useIsEnemy(enemy))
    return enemy
  else return 'Благоволит ли вам судьба сегодня?'
})

const startBattleHandler = () => {
  windowsVisibility.value.battleWindowVisibility = true
  useBattleStore().startBattle(player.value)
}
const releaseTheEnemy = () => {
  notifications.value.showNotification(activeEnemy.value, 'releaseTheEnemy')
  activeEnemy.value = undefined
}
</script>

<template>
  <h2 class="subWindow__header">Охота</h2>

  <div class="enemies__container flex flex--column">
    Можно встретить:

    <ul class="enemies flex flex--column">
      <li v-for="enemy in getLocationEnemies" class="_little">{{ enemy.name }}: {{enemy.chance[1] - enemy.chance[0] + 1}}%</li>
    </ul>
  </div>

  <div class="hunt__actions flex">
    <p v-if="useIsEnemy(getActiveEnemy)" :key="getActiveEnemy.id">{{getActiveEnemy.description}}</p>
    <p v-else :key="getActiveEnemy">{{getActiveEnemy}}</p>

    <div v-if="useIsEnemy(activeEnemy)" class="flex flex--column">
      <button class="main__btn main__btn--attack" type="button" @click="startBattleHandler">Атаковать</button>
      <button class="main__btn main__btn--back" type="button" @click="releaseTheEnemy">Уйти</button>
    </div>
  </div>

  <button type="button" class="main__btn main__texture hunt__btn" @click="startHunt">Охотиться</button>
</template>

<style scoped>
.enemies {
  gap: var(--gap-half);
}

.hunt__actions {
  margin-top: auto;
  justify-content: space-between;
  min-height: 104px;
  align-items: flex-end;

}
.main__btn {
  background: none;
  transition-duration: var(--transition);
}
.main__btn--attack:hover {
  background-color: var(--green-color);
  border-color: var(--green-color);
  color: white
}
.main__btn--back:hover {
  background-color: var(--red-color);
  border-color: var(--red-color);
  color: white
}
</style>