<script setup>
/**
 * Компонент UI */

import {reactive} from "vue";
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
</script>

<template>
  <div class="ui">
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
</style>