<script setup>
/**
 * Компонент глобальной карты */

import {onMounted, ref} from "vue";
import Location from "@/components/Map/Location.vue";

const definedProps = defineProps(['locations', 'resources'])
const currentLocation = ref(null)

onMounted(() => {
  updateCurrentLocation(definedProps.locations[0])
})
const farmResource = (location) => {
  console.log(location.resources)
  console.log(definedProps.resources)
}

/**
 * Метод актуализации активной локации при кике на нее */
const updateCurrentLocation = (location) => {
  if (!currentLocation.value) {
    currentLocation.value = location
  } else if (currentLocation.value.id !== location.id) {
    currentLocation.value.isActual = false
  }
  currentLocation.value = location
  currentLocation.value.isActual = true

}
</script>

<template>
  <div class="map">
    <picture class="map-picture">
      <img src="../../assets/map/map.png" alt="main-map">
    </picture>

    <Location v-for="(location) of locations"
              :location="location"
              :key="location.id"
              :currentLocation="currentLocation"
              @click="updateCurrentLocation(location)"
              @farmResource="farmResource(location)"
    />
  </div>
</template>

<style>
.map {
  position: relative;
}
</style>