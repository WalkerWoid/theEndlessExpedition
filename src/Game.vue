<script setup>
/**
 * Компонент игры */
import {ref} from "vue";
// onMounted(() => {
//   console.log('Game Component mounted')
// })
// onUpdated(() => {
//   console.log('Game Component updated')
// })

import Map from "@/components/Map/Map.vue";
import UI from "@/components/UI/UI.vue";

/**
 * Глобальный массив локаций
 * id             - используется в v-for
 * name           - имя на русском
 * engName        - пока не используется
 * linesSrc       - используется в пути картинки ховер-эффекта(такие белые линии)
 * coordinates    - используются в качестве начальной координаты блока локации
 * width          - ширина блока локации
 * height         - высота блока локации
 * resources      - ресурсы, которые можно найти на этой локации
 * */
const locations = ref([
  {
    id: 0,
    name: 'Спасательный челнок',
    engName: 'theRescueShuttle',
    linesSrc: 'theRescueShuttleLines.png',
    coordinates: [4, 48],
    width: 150,
    height: 158,
    resources: {
      branch: {
        name: 'Ветка',
        engName: 'branch',
        chance: [0, 20],
        defaultCount: [3, 6]
      },
      grass: {
        name: 'Трава',
        engName: 'grass',
        chance: [30, 50],
        defaultCount: [10, 22]
      },
      commonFlower: {
        name: 'Обычный цветок',
        engName: 'commonFlower',
        chance: [70,94],
        defaultCount: [2, 3]
      },
      goldenFlower: {
        name: 'Золотой цветок',
        engName: 'goldenFlower',
        chance: [99, 99],
        defaultCount: [1, 1]
      }
    },
    isActual: false,
  },
  {
    id: 1,
    name: 'Лесочек',
    engName: 'testLocation',
    linesSrc: 'theRescueShuttleLines.png',
    coordinates: [200, 248],
    width: 150,
    height: 158,
    resources: {
      branch: {
        name: 'Ветка',
        engName: 'branch',
        chance: [0, 20],
        defaultCount: [3, 6]
      },
      grass: {
        name: 'Хорошая Трава',
        engName: 'grass',
        chance: [30, 50],
        defaultCount: [10, 22]
      },
      commonFlower: {
        name: 'Обычный цветок',
        engName: 'commonFlower',
        chance: [70,94],
        defaultCount: [2, 3]
      },
      goldenFlower: {
        name: 'Золотой цветок',
        engName: 'goldenFlower',
        chance: [95, 100],
        defaultCount: [1, 1]
      }
    },
    isActual: false,
  },
])

/**
 * Глобальный массив ресурсов */
const resources = ref({})

const activeResource = ref(null)
const setActiveResource = (resToActive) => {
  activeResource.value = resToActive
}

const activeLocationTab = ref(null)
const updateLocationTab = (locationTab) => {
  activeLocationTab.value = locationTab
}
</script>
<template>
  <Map :locations="locations"
       :resources="resources"
       @setActiveResource="setActiveResource"
       @updateLocationTab="updateLocationTab" />
  <UI :resources
      :activeResource
      :activeLocationTab />
</template>

<!--
 todo убрать выделение текста при двойном клике
 todo сделать рандомное число от 0 до 1000, а то ресурсы слишком быстро добываются, особенно - золотой цветок.
 todo сделать всплывающие окошки по всему вьюпорту. Тип берется рандомные координаты и оттуда уже через fixed лепится
      окошко с подсказками или прочей лабудой.
 todo сделать локал сторедж для ресурсов, хотябы
 todo подумать над концепцией, что перезагрузка страницы будет равна смерти. И чем больше перезагрузок, тем больше
      возможностей открывается.
 todo сделать так, что бы когда переходил по локации, то плашка просто перелитала с место на место -->
