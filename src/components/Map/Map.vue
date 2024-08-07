<script setup>
/**
 * Компонент глобальной карты
 *
 * Тут будут основные локации карты и способы взаимодействия с ними */

import {ref, onMounted} from "vue";
onMounted(() => {
  // console.log('Map Component mounted')
  updateCurrentLocation(definedProps.locations[0])
})
// onUpdated(() => {
//   console.log('Map Component updated')
//   console.log('currentLocation:', currentLocation._rawValue)
// })

import Location from "@/components/Map/Location.vue"

const definedProps = defineProps(['locations', 'resources'])
const emits = defineEmits(['setActiveResource', 'updateLocationTab'])
const currentLocation = ref(null)

const updateCurrentLocation = (location) => {
  if (!currentLocation.value) {
    currentLocation.value = location
  } else if (currentLocation.value.id !== location.id) {
    currentLocation.value.isActual = false
  }
  currentLocation.value = location
  currentLocation.value.isActual = true
}
const setActiveResource = resToActive => {
  emits('setActiveResource', resToActive)
}
const updateLocationTab = (locationTab) => {
  emits('updateLocationTab', locationTab)
}
</script>

<template>
  <div class="map">
    <picture class="map-picture">
      <img src="../../assets/map/map.png" alt="main-map">
    </picture>

    <Location v-for="location of locations"
              :location="location"
              :key="location.id"
              :currentLocation="currentLocation"
              :resources="resources"
              @click="updateCurrentLocation(location)"
              @setActiveResource="setActiveResource"
              @updateLocationTab="updateLocationTab" />
  </div>
</template>

<style>
.map {
  position: relative;
}
</style>