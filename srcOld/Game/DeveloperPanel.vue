<script setup>
import {inject, onMounted} from "vue";

const player = inject('player')
let adminPanel = undefined
onMounted(() => {
   adminPanel = document.querySelector('.developerPanel')
})
const togglePanel = () => {
  adminPanel.classList.toggle('_close')
}
</script>

<template>
  <div class="developerPanel main__texture _close">
    <ul class="developerPanel__list">
      <li @click="console.clear()">Почистить консоль</li>
      <li @click="console.log(player)">Консоль игрока</li>
      <li @click="console.log(player.body)">Консоль тела игрока</li>
      <li @click="console.log(player.activeQuests)">Консоль активных квестов</li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
    <span class="togglePanel" @click="togglePanel">-></span>
  </div>
</template>

<style>
.developerPanel {
  position: fixed;
  bottom: 0;
  top: 0;
  left: 0;
  min-width: 200px;
  z-index: 1000;
  padding: 10px;
  transition-duration: var(--transition);
}
.developerPanel._close {
  transform: translateX(-100%);
}
.developerPanel__list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.developerPanel__list li {
  font-size: 18px;
  cursor: pointer;
  border-bottom: 1px solid var(--border-color);
}
.developerPanel__list li:hover {
  background-color: var(--main-color);
}

.developerPanel .togglePanel {
  position: absolute;
  right: -40px;
  bottom: -1px;
  width: 40px;
  height: 20px;
  background-color: var(--main-color);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
</style>