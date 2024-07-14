<script setup>
/**
 * Компонент глобальной карты */

import {onMounted, ref} from "vue";
import Location from "@/components/Map/Location.vue";

const definedProps = defineProps(['locations', 'resources'])
const emits = defineEmits(['setActiveResource', 'updateCurrentLocation', 'clickLocationBtn'])
const currentLocation = ref(null)

/** Определение начальной локации при маунте компонента */
/*onMounted(() => {
  updateCurrentLocation(definedProps.locations[0])
})*/

/* todo перенести ли этот метод именно туда, где будут находиться ресурсы? Так как это метод точно не карты. */
/** Фарм ресурсов */
/*const farmResource = (location) => {
  const locationResources = location.resources
  const random = Math.round(Math.random()*100)
  let resource = null


  /!* todo сделать отдельный метод получения рандомного числа именно по промежутку. Так как это будет использоваться
      еще и в всплывающей подсказке ресурса. *!/
  /!** Получение ресурса по шансу *!/
  const getResource = () => {
    for (const key in locationResources) {
      if (random >= locationResources[key].chance[0] && random <= locationResources[key].chance[1]) {
        return  locationResources[key]
      }
    }
  }

  /!** Добавление ресурса к массиву ресурсов *!/
  const addResourceToResources = (resource) => {
    const resourceName = resource.engName
    const resourceCount = getResourceCount(locationResources[resourceName])
    const resToActive = {name: resource.name, count: resourceCount}

    if (isResourceExistsInResources(resourceName)) {
      definedProps.resources[resourceName].count += resourceCount
    } else {
      definedProps.resources[resourceName] = {count: resourceCount, name: resource.name}
    }

  /!*console.log('---------- Resource ----------')
    console.log('resourceName', resourceName)
    console.log('resourceCount', resourceCount)
    console.log('random', random)
    console.log(resource)
    console.log('------------ End -------------')*!/
    emits('setActiveResource', resToActive)
  }

  /!** Существует ли ресурс в массиве ресурсов *!/
  const isResourceExistsInResources = (resourceName) => {
    return definedProps.resources[resourceName]
  }

  /!** Существует ли ресурс *!/
  const isResource = (resource) => {
    return resource
  }

  /!** Получение количества ресурсов в промежутке, указанном в ресурсе *!/
  const getResourceCount = (resource) => {
    return Math.floor(Math.random() * (resource.defaultCount[1] - resource.defaultCount[0]) + resource.defaultCount[0])
  }

  resource = getResource()
  if (isResource(resource)) {
    addResourceToResources(resource)
  } else {
    emits('setActiveResource', false)
  }
}*/

/**
 * Метод актуализации активной локации при клике на нее */
/*const updateCurrentLocation = (location) => {
  if (!currentLocation.value) {
    currentLocation.value = location
  } else if (currentLocation.value.id !== location.id) {
    currentLocation.value.isActual = false
  }
  currentLocation.value = location
  currentLocation.value.isActual = true

  emits('updateCurrentLocation', currentLocation.value)

}*/

/**
 * Клик по кнопке локации */
const clickLocationBtn = (locationBtn) => {
  emits('clickLocationBtn', locationBtn)
}
</script>

<template>
  <div class="map">
<!--    <picture class="map-picture">
      <img src="../../assets/map/map.png" alt="main-map">
    </picture>-->

    <Location v-for="(location) of locations"
              :location="location"
              :key="location.id"
              :currentLocation="currentLocation"
              @click="updateCurrentLocation(location)"
              @farmResource="farmResource"
              @clickLocationBtn="clickLocationBtn"
    />
  </div>
</template>

<!--
<style>
.map {
  position: relative;
}
</style>-->
