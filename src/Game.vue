<script setup>
/**
 * Компонент игры */
import {ref, onMounted} from "vue";
onMounted(() => {
  console.log('Game Component mounted')
})
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
        chance: [99, 100],
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

/**
 * Глобальный массив инвентаря */
const inventory = ref({})

/**
 * Глобальный объект объектов с рецептами, которые будут храниться в верстаке
 *
 * @property {string} [name] Имя предмета на русском
 * @property {string} [engName] Имя предмета на нерусском
 * @property {array} [cost] стоимость предмета в ресурсах
 * @property {string} [description] описание предмета
 * @property {string} [type] тип предмета
 * @property {number} [speed] скорость предмета. Чем быстрее оружие, тем больше раз им можно ударить до конца хода.
 * @property {number} [durability] прочность предмета
 * @property {number} [damage] урон предмета
 * @property {array} [buffs] положительные эффекты расходника
 * @property {array} [negativeEffects] негативные эффекты расходника
 *
 * */
const workbench = ref({
  'wooden-stick': {
    name: 'Деревянная палка',
    engName: 'WoodenStick',
    cost: [
      {engName: 'branch', name: 'Ветка', count: 6},
      {engName: 'grass', name: 'Трава', count: 20}
    ],
    description: `Несколько палок, связанных сорваной впопыхах травой в своего большего собрата. Удовольствие на один
                  раз. Дешевое и бесполезное оружие. Но в умелых руках так же является бесполезным. Скорость
                  использования довольно быстрая, что бы кинуть сразу горсть таких палок в лицо врагу, тем самым
                  разозлив его еще больше.`,
    type: 'weapon',
    speed: 30,
    durability: 4,
    damage: 2,
  },
  'grass-bandage': {
    name: 'Травяные бинты',
    engName: 'GrassBandage',
    cost: [
      {engName: 'grass', name: 'Трава', count: 20},
      {engName: 'commonFlower', name: 'Обычный цветок', count: 3}
    ],
    description: `Трава, связанная травой и украшенная тремя разноцветными цветами. Никакой пропаганды. Лечит так же,
                  как и выглядит. На все пятнадцать процентов. Хороший шанс получить рандомное заражение. Проще будет
                  помочиться на рану.`,
    type: 'consumable',
    buffs: [
      {health: 15, text: 'Восстанавливает 15% здоровья'}
    ],
    negativeEffects: [
      {chance: [50, 100], text: 'Заражение крови', title: 'bloodPoisoning'},
      {chance: [0, 20], text: 'Червяки под кожей', title: 'wormsUnderTheSkin'}
    ]
  }
})

const updateCurrentLocation = (location) => {
  currentLocation.value = location.value
}
const currentLocation = ref(null)

const activeResource = ref(null)
const setActiveResource = (resToActive) => {
  activeResource.value = resToActive
  console.log(resToActive)
  console.log(resources.value)
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
       @updateLocationTab="updateLocationTab"
       @updateCurrentLocation="updateCurrentLocation" />
  <UI :resources
      :activeResource
      :activeLocationTab
      :currentLocation
      :workbench />
</template>

<!--
 Сделал todo убрать выделение текста при двойном клике
 todo сделать рандомное число от 0 до 1000, а то ресурсы слишком быстро добываются, особенно - золотой цветок.
 todo сделать всплывающие окошки по всему вьюпорту. Тип берется рандомные координаты и оттуда уже через fixed лепится
      окошко с подсказками или прочей лабудой.
 todo сделать локал сторедж для ресурсов, хотябы
 todo подумать над концепцией, что перезагрузка страницы будет равна смерти. И чем больше перезагрузок, тем больше
      возможностей открывается.
 todo сделать так, что бы когда переходил по локации, то плашка просто перелетала с место на место -->
