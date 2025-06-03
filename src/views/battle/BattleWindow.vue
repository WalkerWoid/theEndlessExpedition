<script setup lang="ts">
import {useGameStore} from "@/store/useGameStore.ts";
import {useBattleStore} from "@/store/battle/useBattleStore.ts";
import {storeToRefs} from "pinia";

import type {Enemy} from "@/types/battle/types";
import type {Actor} from "@/types/battle/types";
import type {StatType} from "@/types/battle/types";
import type {MaxStatType} from "@/types/battle/types";

import {useGetStat} from "@/composables/useGetStat.ts";
import {useIsEnemy} from "@/handlers/typeguards/useIsEnemy.ts";

import Popup from "@/components/Popup.vue";
import {computed} from "vue";

const {windowsVisibility, game, player} = storeToRefs(useGameStore())
const {
  activeEnemy,
  turnNumber,
  playerAction,
  nextTurnOwnerMessage,
  battleLog
} = storeToRefs(useBattleStore())

const getEnemyName = computed(() => {
  return activeEnemy.value?.name ?? 'Имя врага неизвестно или враг не передан...'
})

const getStat = (actor: Actor, statType: StatType, maxStatType: MaxStatType): number => {
  if (!actor) return 0

  return Math.round(actor[statType] / actor[maxStatType] * 100) >= 0
      ? Math.round(actor[statType] / actor[maxStatType] * 100)
      : 0
}
const getActiveEnemy = computed<Enemy | undefined>(() => {
  return activeEnemy.value
})

const nextTurn = () => {
  useBattleStore().nextTurn()
}
</script>

<template>
  <Popup :popup-header="getEnemyName" :is-visible="windowsVisibility.battleWindowVisibility">
    <div class="battle__top">
      <div class="battle__stats stats--player flex">
        <h2 class="battle__avatar main__texture main__btn">
          <span class="avatar__text">Вы</span>
          <span class="battle__stat battle--health health--player"
                :style="{'height': `${getStat(player, 'health', 'maxHealth')}%`}"></span>
        </h2>

        <div class="stats__container flex flex--column">
          <span class="battle__stat">Здоровье: {{useGetStat(player, 'health')}}({{useGetStat(player, 'maxHealth')}})</span>
          <span class="battle__stat">Броня: {{useGetStat(player, 'armor')}}({{useGetStat(player, 'maxArmor')}})</span>
          <span class="battle__stat">Скорость: {{useGetStat(player, 'speed')}}({{useGetStat(player, 'maxSpeed')}})</span>
          <span class="battle__stat">Урон: {{useGetStat(player, 'damage')}}({{useGetStat(player, 'maxDamage')}})</span>
        </div>

        <div class="actions__container">
          <h3>Стойки:</h3>
          <label>
            <input type="radio" name="player-action" v-model="playerAction" value="attack">
            <span class="main__btn _lil action">Атака</span>
          </label>
          <label>
            <input type="radio" name="player-action" v-model="playerAction" value="defence" checked>
            <span class="main__btn _lil action">Защита</span>
          </label>
          <label>
            <input type="radio" name="player-action" v-model="playerAction" value="avoidance">
            <span class="main__btn _lil action">Уклонение</span>
          </label>
<!--          <label>-->
<!--            <input type="radio" name="player-action" v-model="playerAction" value="magicBook">-->
<!--            <span class="main__btn _lil action action&#45;&#45;spells">Книга заклинаний</span>-->
<!--          </label>-->
        </div>
      </div>

      <div class="battle__stats stats--enemy flex">
        <div class="flex flex--column">
          <span class="battle__stat battle__stat--enemy">
            {{useGetStat(getActiveEnemy, 'health')}}({{useGetStat(getActiveEnemy, 'maxHealth')}}) :Здоровье
          </span>
          <span class="battle__stat battle__stat--enemy">
            {{useGetStat(getActiveEnemy, 'armor')}}({{useGetStat(getActiveEnemy, 'maxArmor')}}) :Броня
          </span>
          <span class="battle__stat battle__stat--enemy">
            {{useGetStat(getActiveEnemy, 'speed')}}({{useGetStat(getActiveEnemy, 'maxSpeed')}}) :Скорость
          </span>
          <span class="battle__stat battle__stat--enemy">
            {{useGetStat(getActiveEnemy, 'damage')}}({{useGetStat(getActiveEnemy, 'maxDamage')}}) :Урон
          </span>
        </div>

        <h2 class="battle__avatar main__texture main__btn">
          <span class="avatar__text">{{getEnemyName}}</span>
          <span class="battle__stat battle--health health--player"
                :style="{'height': `${getStat(activeEnemy, 'health', 'maxHealth')}%`}"></span>
        </h2>
      </div>
    </div>

    <div class="battle__bottom">
      <ul class="flex flex--column battle-log__container">
        <TransitionGroup name="quest">
          <li v-for="battleText in battleLog" :key="battleText.id">
            {{battleText.text}}
          </li>
        </TransitionGroup>
      </ul>

      <div class="battle__info flex flex--column flex-col">
        <span class="battle__turn">Ход: {{turnNumber}}</span>
        <span class="turn__owner">{{nextTurnOwnerMessage}}</span>
      </div>
      <button class="nextStep main__btn" @click="nextTurn">Расчитать ход</button>
    </div>

    <button @click="windowsVisibility.battleWindowVisibility = false" class="back-btn">уйти</button>
  </Popup>
</template>

<style scoped>
.back-btn {
}
.battle__top {
  display: flex;
  justify-content: space-between;
  position: relative;
  gap: var(--gap);
}


.battle__stats {
  flex-wrap: wrap;
  flex: 0 1 50%;
  align-items: flex-start;
}
.battle__avatar {
  cursor: default;
  width: 180px;
  aspect-ratio: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  flex-wrap: wrap;
  text-align: center;
  padding: var(--gap);
  font-size: 24px;
  position: relative;
  z-index: 2;
  background: var(--health-empty-color);
  border-color: var(--health-color);
  overflow: hidden;
}


.avatar__text {
  z-index: 3;
  color: white
}
.battle__stat:not(.battle--health) {
  cursor: pointer;
  width: max-content;
}
.stats--enemy {
  justify-content: flex-end;
}
.stats--enemy > .flex{
  align-items: flex-end;
}
.battle__stat--enemy {
  text-align: right;
}
.battle--health {
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: var(--health-color);
  cursor: default;
}

.stats__container {
  flex: 1 1 auto;
}
.actions__container {
  flex: 0 1 50%;
  gap: var(--gap);
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.actions__container h3 {
  grid-column: span 2;
  text-align: center;
}
.action {
  transition-duration: var(--transition);
  flex: 1 1 auto;
  text-align: center;
  border: 2px solid var(--border-color);
}
.action:hover {
  transform: translateY(5px);
}
input[type=radio] {
  display: none;
}
input[type=radio]:checked + .action {
  background: var(--green-color);
  border: 2px solid darkgreen;
  color: darkgreen;
}


.battle__bottom {
  position: relative;
  flex: 1 1 auto;
  margin-top: auto;
  border: 1px solid var(--border-color);
  padding: var(--gap);
  border-radius: var(--radius-half);
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
}
.battle__text {
  flex: 1 1 auto;
  align-self: stretch;
}
.battle__info {
  border-left: 1px solid var(--border-color);
  padding-left: var(--gap)
}
.nextStep {
  height: auto;
  position: absolute;
  right: 0;
  bottom: calc(100% + 10px);
}


.battle-log__container {
  flex: 1 1 auto;
  padding-right: var(--gap);
  overflow: auto;
  max-height: 281px;
}
</style>