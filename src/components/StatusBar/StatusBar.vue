<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useGameStore} from "@/store/useGameStore.ts";
import {computed} from "vue";

import type {TimeObjectInterface} from "@/classes/Game.ts";

const gameStore = useGameStore()
const {player, windowsVisibility, game} = storeToRefs(gameStore)

const getCurrentValues = computed<{health: number, food: number, water: number}>(() => {
  return {
    health: player.value.getCurrentHealth(),
    food: player.value.getCurrentFood(),
    water: player.value.getCurrentWater(),
  }
})

const time = computed<TimeObjectInterface>(() => {
  return {
    day: game.value.getTime('day'),
    hour: game.value.getTime('hour'),
    minute: game.value.getTime('minute')
  }
})
</script>

<!-- todo поменять нахуй ui статус бара, выглядит кринжово -->

<template>
  <div class="status-bar__container main__texture" :class="{_hidden: !windowsVisibility.statusBarVisibility}">
    <div class="status-bar__line _little" @click="game.changeTime(13, 0, 0)">
      <p class="status__unit _time">День: {{time.day}}; Время {{time.hour}}:{{time.minute}}</p>
    </div>
    <div class="status-bar__line _little">
      <p class="status__unit _health _tiny" title="Здоровье" @click="player.changeMainCharacteristic('health', 70)">
        <span class="status__value"></span>
        <span class="_filled" :style="{'width': `${player.getHealthPercentage()}%`}">{{getCurrentValues.health}}</span>
      </p>
    </div>
    <div class="status-bar__line _little">
      <p class="status__unit _food _tiny" title="Еда" @click="player.changeMainCharacteristic('food', -40)">
        <span class="status__value"></span>
        <span class="_filled" :style="{'width': `${player.getFoodPercentage()}%`}">{{getCurrentValues.food}}</span>
      </p>
    </div>
    <div class="status-bar__line _little">
      <p class="status__unit _water _tiny" title="Вода" @click="player.changeMainCharacteristic('water', -20)">
        <span class="status__value"></span>
        <span class="_filled" :style="{'width': `${player.getWaterPercentage()}%`}">{{getCurrentValues.water}}</span>
      </p>
    </div>

    <span class="window__close" @click="windowsVisibility.statusBarVisibility = !windowsVisibility.statusBarVisibility">X</span>
  </div>
</template>

<style>
.status-bar__container {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  width: 200px;
  transition-duration: var(--transition);
}
.status-bar__container._hidden {
  opacity: 1;
  transform: translateX(-50%) translateY(-100%);
}
.status-bar__container .window__close {
  top: 100%;
  left: 50%;
}

.status__unit {
  display: flex;
  justify-content: center;
  position: relative;
}
.status__unit .status__value {
  z-index: 1;
  flex: 1;
  position: absolute;
  inset: 0;
}
.status__unit ._filled {
  z-index: 2;
  text-align: center;
  color: white;
  transition-duration: var(--transition);
}

._health .status__value {
  background-color: var(--health-empty-color);
}
._health ._filled {
  background-color: var(--health-color);
}
._food .status__value {
  background-color: var(--food-empty-color);
}
._food ._filled {
  background-color: var(--food-color);
}
._water .status__value {
  background-color: var(--water-empty-color);
}
._water ._filled {
  background-color: var(--water-color);
}
</style>