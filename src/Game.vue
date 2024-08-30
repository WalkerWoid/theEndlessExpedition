<script setup>
/* todo можно обернуть объекты в shallowRef и на верхнем уровне оставить только свойства, которые будут изменяться. Что
      то типа такого:
        const receps = shallowReactive({
          branch: shallowReactive({
            damage: 0,
            info: {
              dur: 20
            }
          })
        })
*/
/**
 * Компонент игры */
import {ref, onMounted, onUpdated, shallowRef, reactive, shallowReactive} from "vue";

onMounted(() => {
  console.log('Game Component mounted')
})
onUpdated(() => {
  // console.log('Game Component updated')
})

import Map from "@/components/Map/Map.vue";
import UI from "@/components/UI/UI.vue";

/**
 * Глобальный массив локаций
 *
 * id             - используется в v-for
 * name           - имя на русском
 * engName        - пока не используется
 * linesSrc       - используется в пути картинки ховер-эффекта(такие белые линии)
 * coordinates    - используются в качестве начальной координаты блока локации
 * width          - ширина блока локации
 * height         - высота блока локации
 * resources      - ресурсы, которые можно найти на этой локации
 *
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
 * Глобальный массив ресурсов
 *
 * Ресурс приходит в виде grass: {name: 'Трава', count: 2, engName: 'grass'}
 * Армор в таком виде:
 *    testSpaceChest: {
 *      armor: 6,
 *      description: "Тестовый космический нагрудник",
 *      durability: 100,
 *      engName: "testSpaceChest",
 *      name: "Тестовый космический жилет",
 *      speed: 10,
 *      type: "armor",
 *      bodyType: "head",
 *      count: 1
 *    }
 *
 * */
const resources = ref({
  grass: {name: 'Трава', count: 22, engName: 'grass'},
  testSpaceChest: {
    armor: 6,
    description: "Тестовый космический нагрудник",
    durability: 100,
    engName: "testSpaceChest",
    name: "Тестовый космический жилет",
    speed: 10,
    type: "armor",
    bodyType: "body",
    count: 2
  },
  testSpaceChest2: {
    armor: 6,
    description: "Тестовый космический нагрудник2",
    durability: 100,
    engName: "testSpaceChest2",
    name: "Тестовый космический жилет2",
    speed: 10,
    type: "armor",
    bodyType: "body",
    count: 1
  }
})

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
 * @property {string} [bodyType] для какой части тела предмет
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
    description: `Несколько палок, связанных сорваной впопыхах травой в своего большего собрата. Удовольствие на один раз. Дешевое и бесполезное оружие. Но в умелых руках так же является бесполезным. Скорость использования довольно быстрая, что бы кинуть сразу горсть таких палок в лицо врагу, тем самым разозлив его еще больше.`,
    type: 'weapon',
    speed: 30,
    durability: 4,
    damage: 2,
    bodyType: 'rightHand'
  },
  'grass-bandage': {
    name: 'Травяные бинты',
    engName: 'GrassBandage',
    cost: [
      {engName: 'grass', name: 'Трава', count: 20},
      {engName: 'commonFlower', name: 'Обычный цветок', count: 3}
    ],
    description: `Трава, связанная травой и украшенная тремя разноцветными цветами. Никакой пропаганды. Лечит так же, как и выглядит. На все пятнадцать процентов. Хороший шанс получить рандомное заражение. Проще будет помочиться на рану.`,
    type: 'consumable',
    buffs: [
      {health: 15, text: 'Восстанавливает 15% здоровья'}
    ],
    negativeEffects: [
      {chance: [50, 100], text: 'Заражение крови', title: 'bloodPoisoning'},
      {chance: [0, 20], text: 'Червяки под кожей', title: 'wormsUnderTheSkin'}
    ]
  },
  'spaceChest': {
    name: 'Тестовый космический жилет',
    engName: 'testSpaceChest',
    cost: [
      {engName: 'grass', name: 'Трава', count: 10},
    ],
    description: 'Тестовый космический нагрудник',
    type: 'armor',
    bodyType: 'body',
    durability: 100,
    armor: 6,
    speed: 10
  },
  'fullMetalSword': {
    name: 'Цельнометаллический меч',
    engName: 'fullMetalSword',
    cost: [
      {engName: 'grass', name: 'Трава', count: 10},
    ],
    description: 'Цельнометаллический меч',
    type: 'weapon',
    bodyType: 'rightHandLil',
    durability: 100,
    armor: -10,
    speed: 20,
    damage: 666
  }
})

/**
 * Объект персонажа
 *
 * @property {string} [name] имя игрока
 * @property {string} [engName] имя игрока на английском
 * @property {number} [fullArmor] общая броня
 * @property {number} [fullDamage] общий урон
 * @property {number} [fullSpeed] общая скорость
 * @property {array} [positiveEffects] положительные эффекты
 * @property {array} [negativeEffects] негативные эффекты, дебаффы, дотки
 * @property {array} [body] части тел
 * @property {object || boolean} [equipped] экипированный предмет
 * @property {array} [wounds] раны или травмы
 * @property {array} [negativeEffects] негативные эффекты, дебаффы, дотки у части тела
 * @property {array} [positiveEffects] положительные эффекты на части тела предмета
 * @property {string} [armor] защита экипированного предмета
 * @property {string} [damage] урон экипированного предмета
 * @property {string} [speed] скорость экипированного предмета
 *
 * */
const player = reactive({
  name: 'Роуг Уолкер',
  engName: 'Rogue Walker',
  fullArmor: 0,
  fullDamage: 0,
  fullSpeed: 0,
  positiveEffects: [],
  negativeEffects: [],
  body: [
    {
      name: 'Голова',
      engName: 'head',
      equipped: false,
      wounds: false,
      negativeEffects: false,
      positiveEffects: false,
      armor: 0,
      damage: 0,
      speed: 0
    },
    {
      name: 'Тело',
      engName: 'body',
      equipped: false,
      wounds: false,
      negativeEffects: false,
      positiveEffects: false,
      armor: 0,
      damage: 0,
      speed: 0
    },
    {
      name: 'Правая рука',
      engName: 'rightHand',
      equipped: false,
      wounds: false,
      negativeEffects: false,
      positiveEffects: false,
      armor: 0,
      damage: 0,
      speed: 0
    },
    {
      name: 'Кисть правой руки',
      engName: 'rightHandLil',
      equipped: false,
      wounds: false,
      negativeEffects: false,
      positiveEffects: false,
      armor: 0,
      damage: 0,
      speed: 0
    },
    {
      name: 'Левая рука',
      engName: 'leftHand',
      equipped: false,
      wounds: false,
      negativeEffects: false,
      positiveEffects: false,
      armor: 0,
      damage: 0,
      speed: 0
    },
    {
      name: 'Кисть левой руки',
      engName: 'leftHandLil',
      equipped: false,
      wounds: false,
      negativeEffects: false,
      positiveEffects: false,
      armor: 0,
      damage: 0,
      speed: 0
    },
    {
      name: 'Правая нога',
      engName: 'rightLeg',
      equipped: false,
      wounds: false,
      negativeEffects: false,
      positiveEffects: false,
      armor: 0,
      damage: 0,
      speed: 0
    },
    {
      name: 'Левая нога',
      engName: 'leftLeg',
      equipped: false,
      wounds: false,
      negativeEffects: false,
      positiveEffects: false,
      armor: 0,
      damage: 0,
      speed: 0
    },
  ],
  resetPartOfBody(partOfBody) {
    console.log('Сбрасываем скорость, урон и броню части тела в 0')
    partOfBody.damage = 0
    partOfBody.speed = 0
    partOfBody.armor = 0
    partOfBody.equipped = false
  },
  equipItem(item) {
    console.clear()
    console.log('Экипируем предмет:', item)
    /**
      - устанавливаем предмета в объект equipped
      - устанавливаем preEquipped(что бы появилась кнопка "снять"), armor, durabilityLeft = durability, damage и speed.
     */

    const partOfBody = this.getPartOfBody(item)
    item.preEquipped = true
    if (!item.durabilityLeft) item.durabilityLeft = item.durability
    partOfBody.equipped = item
    partOfBody.armor = this.setValue(item, 'armor')
    partOfBody.damage = this.setValue(item, 'damage')
    partOfBody.speed = this.setValue(item, 'speed')
  },
  unEquipItem(item) {
    console.clear()
    console.log('Снимаемый предмет:', item)
    const partOfBody = this.getPartOfBody(item)
    this.resetPartOfBody(partOfBody)
    item.preEquipped = false
    if (item.durability === item.durabilityLeft) delete item.durabilityLeft
  },
  getPartOfBody(item) {
      return this.body.find(partOFBody => partOFBody.engName === item.bodyType)
  },
  setValue(item, valueString) {
    return item[valueString] ? item[valueString] : 0
  },
})

const updateCurrentLocation = (location) => {
  currentLocation.value = location.value
}
const currentLocation = ref(null)

const activeResource = ref(null)
const setActiveResource = (resToActive) => {
  activeResource.value = resToActive
  console.log('Зафармленный ресурс', resToActive)
  console.log('Все ресурсы', resources)
}

const activeLocationTab = ref(null)
const updateLocationTab = (locationTab) => {
  activeLocationTab.value = locationTab
}

</script>
<template>
<!--  <button @click="receps.test.value+=1">button</button>-->
<!--  <p>{{receps.test.value}}</p>-->

  <Map :locations="locations"
       :resources="resources"
       @setActiveResource="setActiveResource"
       @updateLocationTab="updateLocationTab"
       @updateCurrentLocation="updateCurrentLocation" />
  <UI :resources
      :activeResource
      :activeLocationTab
      :currentLocation
      :workbench
      :player />
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
