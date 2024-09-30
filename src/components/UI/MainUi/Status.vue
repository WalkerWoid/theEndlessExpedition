<script setup>
/**
 * Компонент окна персонажа */

import {onMounted} from "vue";
const definedProps = defineProps(['player'])

/**
 * Описание частей тела */
const body = {
  head: 'Голова',
  body: 'Тело',
  leftArm: 'Левая рука',
  rightArm: 'Правая рука',
  leftWrist: 'Левое запястье',
  rightWrist: 'Правое запястье',
  leftLeg: 'Левая нога',
  rightLeg: 'Правая нога'
}

</script>

<!-- todo сделать потом в статусе полноценное окно персонажа. ТИпа нарисованный силует перса с расставленными в разные
      стороны руками и ногами. -->
<template>
  <h2>Статус</h2>

  <div class="player__status">
    <div class="status__row">
        <p>Имя: {{player.name}}</p>
    </div>

    <div class="status__row">
      <p>Место: {{player.getLocation(player.currentLocation).name}}</p>
    </div>

    <div class="status__row" v-for="(part, key) of player.body">
      {{key}}
      <p @click="player.takeOffItem(player.getPartOfBody(key))" :class="{_pointer: player.getPartOfBody(key)}">
        {{body[key]}}: {{player.getPartOfBody(key) ? player.getPartOfBody(key).name : 'ничего не надето'}}.
        <span class="_little">{{player.getPartOfBody(key) ? 'Осталось прочности: '+player.getPartOfBody(key).durability : ''}}</span>
      </p>
      <button @click="console.log(player.getPartOfBody(key)); player.getPartOfBody(key).durability *= 0.5">Сломать предмет на половину</button>
      <button @click="console.log(player.getPartOfBody(key)); player.getPartOfBody(key).durability *= 0.25">Сломать предмет на четверть</button>
    </div>
  </div>
</template>

<style>
.player__status {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.status__row {

}
</style>