<script setup>
/**
 * Компонент карты */
import Location from "@/components/Map/Location.vue";

const definedProps = defineProps(['player', 'locations', 'resourcesBubbles'])

</script>

<template>
  <div class="map">
    <picture class="map__container"><img src="@/assets/map/map.png" alt="map-img"></picture>

    <Location v-for="(location, index) of locations"
              :location="location"
              :key="location.id"
              :player="player"
    />
  </div>

  <ul class="resourceBubbles__container">
    <li v-for="resource of resourcesBubbles" class="main__texture _little">
      <template v-if="resource.type === 'resource'">
        <span v-if="resource.action === 'resourceDecrease'" class="_red">-</span>
        <span v-if="resource.action === 'farm'" class="_green">+</span> {{resource.name}}: {{resource.count}}
      </template>
      <template v-if="resource.type==='armor' || resource.type==='weapon' || resource.type==='medical'">
        <span v-if="resource.action === 'alreadyEquipped'" class="_green">Уже надето:</span>
        <span v-if="resource.action === 'itemCreated'" class="_green">Создано:</span>
        <span v-if="resource.action === 'takeOffItem'" class="_red">Снято:</span>
        <span v-if="resource.action === 'notEquipped'" class="_red">Этот предмет не надет:</span>
        <span v-if="resource.action === 'putOnItem'" class="_green">Надето:</span> {{resource.name}}
      </template>
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