<script setup>/**
 * Компонент рандомных эвентов */
import {computed, inject} from "vue";

const player = inject('player')
const eventsWindowVisibility = inject('eventsWindowVisibility')
const battleWindowVisibility = inject('battleWindowVisibility')

const activeEnemy = computed(() => {
  return player.activeEnemy
})
</script>

<!-- todo сюда будет прилетать объект с эвентом -->

<template>
  <div class="events__shadow _left"
       :class="{_closed: !eventsWindowVisibility}"></div>
  <div class="events__shadow _right"
       :class="{_closed: !eventsWindowVisibility}"></div>

  <div class="events__container" :class="{_closed: !eventsWindowVisibility}">
    <div class="events main__texture">
      <picture class="event__image">
        <source srcset="" @media="">
        <img src="@/assets/images/events/povizka.png" alt="povozka">
      </picture>

      <h4>Вы напали на "{{activeEnemy?.name}}"</h4>
      <p>{{activeEnemy?.meetText[Math.floor(Math.random() * activeEnemy.meetText.length)]}}</p>
    </div>

    <div class="fight__choose">
      <p class="main__texture"
         @click="battleWindowVisibility = true; eventsWindowVisibility = false" title="Напасть!">Н!</p>
      <p class="main__texture"
         @click="eventsWindowVisibility = false" title="Уйти">У</p>
    </div>
  </div>
</template>

<style>
.events__container {
  position: fixed;
  z-index: 1000;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  transition-duration: var(--transition);
  width: calc(100dvw - 20%);
  height: calc(100vh - 20%);
}
.events__container._closed {
  transform: translate(-50%, 100%);
}

.events__shadow {
  z-index: 1000;
  background-color: rgba(0,0,0,.5);
  position: absolute;
  opacity: 1;
  transition-duration: var(--transition);
  width: 50%;
  top: 0;
  bottom: 0;
}
.events__shadow._left {
  left: 0;
}
.events__shadow._right {
  right: 0;
}
.events__shadow._left._closed {
  opacity: 0;
  z-index: -1;
}
.events__shadow._right._closed {
  opacity: 0;
  z-index: -1;
}


.events {
  z-index: 2;
  padding: 20px;
  border-radius: var(--radius);
  background-color: white;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  height: 100%;
}
.event__image {
  display: flex;
  overflow: hidden;
  border-radius: var(--radius);
}
.event__image img {
  width: 100%;
  height: auto;
  max-width: 100%;
  object-fit: cover;
}

.fight__choose {
  z-index: 2;
  position: absolute;
  left: -40px;
  top: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.fight__choose > p {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
}
</style>