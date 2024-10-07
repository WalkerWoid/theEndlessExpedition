<script setup>
/**
 * Компонент окна персонажа */

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
  rightLeg: 'Правая нога',
  weapon: 'Оружие',
  shield: 'Щит'
}
/**
 * Объект описания негативных эффектов */
const negativeEffects = {

}
/**
 * Объект описания позитивных эффектов */
const positiveEffects = {

}

/** Получение основной инфы предмета. Отображается при наведении на предмет.
 *
 * @param {object} partOfBody шмотка, лежащая в какой-то части тела.
 * @returns {string} */
const getMainInfo = (partOfBody) => {
  if (!partOfBody) {
    return 'Информации нет'
  }
  const damage = definedProps.player.getItemInfo(partOfBody, 'damage').value
  const armor = definedProps.player.getItemInfo(partOfBody, 'armor').value
  const speed = definedProps.player.getItemInfo(partOfBody, 'speed').value

  return `Урон: ${damage}, Броня: ${armor}, Скорость: ${speed}`
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
      <p>Урон: {{player.fullDamage}}</p>
    </div>

    <div class="status__row">
      <p>Броня: {{player.fullArmor}}</p>
    </div>

    <div class="status__row">
      <p>Скорость: {{player.fullSpeed}}</p>
    </div>

    <div class="status__row" v-for="(part, key) of player.body">
      <p @click="player.takeOffItem(player.getPartOfBody(key))"
         :class="{_pointer: player.getPartOfBody(key)}"
         :title="getMainInfo(part)">
        {{body[key]}}: {{player.getPartOfBody(key) ? player.getPartOfBody(key).name : 'ничего не надето'}}.
        <span class="_little">{{player.getPartOfBody(key) ? 'Осталось прочности: '+player.getPartOfBody(key).durability : ''}}</span>
      </p>
      <!--      <button @click="console.log(player.getPartOfBody(key)); player.getPartOfBody(key).durability *= 0.5">Сломать предмет на половину</button>-->
      <!--      <button @click="console.log(player.getPartOfBody(key)); player.getPartOfBody(key).durability *= 0.25">Сломать предмет на четверть</button>-->
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