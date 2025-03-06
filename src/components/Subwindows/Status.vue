<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useGameStore} from "@/store/useGameStore.ts";
import {bodyDescription} from "@/classes/player.ts";
import type {BattleRecipe} from "@/classes/allRecipes.ts";
import {useGetClone} from "@/composables/useGetClone.ts";

const gameStore = useGameStore()
const {player, currentLocationObj, notifications} = storeToRefs(gameStore)

const isItemOnBody = (bodyPart: BattleRecipe | boolean): bodyPart is BattleRecipe => {
  return typeof bodyPart === 'object' && 'name' in bodyPart && 'bodyType' in bodyPart && 'durability' in bodyPart
}
</script>
<!-- todo сделать потом в статусе полноценное окно персонажа. ТИпа нарисованный силует перса с расставленными в разные
      стороны руками и ногами. -->

<!-- todo не видно типы -->
<template>
  <div class="subWindow__header">Статус</div>

  <div class="container _flex">
    <ul class="status__container">
      <li class="status__li">Имя: {{player.name}}</li>
      <li class="status__li">Место: {{currentLocationObj ? currentLocationObj.name : 'Локация не определена'}}</li>
      <li class="status__li">Псевдоним: {{player.secondName}}</li>
      <li class="status__li">Порядковый номер: {{player.playerNumber}}</li>

      <template v-for="(bodyPart, key) in player.body">
        <li v-if="isItemOnBody(bodyPart)"
            class="status__li" :class="{_pointer: isItemOnBody(bodyPart)}"
            :title="'Осталось прочности ' + bodyPart.durability"
            @click="player.takeOffItem(useGetClone(bodyPart), notifications)">
            {{bodyDescription[bodyPart.bodyType]}}: {{ bodyPart.name }}
        </li>

        <li v-else>
          {{bodyDescription[key]}}: Ничего не надето
        </li>
      </template>

      <li class="status__li _pointer">Статус: {{player.status}}</li>

      <li class="status__li _effects">Полученные эффекты и травмы:
        <span v-if="player.effects.length === 0">Вы здоровы! В ближайшее время не умрете.</span>

        <template v-else>
          <span v-for="effect in player.effects" :title="`Осталось тиков: ${effect.ticks}`">{{effect.name}};</span>
        </template>
      </li>
    </ul>
  </div>
</template>

<style>
.status__container {
  display: flex;
  gap: var(--gap);
  flex-direction: column;
}
._effects {
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap-half)
}
</style>