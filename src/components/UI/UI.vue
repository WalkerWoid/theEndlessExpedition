<script setup>
/**
 * Компонент UI. Тут будут находиться все всплывающие окошки и разные уведомления. Дайте мне силы прокидывать все
 * говно мира в этот компонент. */
import {ref} from "vue";

// onMounted(() => {
//   console.log('UI window mounted')
//   console.log(locationButtonsArray)
//   console.log(definedProps.activeLocationTab)
// })
// onUpdated(() => {
//   console.log('UI window updated')
//   console.log('activeLocationTab', definedProps.activeLocationTab)
// })

import ResourcePopup from "@/components/Resources/ResourcePopup.vue";

import UiSubWindow from "@/components/UI/UiMainButtons/UiSubWindow.vue";
import UiUnitButton from "@/components/UI/UiMainButtons/UiUnitButton.vue";
import Workbench from "@/components/UI/UiMainButtons/Workbench.vue";
import Backpack from "@/components/UI/UiMainButtons/Backpack.vue";

import LocationSubWindow from "@/components/UI/UiMainButtons/LocationSubWindow.vue";
import LocationInfo from "@/components/UI/LocationButtons/LocationInfo.vue";
import LocationHunting from "@/components/UI/LocationButtons/LocationHunting.vue";

const definedProps = defineProps(['resources', 'activeResource', 'activeLocationTab'])

const uiTopButtons = [
  {id: 0, btnName: 'Верстак', tabComponent: Workbench},
  {id: 1, btnName: 'Рюкзак', tabComponent: Backpack}
]
const topButtonsComponentsArray = [
    Workbench,
    Backpack
]
const locationButtonsArray = [
    LocationInfo,
    LocationHunting
]
let currentTabId = ref(1)
let uiSubWindowIsVisible = ref(false)
let locationTabIsVisible = ref(false)

const toggleUiUnit = (event) => {
  event.target.classList.toggle('_closed');
}
const toggleUiTab = (index) => {
  currentTabId.value = index
}
</script>

<template>
  <div class="ui__container">
    <div class="ui__buttons">
      <UiUnitButton v-for="(button, index) of uiTopButtons"
                    :button :key="button.btnName"
                    @mouseenter="toggleUiUnit" @mouseleave="toggleUiUnit"
                    @click="toggleUiTab(index); uiSubWindowIsVisible = true" />
    </div>
    <UiSubWindow :currentTab="topButtonsComponentsArray[currentTabId]"
                 @closeSubWindow="uiSubWindowIsVisible = false"
                 :uiSubWindowIsVisible :resources />
    <ResourcePopup :activeResource />
    <LocationSubWindow :currentLocationTab="locationButtonsArray[locationButtonsArray.findIndex(tabBtn => tabBtn.__name === activeLocationTab)]"
                       :locationTabIsVisible
                       @toggleSubWindow="locationTabIsVisible = !locationTabIsVisible"/>
  </div>
</template>

<style>
.ui__container {
  position: fixed;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
}
.ui__buttons {
  display: flex;
  gap: 20px;
}

.subWindow {
  position: fixed;
  transition-duration: .4s;
}
.subWindow__close {
  position: absolute;
  text-transform: uppercase;
  font-size: 36px;
  line-height: 100%;
  top: 0;
  right: 10px;
  display: flex;
  cursor: pointer;
  transition-duration: .4s;
}
.subWindow__wrapper {
  display: flex;
  overflow: auto;
  flex-direction: column;
  height: 100%;
}
</style>