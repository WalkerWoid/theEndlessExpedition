<script setup>
/**
 * Компонент UI */
import {computed, defineAsyncComponent, inject, reactive, ref} from "vue";

const TopMenu = defineAsyncComponent(() => import("@/components/UI/TopMenu.vue"))
const Recipes = defineAsyncComponent(() => import("@/components/UI/MainUi/Recipes.vue"))
const Inventory = defineAsyncComponent(() => import("@/components/UI/MainUi/Inventory.vue"))
const Status = defineAsyncComponent(() => import("@/components/UI/MainUi/Status.vue"))
const player = inject('player')

const activeWindow = ref('Status')
const topMenuButtons = {
  'Recipes': Recipes,
  'Inventory': Inventory,
  'Status': Status
}
const uiWindowsVisibility = reactive({
  topMenu: true,
  statusMenu: true
})


const healthPercentage = computed(() => {
  return (player.health/player.maxHealth) * 100
})
const foodPercentage = computed(() => {
  return (player.food/player.maxFood) * 100
})
const waterPercentage = computed(() => {
  return (player.water/player.maxWater) * 100
})
</script>

<template>
  <div class="ui">
    <div class="ui__top main__texture" :class="{'_hidden': !uiWindowsVisibility.statusMenu}">
      <p class="_little status__row status__time">Время: 22:00</p>
      <p class="_little status__row">
        <span class="status__bar _health _tiny">
          <span class="status__value">{{player.health}}</span>
          <span class="_filled" :style="{'width': `${healthPercentage}%`}"></span>
        </span>
      </p>
      <p class="_little status__row">
        <span class="status__bar _food _tiny">
          <span class="status__value">{{player.food}}</span>
          <span class="_filled" :style="{'width': `${foodPercentage}%`}"></span>
        </span>
      </p>
      <p class="_little status__row">
        <span class="status__bar _water _tiny">
          <span class="status__value">{{player.water}}</span>
          <span class="_filled" :style="{'width': `${waterPercentage}%`}"></span>
        </span>
      </p>

      <p class="_little status__key" @click="player.health -= 20">здоровье</p>
      <p class="_little status__key" @click="player.food -= 20">еда</p>
      <p class="_little status__key" @click="player.water -= 20">вода</p>
      <span @click="uiWindowsVisibility.statusMenu = !uiWindowsVisibility.statusMenu"
            class="main__texture _big">^</span>
    </div>

    <TopMenu v-model:active-window="activeWindow" :uiWindowsVisibility="uiWindowsVisibility">
      <template #recipes>Рецепты</template>
      <template #inventory>Инвентарь</template>
      <template #status>Статус</template>
    </TopMenu>

    <div class="ui__window _main main__texture" :class="{_closed: !uiWindowsVisibility.topMenu}">
      <div class="ui__window _main main__texture">
        <span class="window__close" @click="uiWindowsVisibility.topMenu = false">X</span>
        <Component :is="topMenuButtons[activeWindow]" />
      </div>
    </div>
  </div>
</template>

<style>
.ui {
  position: fixed;
  inset: 0;
  z-index: 1;
}

.ui__window {
  position: absolute;
  transition-duration: var(--transition);
  padding: 5px 20px 5px 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.ui__subWindow {
  max-height: 100%;
  overflow: auto;
  height: 100%;
  scrollbar-gutter: stable;
}
.window__close {
  position: absolute;
  top: 10px;
  left: 10px;
  cursor: pointer;
}
.ui__window._main {
  bottom: 0;
  right: 0;
  height: 600px;
  max-width: 800px;
  width: 100%;
  border-bottom: none;
  border-right: none;
  border-radius: var(--radius) 0 0 0;
  transform: translateY(0);
}
.ui__window._main._closed {
  transform: translateY(calc(100% + 62px));
}

.ui__top {
  position: absolute;
  top: 0;
  transition-duration: var(--transition);
  z-index: 4;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 20px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 4px 8px;
}
.ui__top._hidden {
  opacity: 1;
  transform: translate(-50%, -100%);
}
.ui__top > span {
  cursor: pointer;
  position: absolute;
  top: calc(100%);
  left: 50%;
  transform: translateX(-50%) rotate(180deg);
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.status__row {
  display: flex;
  align-items: center;
  gap: 4px;
}
.status__time {
  grid-column: span 3;
  justify-self: center;
}

.status__bar {
  position: relative;
  display: flex;
  flex: 1;
  min-width: 58px;
  height: 18px;
  border: 1px solid var(--border-color);
  background-color: var(--border-color);
}
.status__key {
  text-align: center;
}
.status__value {
  position: absolute;
  inset: 0;
  text-align: center;
  color: #fff;
}
.status__bar ._filled {
  transition-duration: var(--transition);
  display: flex;
  align-content: center;
  justify-content: center;
  color: #ffffff;
}
.status__bar._health {
  background-color: var(--health-empty-color);
}
.status__bar._health ._filled {
  background-color: var(--health-color);
}
.status__bar._food {
  background-color: var(--food-empty-color);
}
.status__bar._food ._filled {
  background-color: var(--food-color);
}
.status__bar._water {
  background-color: var(--water-empty-color);
}
.status__bar._water ._filled {
  background-color: var(--water-color);
}
</style>