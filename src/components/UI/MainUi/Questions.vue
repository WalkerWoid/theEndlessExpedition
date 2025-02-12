<script setup>
/**
 * Компоненты окна квестов */

import {computed, getCurrentInstance, inject, onMounted, onUpdated, ref, watch} from "vue";
import List from "@/components/UIUnits/List.vue";
import UIWindowHeader from "@/components/UIUnits/UIWindowHeader.vue";

const player = inject('player')
const allHints = inject('allHints')
const hideNewNotification = (id) => {
  player.activeQuests[id].isNew = false
}

const questClick = (id) => {
  player.addHint(allHints.questFirstClick)
  player.quests.checkQuest(player.getActiveQuest(id), player)
}

const showEmptyQuestsText = ref(false)

watch(() => player.activeQuests, (newActiveQuests, oldActiveQuests) => {
  const keys = Object.keys(player.activeQuests)

  if (keys.filter((key) => {
    return player.activeQuests[key].visibility === true
  }).length === 0)
    showEmptyQuestsText.value = true
}, {deep: true, immediate: true})
</script>

<template>
  <UIWindowHeader><template #header>Задания </template></UIWindowHeader>

  <div class="ui__subWindow">
    <p v-if="showEmptyQuestsText">Заданий нет...</p>

    <List v-else class="questions" :list-source="player.activeQuests" key-name="id">
      <template #objElement="{visibility, hint, id, index, title, status, text, isNew}">
        <li v-if="visibility" :title="hint" @click="questClick(id)" @mouseover="hideNewNotification(id)">
          <h5 @click="status === 'completed' && player.hideQuest(id)">
            <span class="_little">{{index+1}}</span>.
            {{title}}
            <span v-if="status === 'inProgress'" class="_orange _little">В процессе</span>
            <span v-if="status === 'completed'" class="_green _little">Завершен</span>
            <span v-if="isNew" class="_green _little" style="margin-left: 10px">новый!</span>
          </h5>

          <p>{{text}}</p>
        </li>
      </template>
    </List>
  </div>
</template>

<style>
.questions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.questions li {
  cursor: pointer;
}
</style>