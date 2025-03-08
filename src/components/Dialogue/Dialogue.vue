<script setup lang="ts">
import {useGameStore} from "@/store/useGameStore.ts";
import {storeToRefs} from "pinia";
import {computed} from "vue";

import type {Character} from "@/classes/characters.ts";
import type {DialogueButton} from "@/classes/characters.ts";

const gameStore = useGameStore()
const {dialogue, windowsVisibility} = storeToRefs(gameStore)


const closeDialogueWindow = () => {
  windowsVisibility.value.dialogueWindowVisibility = false
}


const getActiveCharacterInfo = computed<{name: string, description: string}>(() => {
  const activeCharacter: Character | undefined = dialogue.value.activeCharacter

  if (activeCharacter) return {name: activeCharacter.name, description: activeCharacter.description}
  else return {name: 'Имени персонажа нет', description: 'Описания персонажа нет'}
})
const getActiveDialogueButton = computed<DialogueButton | undefined>(() => {
  return dialogue.value.activeButton
})
</script>

<template>
  <div class="dialogue__window" :class="{_hidden: !windowsVisibility.dialogueWindowVisibility}">
    <div class="_shadow"></div>

    <div class="dialogue main__texture" :class="{_hidden: !windowsVisibility.dialogueWindowVisibility}">
      <span class="window__close" @click="closeDialogueWindow">X</span>

      <p>{{getActiveCharacterInfo.name}}</p>
      <p v-if="!getActiveDialogueButton">{{getActiveCharacterInfo.description}}</p>

      <div class="messages__block">
        <ul v-if="getActiveDialogueButton">

          <li class="_pointer" @click="dialogue.activeButton = undefined">Назад</li>
        </ul>
      </div>
      
      <div class="buttons__block" v-if="dialogue.activeCharacter">
        <ul class="buttons__block dialogue__buttons" v-if="!getActiveDialogueButton">
          <li v-for="button in dialogue.activeCharacter.dialogue"
              class="main__texture"
              @click="dialogue.setActiveButton(button)">
            <p class="jumping__button">
              <span class="_top">{{ button.title }}</span>
              <span class="_center">{{ button.title }}</span>
              <span class="_bottom">{{ button.title }}</span>
            </p>
          </li>
        </ul>

        <ul v-else class="buttons__block dialogue__secondButtons">
          <template v-if="getActiveDialogueButton">
            <li v-for="button in getActiveDialogueButton.messages.additionalButtons"
                class="main__texture">
              <p class="jumping__button">
                <span class="_top">{{ button.text }}</span>
                <span class="_center">{{ button.text }}</span>
                <span class="_bottom">{{ button.text }}</span>
              </p>
            </li>
            <li>Уйти</li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<style>
.dialogue__window {
  transition-duration: var(--transition);
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}
.dialogue__window._hidden {
  z-index: -1;
  transition-delay: .2s;
}

.dialogue {
  width: 80%;
  height: 80%;
  z-index: 2;
  border-radius: var(--radius-half);
  position: relative;
  padding: var(--gap) calc(var(--gap) * 2);
  display: flex;
  flex-direction: column;
  gap: var(--gap);
  transition-duration: var(--transition);
  transition-delay: .2s;
  overflow: hidden;
}
.dialogue._hidden {
  transform: translateY(-120%);
  transition-delay: 0s;
  opacity: 1;
}

.messages__block {
  overflow: auto;
  flex: 1 auto;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: var(--gap);
}


.buttons__block {
  display: flex;
  align-items: center;
  gap: var(--gap);
  width: 100%;
  transition-duration: 1s;
}
.buttons__block li {
  padding: var(--gap-half);
  border-radius: var(--radius-half);
  cursor: pointer;
}
</style>