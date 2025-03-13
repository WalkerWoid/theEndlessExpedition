<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useGameStore} from "@/store/useGameStore.ts";
import {computed, ref, watch} from "vue";

import type {Quest} from "@/classes/quests.ts";

const gameStore = useGameStore()
const {quests, player} = storeToRefs(gameStore)
const isQuestsHidden = ref<boolean>(true)


watch(() => quests.value.quests, (newLength) => {
  console.log('Работает')
  isQuestsHidden.value = Object.keys(quests.value.activeQuests).length === 0 ||
      Object.values(quests.value.activeQuests).filter(quest => quest.visibility).length === 0
}, {deep: true, immediate: true})
const isQuestsVisible = computed<boolean>(() => {
  return Object.keys(quests.value.quests).length === 0 ||
      Object.values(quests.value.quests).filter((quest: Quest) => !quest.visibility).length !== 0
})
</script>

<!--
  Сделал todo Добавление квестов
  Сделал todo Уведомления новых квестов
  Сделал todo Проверка квестов
  Сделал todo Сокрытие квестов
  Сделал todo Добавление условий через диалоги у квестов
-->

<template>
  <h2 class="subWindow__header">Задания</h2>

  <p @click="quests.addQuest('farmResources')">Добавить задание</p>

  <p v-if="isQuestsHidden">Ноу квестс из хиа...</p>

  <div class="container _flex" v-else>
    <ul class="quests__container">
      <TransitionGroup name="quest">
        <template v-for="quest of quests.activeQuests as Quest[]">
          <li v-if="quest.visibility" class="quest"
              :title="quest.hint"
              @click="quests.checkQuest(quest, player.inventory)"
              @mouseover="quests.clearQuest(quest)" :key="quest.id">
            <h5 @click="quest.status === 'completed' && quests.hideQuest(quest)">
              {{quest.title}}
              <Transition name="questProgression" mode="out-in">
                <span v-if="quest.status === 'inProgress'" class="_orange _little">В процессе</span>
                <span v-else class="_green _little">Завершен</span>
              </Transition>

              <Transition name="quest" mode="out-in">
                <span v-if="quest.isNew" class="_green _little">новый!</span>
              </Transition>
            </h5>

            <Transition name="questText" mode="out-in">
              <p :key="quest.status">{{quest.text}}</p>
            </Transition>
          </li>
        </template>
      </TransitionGroup>
    </ul>
  </div>
</template>

<style>
.quests__container {
  display: flex;
  flex-direction: column;
  gap: var(--gap)
}
.quest {
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap-half);
  cursor: pointer;
}
.quest h5 {
  font-size: 24px;
  display: flex;
  align-items: flex-end;
  gap: var(--gap-half);
}


.questProgression-enter-active,
.questProgression-leave-active,
.questText-enter-active,
.questText-leave-active,
.quest-enter-active,
.quest-leave-active {
  transition-duration: var(--transition);
}

.questProgression-enter-from,
.questProgression-leave-to,
.questText-enter-from,
.questText-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}
.questProgression-enter-to,
.questProgression-leave-from,
.questText-enter-to,
.questText-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.questText-enter-active,
.questText-leave-active {
  transition-delay: .1s;
}

.quest-move {
  transition-duration: var(--transition);
}
.quest-enter-from,
.quest-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}
.quest-enter-to,
.quest-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>