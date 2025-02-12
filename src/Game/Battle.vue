<script setup>
/**
 * Компонент окна битвы */
import {computed, inject, ref, watch} from "vue";

const visibility = inject('battleWindowVisibility')
const player = inject('player')


const calcAttack = () => {
  console.log('Расчитываем новую атаку')
  if (!player.activeEnemy) return

  const attackPool = player.activeEnemy && player.activeEnemy.attackTypes
  // let newAttack = attackPool[Math.floor(Math.random()*attackPool.length)]
  //
  // if (!prevAttack) {
  //   prevAttack.value = newAttack
  // }
  // if (prevAttack.value && prevAttack.value.title === newAttack.title) {
  //   newAttack = attackPool[Math.floor(Math.random()*attackPool.length)]
  //   prevAttack.value = newAttack
  // }

  return attackPool[Math.floor(Math.random()*attackPool.length)]
}
const newAttack = ref(undefined)
const battleStep = ref(1)
watch(() => player.activeEnemy, (newEnemy, oldEnemy) => {
  battleStep.value = 1
  newAttack.value = calcAttack()
})

// const prevAttack = ref(undefined)

const nextStep = (playerAction) => {
  battleStep.value+=1
}
watch(battleStep, (newStep, oldStep) => {
  newAttack.value = calcAttack()
})


const clearEnemy = () => {
  visibility.value = false
  setTimeout(() => {
    player.activeEnemy = undefined
  }, 300)

  // prevAttack.value = undefined
}
</script>

<!-- todo должен будет приходить объект монстра, с которым будем пиздица -->

<template>
  <div class="battle__window main__texture" :class="{_closed: !visibility}">
    <div class="enemy" v-if="player.activeEnemy">
      <h3>Вы. Здоровье: {{player.health}}</h3>
      <h3 class="enemy__unit _name">
        {{player.activeEnemy.name}}: <br>
        Здоровье: {{player.activeEnemy.health}}. <br>
        Скорость: {{player.activeEnemy.speed}} <br>
        Адреналин: {{player.activeEnemy.adrenaline}}<br>
        Агрессия: {{player.activeEnemy.aggressive}}<br>
      </h3>
      <p>Ход: {{battleStep}}</p>


      <div class="enemy__actions">
        {{newAttack.text}}
      </div>

      <br>

      <div class="enemy__buttons">
        <p @click="nextStep('attack')">Атаковать</p>
<!--        <p>Использовать книгу заклинаний</p>-->
        <p @click="nextStep('stepBack')">Отойти назад</p>
        <p @click="nextStep('jumpSide')">Прыжок в сторону</p>
        <p @click="clearEnemy">Уйти</p>
      </div>
    </div>


    <p>
      {{player.activeEnemy}}
    </p>
  </div>
</template>

<style>
.battle__window {
  position: fixed;
  inset: 0 30px 100px 30px;
  transition-duration: var(--transition);
  z-index: 3;
  border-radius: 0 0 var(--radius) var(--radius);
  padding: 10px;
}
.battle__window._closed {
  transform: translateY(-100%);
}
.enemy {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.enemy__buttons {
  position: absolute;
  bottom: 10px;
  right: 10px;
  left: 10px;
  top: auto;
  display: flex;
  align-items: center;
  gap: 20px
}
.enemy__buttons p {
  cursor: pointer;
}
</style>