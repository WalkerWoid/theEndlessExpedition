<script setup>
/**
 * Компонент UI, в котором будет находиться весь интерфейс. */

import {onMounted, onUpdated, ref} from "vue";
import ResourcePopup from "@/components/Resources/ResourcePopup.vue";
const definedProps = defineProps([
  'resources',
  'activeResource',
  'currentLocation',
  'locationBtnComponent'
])

import UiUnitButton from "@/components/UI/UiUnitButton.vue";
import SubWindowUiUnit from "@/components/UI/SubWindowUiUnit.vue";
import Backpack from "@/components/UI/Backpack.vue";
import Workbench from "@/components/UI/Workbench.vue";

import LocationInfo from "@/components/UI/LocationButtons/LocationInfo.vue";
import LocationHunting from "@/components/UI/LocationButtons/LocationHunting.vue";

const uiTabs = [
  {id: 0, btnName: 'Верстак', tabComponent: Workbench},
  {id: 1, btnName: 'Рюкзак', tabComponent: Backpack}
] // табы
const tabsComponentsArray = [] // компоненты табов
const locationsTab = {
  LocationInfo,
  LocationHunting
}
let currentTabId = ref();
let currentTab = ref(Backpack)
const subWindow = ref(null)


onMounted(() => {
  tabsInit()
})

/**
 * Метод открытыия\закрытия таба при наведении. */
const toggleUiUnit = (event) => {
  event.target.classList.toggle('_closed');
}

/**
 * Метод инициализации массива с компонентами табов для окна с динамическими компонентами. */
const tabsInit = () => {
  uiTabs.forEach(tab => {
    tabsComponentsArray.push(tab.tabComponent)
  })
  currentTabId.value = 1
}

/**
 * Метод нажания на таб */
const toggleUiTab = (button) => {
  getCurrentTab(button)
  toggleSubWindow()
}

/**
 * Метод получения активного таба. */
const getCurrentTab = (button) => {
  currentTabId.value = button.id
}

/**
 * Метод открытия/закрытия сабокна. */
const toggleSubWindow = (cross = false) => {
  if (subWindow.value.classList.contains('_closed')) {
    subWindow.value.classList.remove('_closed')
  }
  if (cross) {
    subWindow.value.classList.add('_closed')
  }
}

const toggleWindow = (event) => {
  event.target.parentNode.classList.toggle('_closed')
}
</script>


<template>
  <div class="ui__container">
    <div class="ui__buttons">
      <UiUnitButton
          v-for="button of uiTabs"
          :button="button"
          :key="button.btnName"
          @mouseenter="toggleUiUnit"
          @mouseleave="toggleUiUnit"
          @click="toggleUiTab(button)"
      />
    </div>

    <div class="ui__subWindow _closed main__texture" ref="subWindow">
      <span class="close" @click="toggleSubWindow(true)">Х</span>
      <SubWindowUiUnit :currentTab="tabsComponentsArray[currentTabId]" :resources="resources" />
    </div>

    <ResourcePopup :activeResource="activeResource" />

    <div class="location__subWindow main__texture _closed">
      <div class="close" @click="toggleWindow"> > </div>
      <p class="main__text" v-if="!locationsTab[definedProps.locationBtnComponent]">Нажмите кнопку на локации. Например, на значок "i"</p>
      <SubWindowUiUnit :currentTab="locationsTab[locationBtnComponent]"
                       :currentLocation="currentLocation" />
    </div>
  </div>
</template>


<style>
.ui__container {
  position: fixed;
  inset: 0;
  z-index: 0;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  align-self: flex-start;
  height: auto;
}

.ui__buttons {
  display: flex;
  align-self: center;
  gap: 20px;
}

.ui__unit {
  display: flex;
  padding: 10px 30px;
  justify-content: center;
  align-items: center;
  border-radius: 0 0 var(--radius) var(--radius);
  cursor: pointer;
  transition-duration: .4s;
}

.ui__unit._closed {
  transform: translateY(-45px);
}

.main__texture {
  background: url("../../assets/images/textures/UI-unit-texture.png") center no-repeat;
  background-size: cover;
  border: 1px solid rgb(239, 228, 176);
}

.ui__subWindow {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 500px;
  height: 300px;
  transition-duration: .4s;
  border-radius: var(--radius) 0 0 0;
  padding: 36px 15px 15px;
}

.ui__subWindow._closed {
  transform: translateY(100%);
}

.ui__subWindow .close, .location__subWindow .close {
  position: absolute;
  text-transform: uppercase;
  font-size: 36px;
  line-height: 100%;
  top: 0;
  right: 10px;
  display: flex;
  cursor: pointer;
}

.location__subWindow {
  position: fixed;
  bottom: 0;
  left: 0;
  height: auto;
  border-radius: 0 var(--radius) 0 0;
  padding: 10px 60px 10px 30px;
  transition-duration: .4s;
  width: 400px;
  min-height: 50px;
  max-height: 500px;
}
.location__subWindow._closed {
  transform: translateX(-90%);
}
</style>