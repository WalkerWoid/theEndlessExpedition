<script setup lang="ts">
import {useGameStore} from "@/store/useGameStore.ts";
import {storeToRefs} from "pinia";
import {computed} from "vue";

import type {ButtonConsequence, Character, ChoiceButton} from "@/classes/characters.ts";
import type {DialogueButton} from "@/classes/characters.ts";

import {useIsResourceSimple} from "@/composables/useIsResourceSimple.ts";
import {useGetClone} from "@/composables/useGetClone.ts";

const gameStore = useGameStore()
const {dialogue, windowsVisibility, player, notifications} = storeToRefs(gameStore)

const closeDialogueWindow = () => {
  windowsVisibility.value.dialogueWindowVisibility = false
}
const backFromDialogue = () => {
  closeDialogueWindow()
  dialogue.value.setActiveCharacterPlaceholder()
  dialogue.value.setActiveButtonPlaceholder()
}


const getActiveCharacter = computed<Character>(() => {
  return dialogue.value.activeCharacter
})
const getActiveDialogueButton = computed<DialogueButton>(() => {
  return dialogue.value.activeButton
})
const isActiveDialogueButtonPlaceholder = computed<boolean>(() => {
  return getActiveDialogueButton.value.id === 'buttonPlaceholder'
})


const getCharacterDialogue = computed<DialogueButton[]>(() => {
  const activeDialogue = [] as DialogueButton[]

  getActiveCharacter.value.startedButtons.forEach(btn => {
    activeDialogue.push(dialogue.value.activeCharacter.allButtons[btn])
  })

  return activeDialogue
})

const nextButtonHandler = (choiceButton: ChoiceButton) => {
  dialogue.value.setActiveButton(getActiveCharacter.value.allButtons[choiceButton.next])

  if (choiceButton.once) choiceButton.visibility = false
  if (choiceButton.consequences.length === 0) return

  choiceButton.consequences.forEach(consequence => consequenceHandler(consequence))
}
const consequenceHandler = (consequence: ButtonConsequence): void => {
  switch (consequence.type) {
    case "farmResources":
      consequence.resources.forEach(res => {
        if (useIsResourceSimple(res))
          player.value.inventory.addCockedResourceToInventory(useGetClone(res), notifications.value)
      })
      break
  }
}

/** todo once у dialogueButton убирает его из startedIDialogue
 *  todo visibility у choiceButton делает его нивидимым
 *  */
console.log(dialogue.value)
</script>

<template>
  <div class="dialogue__window" :class="{_hidden: !windowsVisibility.dialogueWindowVisibility}">
    <div class="_shadow"></div>

    <div class="dialogue main__texture" :class="{_hidden: !windowsVisibility.dialogueWindowVisibility}">
      <span class="window__close" @click="backFromDialogue">X</span>

      <p>{{getActiveCharacter.name}}</p>
      <p v-if="isActiveDialogueButtonPlaceholder">{{getActiveCharacter.description}}</p>

      <div class="messages__block">
        <ul class="container _flex" v-if="!isActiveDialogueButtonPlaceholder">
          <li v-for="message of getActiveDialogueButton.messages">
            {{ message }}
          </li>
        </ul>
      </div>

      <div class="buttons__block">
        <ul class="buttons__block dialogue__buttons" v-show="isActiveDialogueButtonPlaceholder">
          <li v-for="mainButton in getCharacterDialogue" :key="mainButton.id"
              class="main__texture"
              @click="dialogue.setActiveButton(mainButton)">
            <p class="jumping__button">
              <span class="_top">{{ mainButton.title }}</span>
              <span class="_center">{{ mainButton.title }}</span>
              <span class="_bottom">{{ mainButton.title }}</span>
            </p>
          </li>

          <li @click="backFromDialogue" class="_back">Уйти</li>
        </ul>

        <ul v-show="!isActiveDialogueButtonPlaceholder" class="buttons__block dialogue__secondButtons">
          <template v-for="choiceButton in dialogue.activeButton.choiceButtons">
            <li v-show="choiceButton.visibility"
                class="main__texture"
                @click="nextButtonHandler(choiceButton)">
              <p class="jumping__button" >
                <span class="_top">{{ choiceButton.text }}</span>
                <span class="_center">{{ choiceButton.text }}</span>
                <span class="_bottom">{{ choiceButton.text }}</span>
              </p>
            </li>
          </template>

          <li class="_pointer _back"
              @click="dialogue.setActiveButtonPlaceholder">Назад</li>
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
._back {
  margin-left: auto;
}
</style>