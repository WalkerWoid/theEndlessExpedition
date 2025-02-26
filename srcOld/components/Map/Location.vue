<script setup>
/**
 * Компонент отдельной локации */

import {computed, inject} from "vue";

const player = inject('player')
const definedProps = defineProps({
  location: Object
})
const definedEmits = defineEmits(['openSubWindow'])
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

</script>

<!-- todo пока не делал анимацию фарма ресурсов. Думаю сделать так, что бы всплывала иконка ресурса и количество -->
<!-- todo сделать для submenu локации свой компонент и выводить его через сложный список -->

<template>
  <div class="location__container"
       :style="locationStyle" :class="{_active: location.isCurrent}" @click="player.changeLocation(location.engName)">
    <picture v-show="!location.isCurrent" class="location__hover"><img :src="hoverEffectSrc" alt="hoverLocation"></picture>

    <div class="location" :class="{_hidden: !location.isCurrent}">
      <p class="location__here main__texture">Вы <br> тут</p>

      <ul class="location__submenu">
        <template v-for="menuUnit of location.submenu" :key="menuUnit.id">
          <li class="locationMenu__unit main__texture"
              v-if="menuUnit.id !== 'resources'" @click="$emit('openSubWindow', menuUnit.id)">
            {{menuUnit.title}}
          </li>
          <li class="locationMenu__unit main__texture" v-else @click="player.farmResource">
            {{menuUnit.title}}
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
.location__hover img {
  width: 100%;
  height: 100%;
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