<script setup>
/**
 * Компонент карты */
import Location from "@/components/Map/Location.vue";
import {ref} from "vue";

const definedProps = defineProps(['player', 'locations'])
const resourcesBubbleContainerRef = ref(null)
const resourcesBubbles = ref([])

/**
 * Показывает всплывающий зафармленный ресурс */
const showResourceBubble = (resource) => {
  resourcesBubbles.value.unshift(resource)

  const timeOut = setTimeout(() => {
    resourcesBubbles.value.pop()
  }, 2400)
}
</script>

<template>
  <div class="map">
    <picture class="map__container"><img src="@/assets/map/map.png" alt="map-img"></picture>

    <Location v-for="(location, index) of locations"
              :location="location"
              :key="location.id"
              :player="player"
              @showResourceBubble="showResourceBubble"
    />
  </div>

  <ul class="resourceBubbles__container" ref="resourcesBubbleContainerRef">
    <li v-for="resource of resourcesBubbles" class="main__texture _little">
      {{resource.name}}: {{resource.count}}
    </li>
  </ul>
</template>

<style>
.map {
  position: relative;
}
.resourceBubbles__container {
  position: fixed;
  z-index: 2;
  top: 30px;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}
.resourceBubbles__container li {
  transition-duration: var(--transition);
  border-radius: 5px;
  padding: 4px 8px;
}
</style>