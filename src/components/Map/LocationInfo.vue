<script setup lang="ts">
import {useGameStore} from "@/store/useGameStore.ts";
import {storeToRefs} from "pinia";

const gameStore = useGameStore()
const {currentLocationObj, dialogue, windowsVisibility} = storeToRefs(gameStore)

const openDialogueWindow = (newActiveCharacterName: string) => {
  dialogue.value.setActiveCharacter(dialogue.value.characters[newActiveCharacterName])
  windowsVisibility.value.dialogueWindowVisibility = true
}
const getCharacter = (characterEngName: string): { characterName: string, firstLetterName: string } => {
  const character = dialogue.value.characters[characterEngName]

  if (character) return {characterName: character.name, firstLetterName: character.name[0]}
  else return {characterName: 'Персонажа не существует',firstLetterName: '-'}
}
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
        :title="getCharacter(char).characterName"
        @click="openDialogueWindow(char)">{{getCharacter(char).firstLetterName}}</li>
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