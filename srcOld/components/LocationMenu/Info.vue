<script setup>
/**
 * Компонент меню локации */
import {computed, inject, ref, watch} from "vue";
import UIWindowHeader from "@/components/UIUnits/UIWindowHeader.vue";
import List from "@/components/UIUnits/List.vue";

const player = inject('player')
const dialogues = inject('dialogues')
const allCharacters = dialogues.characters
const dialoguesWindowVisibility = ref(false) // видимость окна диалогов

const activeLocation = computed(() => {
  return player.getLocation(player.currentLocation)
})
watch(activeLocation, (newLocation, oldLocation) => {
  dialoguesWindowVisibility.value = false
  !dialogues.activeButton && dialogues.clearDialogue()
})
watch(() => dialogues.activeCharacter, (newCharacter, oldCharacter) => {
  dialogues.switchActiveButton()
  dialogues.switchActiveMessages()
})
const switchActiveCharacter = (newCharacter) => {
  !dialogues.activeButton && dialogues.switchActiveCharacter(newCharacter)
  dialoguesWindowVisibility.value = true
  player.addCondition(`met${newCharacter}`)
  player.changeTime(20, 0)
}
const showBackBtn = computed(() => {
  if (!dialogues.activeMessages.additionalButtons) {
    return true
  }

  for (const button in dialogues.activeMessages.additionalButtons) {
    if (dialogues.activeMessages.additionalButtons[button].visibility)
       return false
    else return true
  }
})

const checkCharacterExists = () => {
  console.log('xyi', player.getLocation(player.currentLocation).npc.find(npc => npc === dialogues.activeCharacter.engName))
  return player.getLocation(player.currentLocation).npc.find(npc => npc === dialogues.activeCharacter.engName)
}
</script>

<template>
  <UIWindowHeader><template #header>{{activeLocation.name}}</template></UIWindowHeader>

  <div class="ui__subWindow flex-column">
    <List :listSource="activeLocation.resources" class="info__resources" key-name="engName">
      <template #objElement="{name, chance}">
        <li class="_little">- {{name}} {{chance[1] - chance[0] + 1}}%</li>
      </template>
    </List>

    <div class="location__actions">
      <button v-if="player.getActiveQuest('findStartedResources').status === 'inProgress'
      && player.getActiveQuest('findStartedResources').visibility
      && player.currentLocation === 'landingZone'"
          @click="player.addCondition('podWasExplored'); player.showResourceBubble({action: 'Обыскать капсулу'},  'doSomeAction')"
              class="main__btn _little _pointer _lil" type="button">
        Обыскать капсулу
      </button>

<!--      <button class="_little _pointer main__btn _lil" type="button"-->
<!--              @click="player.quests.addQuest(player.activeQuests, player.quests.quests.farmResources)">-->
<!--        Добавить квест "Необходимо собрать начальные ресурсы."-->
<!--      </button>-->
    </div>

    <List v-if="activeLocation.npc && activeLocation.npc.length > 0"
          :list-source="activeLocation.npc" class="characters" key-name="character">
      <template #element="{element: newCharacter}">
        <li @click="switchActiveCharacter(newCharacter)" class="main__texture"
            :title="allCharacters[newCharacter].name">{{allCharacters[newCharacter].name[0]}}</li>
      </template>
    </List>

    <div class="dialogue-window main__texture"
         :class="{_visible: dialoguesWindowVisibility}">

      <span class="_close" @click="dialoguesWindowVisibility = false">X</span>

      <template v-if="dialogues.activeCharacter">
        <p v-if="dialogues.activeCharacter && !dialogues.activeButton">
          {{dialogues.activeCharacter.description}}
        </p>

        <List v-if="!dialogues.activeButton"
              :list-source="dialogues.activeCharacter.dialogue"
              class="dialogue__buttons" key-name="title">
          <template #objElement="button">
            <li v-if="button.visibility" @click="dialogues.switchActiveButton(button); player.changeTime(10, 0)" class="dialogue__btn">{{button.title}}</li>
          </template>
        </List>

        <div v-if="dialogues.activeButton"
             class="messages-window">

          <div class="messages">
            <p v-for="message of dialogues.activeMessages.text">
              {{message}}
            </p>
          </div>

          <div v-if="dialogues.activeMessages.additionalButtons
          && Object.keys(dialogues.activeMessages.additionalButtons).length !== 0" class="btn__container">
            <template v-for="(button, key) of dialogues.activeMessages.additionalButtons">
              <button v-if="button.visibility"
                      type="button"
                      class="message-btn _little"
                      @click="dialogues.handleButton(button, player);
                      player.changeTime(2)">
                {{button.text}}
              </button>
            </template>
          </div>

          <div v-if="showBackBtn"  class="btn__container">
            <button type="button"
                    class="message-btn _little" @click="dialogues.backDialogue();
                    checkCharacterExists() ? '' : dialoguesWindowVisibility = false">
              Назад
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style>
.info__resources {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-content: center;
  gap: 10px;
  max-width: 50%;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.info__resources li {
  text-align: right;
}

.characters {
  display: flex;
  position: absolute;
  flex-direction: column;
  gap: 10px;
  right: calc(100% + 10px);
  z-index: 2;
}
.characters li {
  width: 40px;
  height: 40px;
  border-radius: var(--radius);
  text-align: center;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialogue-window {
  z-index: 1;
  bottom: 0;
  position: absolute;
  right: 100%;
  width: calc(100dvw - 811px);
  height: 100%;
  max-height: 350px;
  border-bottom: none;
  border-radius: var(--radius) var(--radius) 0 0;
  padding: 10px 10px 10px 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition-duration: var(--transition);
  transform: translateY(100%);
}
.dialogue-window._visible {
  transform: translateY(0);
}
.dialogue-window ._close {
  position: absolute;
  cursor: pointer;
  left: 10px;
  top: 10px;
}

.dialogue__buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.messages-window, .messages {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1 1 auto;
  overflow: auto;
}
.dialogue__btn, .message-btn {
  display: flex;
  padding: 10px;
  background-color: var(--border-color);
  border-radius: var(--radius);
  text-align: center;
  justify-content: center;
  color: white;
  cursor: pointer;
}
.btn__container {
  display: flex;
  justify-content: space-between;
  align-content: center;
}

.location__actions .main__btn {
  border-radius: 5px;
  border-top: 1px solid var(--border-color);
}
</style>
