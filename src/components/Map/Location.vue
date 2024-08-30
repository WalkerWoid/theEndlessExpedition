<script setup>
/**
 * Компонент отдельной локации */

import LocationMenu from "@/components/UI/LocationMenu/LocationMenu.vue";
import {computed, onUpdated} from "vue";
// onMounted(() => {
//   console.log('Location Component mounted')
// })
// onUpdated(() => {
//   console.log('Location Component updated')
// })

const definedProps = defineProps(['location', 'currentLocation', 'resources'])
const emits = defineEmits(['setActiveResource', 'updateLocationTab'])

const getComputedLocationStyle = computed(() => ({
  top: definedProps.location.coordinates[0] + 'px',
  left: definedProps.location.coordinates[1] + 'px',
  width: definedProps.location.width + 'px',
  height: definedProps.location.height + 'px',
})) /* Тут IIFE */
const getLocationLinesImgSrc = computed(() => `/src/assets/images/hoverLocations/${definedProps.location.linesSrc}`)

const showHoverLinesHandler = (event) => {
  const target = event.target
  const hoverEffect = target.querySelector('.location__hoverEffect')

  if (definedProps.currentLocation.id !== +target.dataset.locationId)
    hoverEffect.classList.remove('_nonVisible')
}
const hideHoverLinesHandler = (event) => {
  const target = event.target
  const hoverEffect = target.querySelector('.location__hoverEffect')

  hoverEffect.classList.add('_nonVisible')
}
const farmResource = (location) => {
  const locationResources = location.resources
  const random = getRandomValueByRange(0,100)
  let resource = null


  const getResource = () => {
    for (const key in locationResources) {
      if (random >= locationResources[key].chance[0] && random <= locationResources[key].chance[1]) {
        return locationResources[key]
      }
    }
  }
  const addResourceToResources = (resource) => {
    const resourceName = resource.engName
    const resourceCount = getResourceCount(locationResources[resourceName])
    const resToActive = {name: resource.name, count: resourceCount}

    if (isResourceExistsInResources(resourceName)) {
      definedProps.resources[resourceName].count += resourceCount
    } else {
      definedProps.resources[resourceName] = {count: resourceCount, name: resource.name, engName: resourceName}
    }

    // console.log('---------- Resource ----------')
    // console.log('resourceName', resourceName)
    // console.log('resourceCount', resourceCount)
    // console.log('random', random)
    // console.log(resource)
    // console.log('Global resources:', definedProps.resources)
    // console.log('------------ End -------------')

    // emits('setActiveResource', resToActive)
    return resToActive
  }
  const isResourceExistsInResources = (resourceName) => {
    return definedProps.resources[resourceName]
  }
  const isResource = (resource) => {
    return resource
  }
  const getResourceCount = (resource) => {
    return getRandomValueByRange(resource.defaultCount[0], resource.defaultCount[1])
  }


  resource = getResource()
  let resToActive = null

  if (isResource(resource)) {
    resToActive = addResourceToResources(resource)
    emits('setActiveResource', resToActive)
  } else {
    emits('setActiveResource', {name: 'Ничего', count: 'Нихрена'})
    console.log('Рерсурс не зафармили')
  }


}
const getRandomValueByRange = (min, max) => {
  return Math.round(Math.random() * (max - min) + min)
}
const updateLocationTab = (locationTab) => {
  emits('updateLocationTab', locationTab)
}
</script>

<template>
<div class="location"
     :style="getComputedLocationStyle"
     :data-location-name="location.engName"
     :data-location-id="location.id"
     @mouseenter="showHoverLinesHandler"
     @mouseleave="hideHoverLinesHandler">

  <picture class="location__hoverEffect _nonVisible">
    <img :src="getLocationLinesImgSrc"
         alt="location-hover-effect">
  </picture>

  <LocationMenu :isActual="location.isActual"
                @farmResource="farmResource(location)"
                @updateLocationTab="updateLocationTab" />
</div>
</template>

<style>
.location {
  position: absolute;
  display: flex;
  cursor: pointer;
  z-index: 2;
  border-radius: 20px;
}
.location__hoverEffect {
  transition-duration: .4s;
  position: absolute;
  inset: 0;
  width: 100%;
  height: auto;
  z-index: 1;
}
</style>