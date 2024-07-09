<script setup>
/** Компонент локации */

import {ref, computed} from "vue";

const definedProps = defineProps(['location', 'currentLocation'])

const locationLines = ref(null) // реф картинки с линиями локации
const locationStyle = computed(() => ({ /* Тут IIFE */
  top: definedProps.location.coordinates[0] + 'px',
  left: definedProps.location.coordinates[1] + 'px',
  width: definedProps.location.width + 'px',
  height: definedProps.location.height + 'px',
}))
const locationLinesImgSrc = computed(() => `/src/assets/images/hoverLocations/${definedProps.location.linesSrc}`);

/** Метод показа линий локации при наведении */
const showHoverLines = (event) => {
  if (definedProps.currentLocation.id !== +event.target.dataset.locationId)
    locationLines.value.classList.add('_visible')
}
/** Метод сокрытия линий локации при наведении */
const hideHoverLines = () => {
  locationLines.value.classList.remove('_visible')
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
         ref="locationLines"
         alt="location-hover"
         class="hover__effect">

    <div v-show="location.isActual" class="location__menu main__text">
      i

<!-- todo делал окошки подменю      -->
      <div class="subMenu">
        <h3 class=""></h3>
      </div>
    </div>
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
.location__menu {
  position: absolute;
  width: 26px;
  height: 26px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.hover__effect {
  opacity: 0;
  transition-duration: .4s;
  position: absolute;
  inset: 0;
  width: 100%;
  height: auto;
}

.hover__effect._visible {
  opacity: 1;
}
</style>