<script setup>
/**
 * Компонент отдельной локации */
import {computed} from "vue";

const definedProps = defineProps(['location', 'player'])
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

/**
 * Фарм ресурса при клике на соответствующую кнопку */
const farmResource = () => {
  const isLocationHasResources = () => {
    return definedProps.location.resources.length !== 0
  }
  const getResource = (locationResources, randomValForResource) => {
    return locationResources.find(resource => {
      return resource.chance[0] <= randomValForResource && resource.chance[1] >= randomValForResource
    })
  }

  if (!isLocationHasResources()) {
    console.log('Ресурсов в локации нет!')
    return
  }

  const locationResources = definedProps.location.resources
  const randomValForResource = getRandomByRange([0, 100])
  const resource = getResource(locationResources, randomValForResource)
  let resourceCount = getRandomByRange(resource.count)
  const newResource = getCockedResource(resource, resourceCount)

  definedProps.player.addResource(newResource)
  definedProps.player.showResourceBubble(newResource, 'farm')
}
const getRandomByRange = (range) => {
  const [min, max] = range
  return Math.round(Math.random() * (max - min) + min);
}

/**
 * Получение объекта ресурса, который будет передаваться игроку в инвентарь */
const getCockedResource = (resource, count) => {
  console.log('Сырой ресурс, приходящий в getNewResource', resource)

  const newResource = definedProps.player.getObjectCopy(resource)
  delete newResource.chance
  newResource.count = count

  return newResource
}
</script>

<!-- todo пока не делал анимацию фарма ресурсов. Думаю сделать так, что бы всплывала иконка ресурса и количество -->

<template>
  <div class="location__container"
       :style="locationStyle"
       :class="{_active: location.isCurrent}"
       @click="player.moveLocation(location.engName)"
  >
    <picture class="location__hover" v-show="!location.isCurrent"><img :src="hoverEffectSrc" alt="hoverLocation"></picture>

    <div class="location" :class="{_hidden: !location.isCurrent}">
      <p class="location__here main__texture">Вы <br> тут</p>

      <ul class="location__submenu">
        <template v-for="(menuUnit) of location.submenu">
          <li class="locationMenu__unit main__texture" v-if="menuUnit !== 'ресурсы'">{{menuUnit}}</li>
          <li class="locationMenu__unit main__texture" v-else @click="farmResource">
            {{menuUnit}}
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
.location {
  position: absolute;
  inset: 0;
  transition-duration: var(--transition);
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
.location__container._active .locationMenu__unit {
  scale: 1;
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