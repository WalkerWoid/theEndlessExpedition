<script setup>
/**
 * Компонент окна персонажа */
import {inject, watch} from "vue";

const player = inject('player')
const dialogues = inject('dialogues')

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

const firstClickStatus = () => {
  if (player.quests.quests.checkMyStatus.wasStarted) {
    return
  }

  player.quests.addQuest(player.activeQuests, player.quests.quests.checkMyStatus)

  dialogues.handleConsequence({
    type: 'changeButtonVisibility',
    character: 'logbook', // всегда
    mainButton: 'knowMyStatus', // всегда
    action: 'show', // всегда
    secondButton: false, // опционально
    additionalButton: false // опционально
  }, player)
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

    <div class="status__row" v-for="(part, key) of player.body" :class="{_pointer: player.body[key]}">
      <p :title="'Осталось прочности ' + player.body[key].durability"
         @click="player.body[key] && player.takeOffItem(part)">
        {{body[key]}}: {{player.body[key].name ?? 'Ничего не надето'}}
      </p>
    </div>

    <div class="status__row _pointer" @click="firstClickStatus()">
      <p>Статус: {{player.status}}</p>
    </div>

    <div class="status__row">
      <p>Полученные эффекты и травмы:
        <span class="_little"
              v-for="effect of player.effects"
              :key="effect.name"
              :title="'Осталось часов ' + effect.ticks">
          {{effect.name}};
        </span>

        <span v-if="player.effects.length === 0">Эффектов нет</span>
      </p>
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