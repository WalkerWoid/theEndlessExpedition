<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useGameStore} from "@/store/useGameStore.ts";
import Location from "@/components/Map/Location.vue";

const {locations} = storeToRefs(useGameStore())
</script>

<template>
  <div class="map">
    <picture class="map__picture">
      <img src="@/assets/map/map.png" alt="map-img">
    </picture>

    <Location v-for="location of locations" :key="location.id" :location="location" />
  </div>
</template>

<style>
.map {
  position: relative;
  z-index: 1;
}
</style>