<script setup>
/**
 * Компонент игрока. Окно игрока */

/*  todo нарисовать окно персонажа
    todo нарисовать кнопочку player для окна персонажа
    todo сделать отдельное окно для игрока */

import {ref, onMounted, onUpdated} from "vue";
const definedProps = defineProps(['player'])

onMounted(() => {
  console.log('Объект игрока', definedProps.player)
  initPlayer()
})
onUpdated(() => {
  // console.log(definedProps.player)
})

const wounds = ref([])
const negativeEffects = ref([])

const initPlayer = () => {
  /** todo сделать как вычислячемое значение */
  const getFull = (stringValue) => {
      return definedProps.player.body.reduce((accum, partOfBody) => {
        return accum+=partOfBody[`${stringValue}`]
      }, 0)
  }

  definedProps.player.fullArmor = getFull('armor')
  definedProps.player.fullDamage = getFull('damage')
  definedProps.player.fullSpeed = getFull('speed')
}
</script>

<template>
  <h2 class="h2__header">Личный инвентарь</h2>

  <div class="player__status">
    <div class="player__line">
      <h3 class="main__text">Имя:</h3>
      <p class="main__text _little">{{player.name}}</p>
    </div>

    <div class="player__line">
      <h3 class="main__text">Общая броня:</h3>
      <p class="main__text _little">{{player.fullArmor}}</p>
    </div>

    <div class="player__line">
      <h3 class="main__text">Общий урон:</h3>
      <p class="main__text _little">{{player.fullDamage}}</p>
    </div>

    <div class="player__line">
      <h3 class="main__text">Общая скорость:</h3>
      <p class="main__text _little">{{player.fullSpeed}}</p>
    </div>

    <div v-for="partOfBody of player.body" class="player__part" :key="partOfBody.engName">
      <div class="player__line">
        <h4 class="main__text">{{partOfBody.name}}:</h4>

        <!-- todo нарисовать иконки для брони, оружия и так далее -->
        <div v-if="partOfBody?.armor" class="part__info">
          <h5 class="main__text _little">Защита:</h5>
          <p class="main__text _little">{{partOfBody.armor}}</p>
        </div>
        <div v-if="partOfBody?.damage" class="part__info">
          <h5 class="main__text _little">Урон:</h5>
          <p class="main__text _little">{{partOfBody.damage}}</p>
        </div>
        <div v-if="partOfBody?.speed" class="part__info">
          <h5 class="main__text _little">Скорость:</h5>
          <p class="main__text _little">{{partOfBody.speed}}</p>
        </div>
        <div class="part__info">
          <h5 class="main__text _little">Экипировано:</h5>
          <p v-if="partOfBody.equipped" class="main__text _little">{{partOfBody.equipped.name}}</p>
          <p v-else class="main__text _little">Ничего</p>
        </div>
        <div class="part__info">
          <h5 class="main__text _little">Раны:</h5>
          <p v-if="partOfBody.wounds" class="main__text _little">Список ран</p>
          <p v-else class="main__text _little">Ранений нет</p>
        </div>
        <div class="part__info">
          <h5 class="main__text _little">Болезни:</h5>
          <p v-if="partOfBody.negativeEffects" class="main__text _little">Список болезней</p>
          <p v-else class="main__text _little">Болезней нет</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .player__status {
    display: flex;
    overflow: auto;
    max-height: calc(700px - 48px);
    padding: 15px 0;
    flex: 1;
    flex-direction: column;
    gap: 20px;
  }
  .player__line {
    display: flex;
    gap: 5px;
    flex-direction: column;
  }
  .player__status > .player__line {
    flex-direction: row;
    align-items: center;
  }
  .part__info {
    display: flex;
    gap: 15px;
  }

</style>