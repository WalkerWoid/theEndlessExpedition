<script setup lang="ts">
import {useGameStore} from "@/store/useGameStore.ts";
import {storeToRefs} from "pinia";
import {computed} from "vue";

import type {Location} from "@/classes/allLocations.ts";

const gameStore = useGameStore()
const {player, notifications, currentLocationObj, windowsVisibility, game} = storeToRefs(gameStore)

const definedProps = defineProps<{
  location: Location
}>()

const locationStyle = computed(() => {
  return {
    top: `${definedProps.location.coords[0]}px`,
    left: `${definedProps.location.coords[1]}px`,
    width: `${definedProps.location.width}px`,
    height: `${definedProps.location.height}px`
  }
})
const hoverEffectSrc = computed(() => {
  return `/src/assets/images/hoverLocations/${definedProps.location.engName}HoverEffect.png`
})

const farmResource = () => {
  if (!currentLocationObj.value) return

  player.value.inventory.farmResource(currentLocationObj.value, notifications.value)
  game.value.changeTime(30, 0, 0)
}
/** todo сделать так, что бы при смене локации время менялось по-разному */

const changeLocation = (newLocationTitle: string) => {
  player.value.changeCurrentLocation(newLocationTitle)
}

const openMainWindow = (newActiveWindow: string): void => {
  windowsVisibility.value.mainWindowVisibility = true
  windowsVisibility.value.activeMainWindow = newActiveWindow
}
</script>

<!-- Думаю сделать так, что бы всплывала иконка ресурса и количество -->

<template>
  <div class="location__container"
       :class="{_active: location.isCurrent}"
       :style="locationStyle"
       @click="changeLocation(location.engName)"
  >
    <picture class="location__hover"
             v-show="!location.isCurrent">
      <img :src="hoverEffectSrc" alt="location-hover">
    </picture>

    <div class="location"
         :class="{_hidden: !location.isCurrent}">
      <p class="location__here main__texture">Вы <br> тут</p>

      <ul class="location__submenu">
        <template v-for="{id, title} of location.subMenu" :key="id">
          <li v-if="id !== 'resources'"
              class="locationMenu__unit main__texture" @click="openMainWindow(id)">
            {{title}}
          </li>
          <li v-else class="locationMenu__unit main__texture" @click="farmResource">
            {{title}}
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<style>
.location__container {
  position: absolute;
  z-index: 2;
}
.location__container:not(._active) {
  cursor: pointer;
}
.location__container._active .locationMenu__unit {
  scale: 1;
}


.location {
  position: absolute;
  inset: 0;
  transition-duration: var(--transition);
}
.location__hover {
  position: absolute;
  inset: -10px;
  opacity: 0;
  transition-duration: var(--transition);
  display: flex;
}
.location__container:hover .location__hover {
  opacity: 1;
}


.location__here {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  text-align: center;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}
.locationMenu__unit {
  position: absolute;
  border-radius: var(--radius);
  padding: 2px 4px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transform-origin: 0;
  cursor: pointer;
  scale: 0;
  transition-duration: calc(var(--transition) * 2);
}
.locationMenu__unit:first-of-type {
  border-radius: 50%;
  width: 26px;
  height: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.location__container._active .locationMenu__unit:nth-of-type(1) {
  transform: translate(-51px, -24px);
  transition-delay: 0s;
}
.location__container._active .locationMenu__unit:nth-of-type(2) {
  transform: translate(-70px, -52px);
  transition-delay: .1s;
}
.location__container._active .locationMenu__unit:nth-of-type(3) {
  transform: translate(14px, -40px);
  transition-delay: .2s;
}
.location__container._active .locationMenu__unit:nth-of-type(4) {
  transform: translate(26px, -6px);
  transition-delay: .3s;
}
.location__container._active .locationMenu__unit:nth-of-type(5) {
  transform: translate(-26px, 27px);
  transition-delay: .4s;
}
.location__container._active .locationMenu__unit:nth-of-type(6) {
  transform: translate(6px, -69px);
  transition-delay: .5s;
}
.location__container._active .locationMenu__unit:nth-of-type(7) {
  transform: translate(-40px, 56px);
  transition-delay: .6s;
}
</style>