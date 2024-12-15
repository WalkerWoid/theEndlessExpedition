<script setup>
/**
 * Компонент окна персонажа */
import {inject, watch} from "vue";

const player = inject('player')

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
  rightLeg: 'Правая нога',
  weapon: 'Оружие',
  shield: 'Щит'
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

    <div class="status__row">
      <p>Псевдоним: {{player.secondName}}</p>
    </div>

    <div class="status__row">
      <p>Порядковый номер: {{player.number}}</p>
    </div>

    <div class="status__row">
      <p>Статус: {{player.status}}</p>
    </div>

<!--    <div class="status__row">-->
<!--      <p>Урон: {{player.fullDamage}}</p>-->
<!--    </div>-->

<!--    <div class="status__row">-->
<!--      <p>Броня: {{player.fullArmor}}</p>-->
<!--    </div>-->

<!--    <div class="status__row">-->
<!--      <p>Скорость: {{player.fullSpeed}}</p>-->
<!--    </div>-->

    <div class="status__row" v-for="(part, key) of player.body" :class="{_pointer: player.body[key]}">
      <p :title="'Осталось прочности ' + player.body[key].durability"
         @click="player.body[key] && player.takeOffItem(part)">
        {{body[key]}}: {{player.body[key].name ?? 'Ничего не надето'}}
      </p>
<!--      <button @click="player.body[key].durability -= 2">Минус два прочности</button>-->
    </div>

  </div>
</template>

<style>
.player__status {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: auto;
  max-height: 100%;
  height: 100%;
}
.status__row {

}
</style>