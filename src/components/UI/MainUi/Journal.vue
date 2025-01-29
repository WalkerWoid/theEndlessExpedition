<script setup>
/**
 * Компонент журнала */
import {inject} from "vue";

const player = inject('player')
const journal = player.journal
const allHints = inject('allHints')

const clearHint = (thought) => {
  thought.notification = false
}
const deleteHint = (thought) => {
  const thoughtId = journal.indexOf(thought)
  journal.splice(thoughtId, 1)

  player.addHint(allHints.deleteHints)
}

</script>

<template>
  <h2>Журнал</h2>

  <div class="ui__subWindow">
    <p v-if="journal.length === 0">Записей нет...</p>

    <ul v-else class="hints">
      <li v-for="(thought, id) of journal" :key="thought.title" class="_little"
          :class="{_green: thought.notification}"
          @mouseover="clearHint(thought)"
          @click="deleteHint(thought)">
        {{id+1}}. {{thought.text}}
      </li>
    </ul>
  </div>
</template>

<style>
.hints {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.hints li {
  cursor: pointer;
  transition-duration: var(--transition);
}
</style>