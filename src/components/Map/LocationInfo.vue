<script setup lang="ts">
import {useGameStore} from "@/store/useGameStore.ts";
import {storeToRefs} from "pinia";

import type {Character} from "@/classes/characters.ts";


const gameStore = useGameStore()
const {currentLocationObj, dialogue, windowsVisibility} = storeToRefs(gameStore)

const openDialogueWindow = (newActiveCharacterName: string) => {
  dialogue.value.setActiveCharacter(newActiveCharacterName)
  windowsVisibility.value.dialogueWindowVisibility = true
}
const getCharacter = (characterEngName: string): Character => {
  const character: Character = dialogue.value.characters[characterEngName]

  if (character) return character
  else return dialogue.value.getPlaceholderCharacter()
}
</script>

<template>
  <h2 class="subWindow__header">{{currentLocationObj.name}}</h2>

  <ul class="location__resources">
    <li class="_little"
        v-for="{name, engName, chance} of currentLocationObj.resources" :key="engName"
        :title="name">
      {{name}}: {{chance[1] - chance[0] + 1}}%
    </li>
  </ul>

  <ul class="location__characters">
    <li v-for="char of currentLocationObj.npc"
        class="main__btn"
        :title="getCharacter(char).name" :key="getCharacter(char).id"
        @click="openDialogueWindow(char)">{{getCharacter(char).name[0]}}</li>
  </ul>
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