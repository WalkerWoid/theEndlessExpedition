<script setup>
/** Компонент локации */

import {ref, computed, onMounted} from "vue";
import LocationMenu from "@/components/UI/LocationMenu/LocationMenu.vue";


const definedProps = defineProps(['location', 'currentLocation'])
defineEmits(['farmResource'])

const locationLinesRefTag = ref(null) // реф картинки с линиями локации
const locationActionsRef = ref(null)
const locationStyle = computed(() => ({ /* Тут IIFE */
  top: definedProps.location.coordinates[0] + 'px',
  left: definedProps.location.coordinates[1] + 'px',
  width: definedProps.location.width + 'px',
  height: definedProps.location.height + 'px',
}))
const locationLinesImgSrc = computed(() => `/src/assets/images/hoverLocations/${definedProps.location.linesSrc}`)

/** Метод показа линий локации при наведении */
const showHoverLines = (event) => {
  if (definedProps.currentLocation.id !== +event.target.dataset.locationId)
    locationLinesRefTag.value.classList.add('_visible')
}

/** Метод сокрытия линий локации при наведении */
const hideHoverLines = () => {
  locationLinesRefTag.value.classList.remove('_visible')
  // locationActionsRef.value.classList.add('_hidden')
}

const toggleOpacity = (target) => {
  target.classList.toggle('_hidden')
}
</script>

<template>
  <div class="location"
       :data-location="location.engName"
       :data-location-id="location.id"
       :style="locationStyle"
       @mouseenter="showHoverLines"
       @mouseleave="hideHoverLines"
  >
    <img :src=locationLinesImgSrc
         ref="locationLinesRefTag"
         alt="location-hover"
         class="hover__effect">

    <LocationMenu :isActual="location.isActual" />
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
.hover__effect {
  opacity: 0;
  transition-duration: .4s;
  position: absolute;
  inset: 0;
  width: 100%;
  height: auto;
  z-index: 1;
}
.hover__effect._visible {
  opacity: 1;
}
</style>