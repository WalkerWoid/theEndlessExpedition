<script setup>
import Map from "@/components/Map/Map.vue";
import UI from "@/components/UI/UI.vue"
import {ref} from "vue";

/**
 * Глобальный массив локаций
 * id             - используется в v-for
 * name           - имя на русском
 * engName        - пока не используется
 * linesSrc       - используется в пути картинки ховер-эффекта(такие белые линии)
 * coordinates    - используются в качестве начальной координаты блока локации
 * width          - ширина блока локации
 * height         - высота блока локации
 * resources      - ресурсы, которые можно найти на этой локации
 * */
const locations = ref([
  {
    id: 0,
    name: 'Спасательный челнок',
    engName: 'theRescueShuttle',
    linesSrc: 'theRescueShuttleLines.png',
    coordinates: [4, 48],
    width: 150,
    height: 158,
    resources: {
      branch: 40,
      grass: 40,
      flower: 20,
    },
    isActual: false
  },
  {
    id: 1,
    name: 'Лесочек',
    engName: 'testLocation',
    linesSrc: 'theRescueShuttleLines.png',
    coordinates: [200, 248],
    width: 150,
    height: 158,
    resources: {
      branch: 40,
      grass: 40,
      flower: 20,
    },
    isActual: false
  },
])

/**
 * Глобальный массив ресурсов */
const resources = [

]
</script>
<template>
  <Map :locations="locations" :resources="resources" />
  <UI />
</template>


