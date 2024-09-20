<script setup>
/**
 * Главный компонент игры */

import {ref, reactive} from "vue";
import Map from "@/components/Map/Map.vue";
import UI from "@/components/UI/UI.vue";

/**
 * Объект игрока.
 *
 * @property {string} [name] - имя игрока на русском
 * @property {string} [engName] - имя игрока на английском
 * @property {string} [currentLocation] - engName локации, на которой находится игрок
 * @property {array} [inventory] - инвентарь со всеми ресурсами, предметами и так далее
 *           Ресурс будет вот в таком виде: {
 *             name: 'Трава',
 *             engName: 'grass',
 *             count: 20,
 *             type: 'resource'
 *           }
 *
 * @method [moveLocation] - переход в другую локацию
 * @method [getLocation] - получение локации из массива locations по имени
 * @method [toggleCurrentLocation] - смена локации
 * @method [addResource] - получение ресурса
 * @method [getInventoryResource] - получение ресурса, который находится в инвентаре
 * @method [decreaseResource] - трата определенного ресурса
 *
 * */
const player = reactive({
  name: 'Роуг Уолкер',
  engName: 'Rouge Walker',
  currentLocation: 'landingZone',
  inventory: [
    {
      name: 'Трава',
      engName: 'grass',
      count: 200,
      type: 'resource'
    }
  ],
  moveLocation(locationName) {
    if (locationName === this.currentLocation) {
      // console.log('Мы уже в этой локации')
      return
    }

    // console.log('Идем в локацию')

    const oldLocation = this.getLocation(this.currentLocation)
    const newLocation = this.getLocation(locationName)

    this.toggleCurrentLocation(oldLocation, newLocation)
  },
  getLocation(locationName) {
    return locations.value.find(loc => loc.engName === locationName)
  },
  toggleCurrentLocation(oldLocation, newLocation) {
    oldLocation.isCurrent = false
    newLocation.isCurrent = true
    this.currentLocation = newLocation.engName
  },
  addResource(resource) {
    // console.clear()

    if (this.getInventoryResource(resource)) {
      this.getInventoryResource(resource).count += resource.count
    } else {
      this.inventory.push(resource)
    }

    // console.log('Полученный ресурс', resource)
    // console.log('Инвентарь', this.inventory)
  },
  getInventoryResource(resource) {
    return this.inventory.find(inventoryResource => inventoryResource.engName === resource.engName)
  },
  isResourcesToCreateEnough(recipeCost) {
    const resourceConditions = []

    recipeCost.forEach(resource => {
      if (!this.getInventoryResource(resource)) {
        resourceConditions.push(false)

        return
      }

      if (resource.count <= this.getInventoryResource(resource).count) {
        resourceConditions.push(true)
      } else {
        resourceConditions.push(false)
      }
    })

    return resourceConditions.filter(condition => condition === false).length === 0
  },
  decreaseResource(resource) {
    this.getInventoryResource(resource).count -= resource.count
  }
})

/**
 * Массив объектов локаций.
 *
 * Объект локации:
 * @property {number} [id] id локации
 * @property {string} [name] имя локации на русском
 * @property {string} [engName] имя локации на английском
 * @property {array} [coords] начальные координаты по X и Y
 * @property {number} [width] ширина локации
 * @property {number} [height] высота локации
 * @property {array} [resources] массив объектов ресурсов, которые можно получить на локации
 *            chance - массив. 0 - минимальный шанс, 1 - максимальный шанс. Шансы включительно
 *           engName - название ресурса на английском
 *              name - название ресурса на русском
 *             count - массив. 0 - минимальное количество, 1 - максимальное количество
 *
 *           Пример: {
 *             chance: [0, 10],
 *             name: 'трава',
 *             engName: 'grass',
 *             count: [10, 20]
 *           }
 * @property {array} [submenu] массив кнопок подменю локации, которые могут быть у локации
 *           Значения:       i - info
 *                     ресурсы - фармежка ресурсов
 *                     задания - задания
 *                       охота - возможность охоты на локации
 *                     ритуалы - ритуалы локации
 *                       карта - карта локации
 *                   контракты - контракты охоты за головами
 * @property {boolean} [isCurrent] - является ли локация текущей(на которой находится игрок) или нет
 *
 * */
const locations = ref([
  {
    id: 0,
    name: 'Зона посадки',
    engName: 'landingZone',
    coords: [15, 55],
    width: 135,
    height: 140,
    resources: [
      {
        chance: [0, 60],
        name: 'Трава',
        engName: 'grass',
        count: [10, 20]
      },
      {
        chance: [61, 80],
        name: 'Ветка',
        engName: 'stick',
        count: [6, 10]
      },
      {
        chance: [81, 98],
        name: 'Обычный цветок',
        engName: 'commonFlower',
        count: [3, 7]
      },
      {
        chance: [99, 100],
        name: 'Золотой цветок',
        engName: 'goldenFlower',
        count: [1, 1]
      }
    ],
    submenu: ['i', 'ресурсы', 'охота', 'задания', 'контракты', 'карта', 'ритуалы'],
    isCurrent: true
  },
  {
    id: 1,
    name: 'Тестовая зона1',
    engName: 'landingZone2',
    coords: [200, 200],
    width: 135,
    height: 140,
    resources: [
      {
        chance: [0, 100],
        name: 'Камушек',
        engName: 'littleStone',
        count: [30, 60]
      },
    ],
    submenu: ['i', 'ресурсы'],
    isCurrent: false
  }
])

/**
 * Объект рецептов.
 *
 * @property {string} [name] - имя на русском
 * @property {string} [engName] - имя на английском
 * @property {string} [description] - описание
 * @property {number} [count] - сколько предметов за раз будет создано
 * @property {array} [cost] - стоимость
 * @property {string} [type] - тип
 *           Виды: weapon - оружие
 *                 armor - броня
 *                 medical - медицина
 *
 * Пример объекта оружия:
 * {
 *  name: 'Кривая палка',
 *  engName: 'crookedStick',
 *  description: 'Ветки, наспех связанные сорванной в попыхах травой в своего большого собрата. Выглядит кривой, как культя дряхлой старухи. Бьет так же - небольно и сразу ломается. Не подходит в качестве чесалки для спины, но подходит для того, что бы выколоть кому-нибудь глаз... или даже два. Дешевое и бесполезное оружие. Но в умелых руках так же является бесполезным.',
 *  count: 1,
 *  cost: [
 *    {name: 'Трава', engName: 'grass', count: 20},
 *    {name: 'Ветка', engName: 'stick', count: 12}
 *  ],
 *  type: 'weapon',
 *  damage: 3,
 *  durability: 1,
 *  speed: 30,
 *  armor: -6
 * }
 *
 * @property {number} [damage] - урон
 * @property {number} [durability] - прочность
 * @property {number} [speed] - скорость
 * @property {number} [armor] - броня
 *
 * Пример объекта брони:
 * {
 *  name: 'Травяная панамка',
 *  engName: 'herbalPanamaHat',
 *  description: 'Будет выглядеть модно, если вы полугодовалый ребенок. Можно надеть сразу поверх вашего скафандра на смех всем полугодовалым детям в радиусе этого континента.',
 *  count: 1,
 *  cost: [
 *    {name: 'Трава', engName: 'grass', count: 160},
 *  ],
 *  type: 'armor',
 *  damage: 0,
 *  durability: 10,
 *  speed: 0,
 *  armor: 0
 * }
 *
 * Пример объекта предмета, восстанавливающего здоровье или влияющее на здоровье:
 * {
 *  name: 'Простой травяной бинт',
 *  engName: 'simpleHerbalBandage',
 *  description: 'Трава, связанная травой и украшенная тремя разноцветными цветами. Никакой пропаганды. Лечит так же, как и выглядит - на все 5 процентов. Хороший шанс получить какое-нибудь заражение. Проще будет помочиться на рану.',
 *  count: 1,
 *  cost: [
 *    {name: 'Трава', engName: 'grass', count: 40},
 *    {name: 'Обычный цветок', engName: 'commonFlower', count: 40},
 *  ],
 *  type: 'medical',
 *  numberUses: 1,
 *  positiveEffects: [],
 *  negativeEffects: []
 * }
 *
 * @property {number} [numberUses] - количество использований
 * @property {array} [positiveEffects] - баффы
 * @property {array} [negativeEffects] - дебаффы
 *
 * @method [create] - создание предмета
 * @method [addRecipe] - add recipe to recipes array - not implemented
 *
 *
 * */
const recipes = reactive({
  recipes: [
    {
      name: 'Кривая палка',
      engName: 'crookedStick',
      description: 'Ветки, наспех связанные сорванной в попыхах травой в своего большого собрата. Выглядит кривой, как культя дряхлой старухи. Бьет так же - небольно и сразу ломается. Не подходит в качестве чесалки для спины, но подходит для того, что бы выколоть кому-нибудь глаз... или даже два. Дешевое и бесполезное оружие. Но в умелых руках так же является бесполезным.',
      count: 1,
      cost: [
        {name: 'Трава', engName: 'grass', count: 20},
        {name: 'Ветка', engName: 'stick', count: 12}
      ],
      type: 'weapon',
      damage: 3,
      durability: 1,
      speed: 30,
      armor: -6
    },
    {
    name: 'Травяная панамка',
    engName: 'herbalPanamaHat',
    description: 'Будет выглядеть модно, если вы полугодовалый ребенок. Можно надеть сразу поверх вашего скафандра на смех всем полугодовалым детям в радиусе этого континента.',
    count: 1,
    cost: [
      {name: 'Трава', engName: 'grass', count: 160},
    ],
      type: 'armor',
      damage: 0,
      durability: 10,
      speed: 0,
      armor: 0
    },
    {
      name: 'Простой травяной бинт',
      engName: 'simpleHerbalBandage',
      description: 'Трава, связанная травой и украшенная тремя разноцветными цветами. Никакой пропаганды. Лечит так же, как и выглядит - на все 5 процентов. Хороший шанс получить какое-нибудь заражение. Проще будет помочиться на рану.',
      count: 1,
      cost: [
        {name: 'Трава', engName: 'grass', count: 40},
        {name: 'Обычный цветок', engName: 'commonFlower', count: 3},
      ],
      type: 'medical',
      numberUses: 1,
      positiveEffects: [],
      negativeEffects: []
    },
  ],
  create(recipe) {
    if (player.isResourcesToCreateEnough(recipe.cost)) {
      recipe.cost.forEach(resource => {
        player.decreaseResource(resource)
      })

      player.addResource(Object.assign({}, recipe))
    }
  },
  addRecipe() {

  }
})
</script>

<template>
  <Map :player="player" :locations="locations" />
  <UI :inventory="player.inventory" :recipes="recipes" :player="player" />
</template>

<style>

</style>