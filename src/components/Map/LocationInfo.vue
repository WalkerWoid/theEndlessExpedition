<script setup lang="ts">
import {useGameStore} from "@/store/useGameStore.ts";
import {storeToRefs} from "pinia";

const gameStore = useGameStore()
const {currentLocationObj, characters} = storeToRefs(gameStore)
</script>

<template>
  <div class="subWindow__header">{{currentLocationObj.name}}</div>

  <ul class="location__resources">
    <li class="_little"
        v-for="{name, chance} of currentLocationObj.resources"
        :title="name">
      {{name}}: {{chance[1] - chance[0] + 1}}%
    </li>
  </ul>

  <ul class="location__characters">
    <li v-for="char of currentLocationObj.npc"
        class="main__btn"
        :title="characters[char].name">{{characters[char].name[0]}}</li>
  </ul>

  <div class="container _flex">

  </div>
</template>

<style>
.location__resources {
  position: absolute;
  right: var(--gap);
  top: var(--gap);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--gap-half)
}
.location__resources li {
  text-align: right;
  cursor: pointer;
}

.location__characters {
  position: absolute;
  top: var(--gap);
  right: calc(100% + var(--gap))
}
.location__characters li {
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
}
</style>