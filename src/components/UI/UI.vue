<script setup>
/**
 * Компонент UI */

import {computed, reactive} from "vue";
import Recipes from "@/components/UI/MainUi/Recipes.vue";
import Inventory from "@/components/UI/MainUi/Inventory.vue";
import Status from "@/components/UI/MainUi/Status.vue";

const definedProps = defineProps(['inventory', 'recipes', 'player'])

/**
 * Объект разных всплывающих окон
 *
 * @property {boolean} [visibility] видимо ли окно или нет
 * @property {number} [activeIndex] индекс активного окна. По не му будет выбираться нужный компонент из массива
 *  компонентов для этого окна:
 *    * mainWindow - mainButtons
 *
 * @method [setNewActiveIndexToWindow] устанавливает новый активный индекс кнопки у переданного окна
 *
 * */
const uiWindows = reactive({
  mainWindow: {
    visibility: false,
    activeIndex: 0
  },
  topWindow: {
    visibility: false
  },
  setNewActiveIndexToWindow(window, newIndex) {
    this[window].activeIndex = newIndex
  }
})

/**
 * Массив кнопок сверху
 *
 * @property {string} [name] имя кнопки
 * @property {string} [engName] имя кнопки на английском
 * @property {Component} [component] компонент, который отвечает на кнопку
 *
 * */
const mainButtons = [
  {
    name: 'Рецепты',
    engName: 'recipes',
    component: Recipes,
  },
  {
    name: 'Инвентарь',
    engName: 'inventory',
    component: Inventory,
  },
  {
    name: 'Статус',
    engName: 'status',
    component: Status,
  }
]

/**
 * Получение компонента активной кнопки у окна по переданному массиву кнопок */
const getActiveBtn = (window, buttonsArray) => {
  const activeIndex = uiWindows[window].activeIndex

  return buttonsArray[activeIndex].component
}

/** todo объединить эти методы в один toggleWindow*/
const openWindow = (window) => {
  if (!window.visibility) {
    // console.log('открываем окно')
    toggleVisibility(window)
  }
}
const closeWindow = (window) => {
  if (window.visibility) {
    // console.log('закрываем окно')
    toggleVisibility(window)
  }
}
const toggleVisibility = (window) => {
  window.visibility = !window.visibility
}

const healthPercentage = computed(() => {
  return (definedProps.player.health/definedProps.player.maxHealth) * 100
})
const foodPercentage = computed(() => {
  return (definedProps.player.food/definedProps.player.maxFood) * 100
})
const waterPercentage = computed(() => {
  return (definedProps.player.water/definedProps.player.maxWater) * 100
})
</script>

<template>
  <div class="ui">
    <div class="ui__top main__texture" :class="{'_hidden': !uiWindows.topWindow.visibility}">
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
      <span @click="toggleVisibility(uiWindows.topWindow)" class="main__texture _big">^</span>
    </div>

    <ul class="ui__buttons">
      <li class="main__btn _lil"
          @click="openWindow(uiWindows.mainWindow); uiWindows.setNewActiveIndexToWindow('mainWindow', index)"
          v-for="(button, index) of mainButtons"
          :key="button.engName">{{button.name}}</li>
    </ul>

    <div class="ui__window _main main__texture" :class="{_closed: !uiWindows.mainWindow.visibility}">
      <span class="window__close" @click="closeWindow(uiWindows.mainWindow)">X</span>

      <!--   todo из за проверки v-if и последующего вызова этого метода, то обновление activeIndex
              происходит два раза. Вынести getActiveBtn('mainWindow', mainButtons) в отдельную переменную -->
      <Component :is="getActiveBtn('mainWindow', mainButtons)"
                 v-if="getActiveBtn('mainWindow', mainButtons).__name === 'Inventory'"
                 :player="player"
      />

      <Component :is="getActiveBtn('mainWindow', mainButtons)"
                 v-else-if="getActiveBtn('mainWindow', mainButtons).__name === 'Recipes'"
                 :recipes="recipes" :player="player"
      />

      <Component :is="getActiveBtn('mainWindow', mainButtons)"
                 v-else-if="getActiveBtn('mainWindow', mainButtons).__name === 'Status'"
                 :player="player"
      />
    </div>
  </div>
</template>

<style>
.ui {
  position: fixed;
  inset: 0;
  z-index: 1;
}
.ui__buttons {
  display: flex;
  z-index: 3;
  position: relative;
  gap: 6px;
  justify-content: flex-end;
}
.ui__buttons li {
  cursor: pointer;
  transition-duration: var(--transition);
  transform: translateY(-50%);
}
.ui__buttons li:hover {
  transform: translateY(0);
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
//transform: translateX(-100%);
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