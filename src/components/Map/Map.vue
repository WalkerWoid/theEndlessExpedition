<script setup>
/**
 * Компонент глобальной карты */

import {onMounted, ref} from "vue";
import Location from "@/components/Map/Location.vue";


/* Прошлый метод работы с координатами. Решил забить хрен и сделать по-другому - легче.
/!**
 * Метод следит за движениями мыши на карте, что бы понять, находится ли курсор мыши на какой-либо локации или нет. *!/
const mapHandler = (event) => {
  const coordinates = [[125, 0], [299, 20], [128, 183], [32, 90]]
  const mousePos = [event.layerX, event.layerY]
  // console.log(event)
  if (isPointInPolygon(mousePos, coordinates)) {
    console.log('внутри координат')
  }
}
/!**
 * Алгоритм лучевого обстрела, который узнает, внутри многоугольника курсор находится в данный момент или нет. *!/
const isPointInPolygon = (point, polygon) => {
  let x = point[0], y = point[1];
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    let xi = polygon[i][0], yi = polygon[i][1];
    let xj = polygon[j][0], yj = polygon[j][1];

    let intersect = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}
*/

/**
 * Глобальный массив локаций
 * id             - используется в v-for
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
    name: 'Спасательный челнок',
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
const currentLocation = ref(null)

onMounted(() => {
  updateCurrentLocation(locations.value[0])
})

/**
 * Метод актуализации активной локации при кике на нее */
const updateCurrentLocation = (location) => {
  console.log(location)
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
    />
  </div>
</template>

<style>
.map {
  position: relative;
}
</style>