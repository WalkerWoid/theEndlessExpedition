<script setup>
/**
 * Компонент карты */

import {defineAsyncComponent, inject} from "vue";
const Location = defineAsyncComponent(() => import("@/components/Map/Location.vue"))

const locations = inject('locations', [])
const uiWindowsVisibility = inject('uiWindowsVisibility')

const activeWindow = inject('activeWindow')
const openSubWindow = (newActiveWindow) => {
  activeWindow.value = `${newActiveWindow}`
  uiWindowsVisibility.topMenu = true
}

</script>

<template>
  <div class="map">
    <picture class="map__container"><img src="@/assets/map/map.png" alt="map-img"></picture>

    <Location v-for="location of locations" @openSubWindow="openSubWindow"
              :location="location" :key="location.id" :uiWindowsVisibility />
  </div>
</template>

<style>
.map {
  position: relative;
}

</style>