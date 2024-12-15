<script setup>
/**
 * Главный компонент игры */

// import {ref, reactive, toRaw, computed} from "vue";

import {defineAsyncComponent, ref, reactive, watch, provide, toRaw} from "vue";

const Map = defineAsyncComponent(() => import("@/components/Map/Map.vue"))
const UI = defineAsyncComponent(() => import("@/components/UI/UI.vue"))

/**
 * Класс игрока */
class Player {
  constructor() {
    this.#playerInit()
  }

  /**
   * Инициализация игрока
   *
   * @return {void}
   *
   * */
  // 'Осужденный по законам 19(массовое убийство), 20(массовые пытки), 21(массовое сожжение) и 22(взятие в заложники особо ценных лиц).'
  #playerInit = () => {
    this.name = 'Фираксис Рейнхард'
    this.secondName = 'Охотник'
    this.number = 117
    this.currentLocation = 'landingZone'
    this.status = 'Осужденный по законам 19 - *Данные повреждены*; 20 - *Данные повреждены*; 21 - *Данные повреждены*; 22 - *Данные повреждены*; 698 - Убийство особо ценного объекта, а именно: *Данные повреждены*.'
    this.health = 200
    this.maxHealth = 200
    this.food = 300
    this.maxFood = 300
    this.water = 100
    this.maxWater = 100
    this.inventory = [
      { "name": "Трава", "engName": "grass", "count": 320, "type": "resource" },
      { "name": "Обычный цветок", "engName": "commonFlower", "count": 40, "type": "resource" },
      {
        "name": "Травяная панамка",
        "engName": "herbalPanamaHat",
        "description": "Будет выглядеть модно, если вы полугодовалый ребенок. Можно надеть сразу поверх вашего скафандра на смех всем полугодовалым детям в радиусе этого континента.",
        "count": 2,
        "cost": [
          {
            "name": "Трава",
            "engName": "grass",
            "count": 160,
            "type": "resource"
          }
        ],
        "type": "armor",
        "bodyType": "head",
        "durability": 10,
        "info": [
          {
            "name": "Урон",
            "engName": "damage",
            "value": 0
          },
          {
            "name": "Прочность",
            "engName": "startedDurability",
            "value": 10
          },
          {
            "name": "Скорость",
            "engName": "speed",
            "value": 0
          },
          {
            "name": "Броня",
            "engName": "armor",
            "value": 1
          }
        ],
        "isEquipped": false
      },
      {
        "name": "Травяная панамка",
        "engName": "herbalPanamaHat",
        "description": "Будет выглядеть модно, если вы полугодовалый ребенок. Можно надеть сразу поверх вашего скафандра на смех всем полугодовалым детям в радиусе этого континента.",
        "count": 2,
        "cost": [
          {
            "name": "Трава",
            "engName": "grass",
            "count": 160,
            "type": "resource"
          }
        ],
        "type": "armor",
        "bodyType": "head",
        "durability": 6,
        "info": [
          {
            "name": "Урон",
            "engName": "damage",
            "value": 0
          },
          {
            "name": "Прочность",
            "engName": "startedDurability",
            "value": 10
          },
          {
            "name": "Скорость",
            "engName": "speed",
            "value": 0
          },
          {
            "name": "Броня",
            "engName": "armor",
            "value": 1
          }
        ],
        "isEquipped": false
      },
    ]
    this.body = {
      head: false,
      body: false,
      leftArm: false,
      rightArm: false,
      leftWrist: false,
      rightWrist: false,
      leftLeg: false,
      rightLeg: false,
      weapon: false,
      shield: false
    }
  }



  /**
   * Изменение названия текущей локации
   *
   * @param {string} newLocation - название новой локации
   * @return {void}
   *
   * */
  changeLocation(newLocation) {
    this.currentLocation = newLocation
  }

  /**
   * Получение объекта объекта локации по названию локации
   *
   * @param {string} locationName - название локации
   * @return {Object}
   *
   * */
  getLocation(locationName) {
    return locations.value.find(loc => loc.engName === locationName)
  }



  /**
   * Фарм ресурса при клике
   *
   * @return {void}
   *
   * */
  farmResource() {
    const currentLocationObject = this.getLocation(this.currentLocation)

    /**
     * Проверяет, есть ли ресурсы в определенной локации
     *
     * @return {boolean}
     *
     * */
    const isLocationHasResources = () => {
      return currentLocationObject.resources.length !== 0
    }

    /**
     * Получает массив ресурсов локации
     *
     * @return {array}
     *
     * */
    const getLocationResources = () => {
      return currentLocationObject.resources
    }

    /**
     * Получение определенного объекта ресурса локации по рандомному числу
     *
     * @param {array} locationResources - массив ресурсов локации
     * @param {number} randomValForResource - рандомное число ресурса
     *
     * @return {Object}
     *
     * */
    const getResource = (locationResources, randomValForResource) => {
      return locationResources.find(resource => {
        return resource.chance[0] <= randomValForResource && resource.chance[1] >= randomValForResource
      })
    }

    /**
     * Возвращает готовый ресурс, который будет добавляться в инвентарь
     *
     * @param {Object} resource - сырой объект ресурса
     * @param {number} count - количество ресурса
     *
     * @return {Object}
     *
     * */
    const getCockedResource = (resource, count) => {
      console.log('Сырой ресурс, приходящий в getCockedResource', resource)

      const cockedResource = this.getObjectCopy(resource)
      delete cockedResource.chance
      cockedResource.count = count

      return cockedResource
    }

    if (!isLocationHasResources()) {
      return
    }

    console.clear()
    const locationResources = getLocationResources()
    const randomValForResource = this.getRandomByRange([0, 100])
    const resource = getResource(locationResources, randomValForResource)
    const resourceCount = this.getRandomByRange(resource.count)
    const cockedResource = getCockedResource(resource, resourceCount)
    this.addResource(cockedResource)
    console.log('Инвентарь', this.inventory)

    /*
    console.log('Рандомное число', randomValForResource)
    console.log('Лутаем ресурс', resource)
    console.log('В количестве', resourceCount)
    console.log('Готовый ресурс', cockedResource)
    console.log('Инвентарь', toRaw(this.inventory))
    */
  }

  /**
   * Добавление готового ресурса в инвентарь
   *
   * @param {Object} cockedResource - готовый объект ресурса для добавления в инвертарь
   *
   * @return {void}
   *
   * */
  addResource(cockedResource) {
    if (cockedResource.type === 'resource' || cockedResource.type === 'medical') {
      console.log('Ресурс, приходящий в addResource', this.getInventoryResource(cockedResource))
      if (this.getInventoryResource(cockedResource)){
        console.log('Ресурс есть, добавляем количество')
        this.addSomeResourceCountToInventory(cockedResource)
      } else {
        console.log('Ресурса нет, добавляем полный')
        this.addSomeToInventory(cockedResource)
      }
    }
  }

  /**
   * Уменьшение ресурса
   *
   * @param {Object} resource - ресурс, который надо потратить
   *
   * */
  decreaseResource(resource) {
    this.getInventoryResource(resource).count -= resource.count
    const indexOfResource = this.inventory.indexOf(this.getInventoryResource(resource))

    if (this.getInventoryResource(resource).count <= 0)
      this.deleteFromInventory(indexOfResource)
      // this.inventory.splice(indexOfResource, 1)
  }

  /**
   * Добавление количества ресурса к ресурсу в инвентаре
   *
   * @param {Object} resource - объект готового(cocked) ресурса
   * @return {void}
   *
   * */
  addSomeResourceCountToInventory(resource) {
    this.getInventoryResource(resource).count += Math.floor(resource.count)
  }

  /**
   * Получение ресурса из инвентаря
   *
   * @param {Object} resource - объект готового ресурса для поиска
   * @return {Object|undefined}
   *
   * */
  getInventoryResource(resource) {
    return this.inventory.find(inventoryResource => inventoryResource.engName === resource.engName)
  }

  /**
   * Получение количества определенного ресурса
   *
   * @param {Object} resource - объект ресурса, количество которого нужно узнать ресурс
   * @return {number}
   *
   * */
  getInventoryResourceCount(resource) {
    return this.getInventoryResource(resource) ? this.getInventoryResource(resource).count : 0
  }

  /**
   * Метод проверки хватает ли ресурсов для создания предмета
   *
   * @param {array} recipeCost - массив ресурсов, необходимых для создания
   * @return {boolean}
   *
   * */
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
  }



  /**
   * Добавление предмета в инвентарь
   *
   * @param {Object} item - объект предмета, который будем добавлять
   * @return {void}
   *
   * */
  addItemToInventory(item) {
    /** Принцип работы
     * 1. Если нет предмета по такому имени, дурабилити и экипированности, добавляем чистый предмет в инвентарь
     * 2. Если предмет существует по по такому имени, дурабилити и экипированности, делаем +1 к количеству. */

    const neededItem = this.getInventoryItem(item)
    console.log('Найденный предмет:', neededItem)
    if (neededItem) {
      neededItem.count += 1
    } else {
      this.addSomeToInventory(item)
    }
    console.log('Инвентарь после добавления предмета:', this.inventory)
  }

  /**
   * Поиск предмета в инвентаре
   *
   * @param {Object} item - объект предмета для поиска
   * @return {Object|undefined}
   *
   * */
  getInventoryItem(item) {

    return this.inventory.find(inventoryItem => {
      return inventoryItem.engName === item.engName
          && inventoryItem.isEquipped === item.isEquipped
          && inventoryItem.durability === item.durability
    })
  }

  /**
   * Разобрать предмет
   *
   * @param {Object} item - предмет, который надо разобрать. Должна быть копия предмета без передачи по ссылке.
   *
   * */
  disassembleItem(item) {
    /** Принцип работы
     * 1. Узнаем, является ли предмет целым
     * 2. Узнаем, является ли предмет на половину сломанным. Между половиной и целым
     * 3. Узнаем, является ли предмет почти сломанным. Между 0 и половиной
     * 4. Если предмет один - удаляем его и возвращаем ресурсы, в зависимости от целостности предмета
     * 5. Если предмета больше, чем 1 - вычитаем 1 и возвращаем ресурсы, в зависимости от целостности предмета
     */
    console.clear()
    console.log('Предмет, который будем разбирать', item)
    const itemStartedDurability = this.getItemInfo(item, 'startedDurability')
    const itemCost = this.getObjectCopy(item).cost

    const isItemFull = () => {
      return item.durability === itemStartedDurability
    }
    const isItemSemiDamaged = () => {
      return item.durability >= Math.floor(itemStartedDurability)/2
          && item.durability < itemStartedDurability
    }
    const isItemDamaged = () => {
      return item.durability > 0 && item.durability < Math.floor(itemStartedDurability)/2
    }
    const getBackResources = (cost, price) => {
      cost.forEach(resource => {
        resource.count *= price
        this.addResource(resource)
      })
    }

    if (isItemFull()) {
      console.log('Предмет целый, возвращаем все ресурсы')
      getBackResources(itemCost, 1)
    }
    if (isItemSemiDamaged()) {
      console.log('Предмет на половину сломан, возвращаем 0.5 ресурсов')
      getBackResources(itemCost, 0.5)
    }
    if (isItemDamaged()) {
      console.log('Предмет сломан, возвращаем 0.25 ресурсов')
      getBackResources(itemCost, 0.25)
    }

    this.quantityItemCheck(item)
  }

  /**
   * Надеть предмет
   *
   * @param {Object} item - предмет, который надо будет надеть
   * @return {void}
   *
   * */
  putOnItem(item) {
    /**
     * Принцип работы
     * 1. Если предмета в теле нет, надеваем его. return
     * 2. Если предмет в теле есть и он не такой, какой надеваем, то переодеваем предмет:
     *  * Снимаем предыдущий
     *  * Надеваем новый
     * 3. Если предмет на теле такой же, какой надеваем, то ничего не происходит.
     * */
    console.clear()

    /**
     * Если item такой же, как и надетый на тело предмет */
    if (this.isEquippedItemEqual(item)) {
      console.log('Такой предмет уже надет')
      return
    }

    const bodyType = item.bodyType
    const itemToEquip = this.getObjectCopy(item)
    itemToEquip.count = 1

    /**
     * Если на теле ничего нет. */
    if (!this.body[bodyType]) {
      console.log('Надеваем предмет в', bodyType)
      console.log('Предмет, который будем надевать', itemToEquip)
      console.log('Слот тела пустой, надеваем предмет')

      this.body[bodyType] = itemToEquip
      this.quantityItemCheck(item)
      console.log('Тело после надевания предмета', this.body)
      return
    }
    /**
     * Если предмет уже есть на теле.
     * 1. Снимаем предыдущий.
     * 2. Надеваем новый. */
    if (this.body[bodyType]) {
      console.log('Снимаем предмет на теле', this.body[bodyType])
      console.log('Надеваем', itemToEquip)

      this.takeOffItem(this.body[bodyType])
      this.body[bodyType] = itemToEquip
      this.quantityItemCheck(item)
      console.log('Тело после надевания предмета', this.body)
    }
  }

  /**
   * Снимаем предмет
   *
   * @param {Object} item - объект предмета, который будем снимать
   * @return {void}
   *
   * */
  takeOffItem(item) {
    /**
     * Принцип работы
     * 1. Если предмета на теле нет, ничего не происходит
     * 2. Если предмет такой уже есть, плюсуем единичку
     * 3. Если предмета в инвентаре такого нет, просто добавляем в инвентарь
     *
     * */
    console.clear()
    console.log('Предмет, который будем снимать', item)

    const bodyType = item.bodyType

    if (!this.body[bodyType])
      return

    if (!this.isEquippedItemEqual(item))
      return

    if (this.getInventoryItem(this.body[bodyType])) {
      console.log('Снимаемый предмет есть в инвентаре, прибавляем единичку')
      this.getInventoryItem(this.body[bodyType]).count += 1
      this.clearPartOfBody(bodyType)
      return
    }

    console.log('Такого предмета в инвентаре нет, создаем новый')
    this.addItemToInventory(this.body[bodyType])
    this.clearPartOfBody(bodyType)
  }

  /**
   * Проверяет, экипирован ли такой же предмет или нет на теде
   *
   * @param {Object} itemToEquip - объект предмета, который будем сравнивать с уже экипированным
   * @return {boolean}
   *
   * */
  isEquippedItemEqual(itemToEquip) {
    const itemOnBody = this.body[itemToEquip.bodyType]
    console.log('Предмет на теле', itemOnBody)
    console.log('itemToEquip Сравниваем с', itemOnBody)
    console.log('Равно ли имя', itemToEquip.engName === itemOnBody.engName)
    console.log('Равен ли дурабилити', itemToEquip.durability === itemOnBody.durability)
    console.log('Равен ли isEquipped', itemToEquip.isEquipped === itemOnBody.isEquipped)

    return itemToEquip.engName === itemOnBody.engName &&
        itemToEquip.durability === itemOnBody.durability &&
        itemToEquip.isEquipped === itemOnBody.isEquipped
  }

  /**
   * Получение строчки информации предмета
   *
   * @param {Object} item - предмет, информацию которого надо получить
   * @param {string} infoType - тип информации
   *
   * @return {Object|undefined}
   * */
  getItemInfo(item, infoType) {
    return item.info && item.info.find(info => info.engName === infoType).value
  }

  /**
   * Проверка количества предмета после уменьшения количества
   *
   * @param {Object} item - предмет, количество которого будем проверять
   * @return {void}
   *
   * */
  quantityItemCheck(item) {
    const indexOfItem = this.inventory.indexOf(item)

    if (item.count > 1)
      item.count -= 1
    else
      this.deleteFromInventory(indexOfItem)
  }

  /**
   * Чистим часть тела от шмоток
   *
   * @param {string} bodyType - название части тела
   * @return {void}
   *
   * */
  clearPartOfBody(bodyType) {
    this.body[bodyType] = false
  }



  /**
   * @param {Object} something - объект предмета или ресурса(чего-угодно), который надо будет добавить в инвентарь
   *
   * @return {void}
   *
   * */
  addSomeToInventory(something) {
    this.inventory.push(something)
  }

  /**
   * Получение рандомного числа на основе переданного диапазона
   *
   * @param {number[]} range - диапазон
   * @return {number}
   *
   * */
  getRandomByRange(range) {
    const [min, max] = range
    return Math.round(Math.random() * (max - min) + min);
  }

  /**
   * Получение реактивного клона объекта
   *
   * @param {Object} object - объект, копию которого надо получить
   *
   * @return {Object}
   * */
  getObjectCopy(object) {
    return structuredClone(toRaw(object))
  }

  /**
   * Удаление чего-либо из инвентаря по индексу
   *
   * @param {number} indexOfItem - индекс предмета на удаление
   * @return {void}
   *
   * */
  deleteFromInventory(indexOfItem) {
    this.inventory.splice(indexOfItem, 1)
  }

  /**
   * @param {Object} resource - объект ресурса или предмета, который надо будет показать в уведомлениях
   * @param {String} action - строковый тип действия
   *
   * @return {void}
   *
   * */
  // showResourceBubble(resource, action) {
  //   const cockedResource = this.getObjectCopy(resource)
  //   cockedResource.action = action
  //   resourcesBubbles.value.unshift(cockedResource)
  //   console.log('бабл ресурсов:', resourcesBubbles.value)
  //
  //   const timeOut = setTimeout(() => {
  //     resourcesBubbles.value.pop()
  //   }, 2400)
  // }
}

const player = reactive(new Player())

/**
 * Вотчер наблюдения за названием текущей локации */
watch(() => player.currentLocation, (newLocationName, oldLocationName) => {
  player.getLocation(oldLocationName).isCurrent = false
  player.getLocation(newLocationName).isCurrent = true
})

/**
 * Массив объектов локаций.
 *
 * @type {Location[]}
 *
 * @typedef {Object} Location
 * @property {number} id - Уникальный идентефикатор локации.
 * @property {string} name - Название локации на русском.
 * @property {string} engName - Название локации на английском.
 * @property {number[]} coords - Координаты локации.
 * @property {number} width - Ширина локации.
 * @property {number} height - Высота локации.
 * @property {Resource[]} resources - Список ресурсов, доступных в локации.
 * @property {string[]} submenu - Список доступных подменю в меню локации:
 *                                  i - info,
 *                                  ресурсы - фармежка ресурсов,
 *                                  задания - задания,
 *                                  охота - возможность охоты на локации,
 *                                  ритуалы - ритуалы локации,
 *                                  карта - карта локации,
 *                                  контракты - контракты охоты за головами.
 * @property {boolean} isCurrent - Указывает, является ли локация текущей.
 *
 * @typedef {Object} Resource
 * @property {number[]} chance - Диапазон вероятностей выпадения ресурса.
 * @property {string} name - Название ресурса на русском.
 * @property {string} engName - Название ресурса на английском.
 * @property {number[]} count - Диапазон количества выпадающего ресурса.
 * @property {string} type - Тип ресурса: resource
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
      {chance: [0, 60], name: 'Трава', engName: 'grass', count: [10, 20], type: 'resource'},
      {chance: [61, 80], name: 'Ветка', engName: 'stick', count: [6, 10], type: 'resource'},
      {chance: [81, 98], name: 'Обычный цветок', engName: 'commonFlower', count: [3, 7], type: 'resource'},
      {chance: [99, 100], name: 'Златограйник', engName: 'goldenFlower', count: [1, 1], type: 'resource'}
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
      {chance: [99, 100], name: 'Златограйник', engName: 'goldenFlower', count: [1, 1], type: 'resource'}
    ],
    submenu: ['i', 'ресурсы'],
    isCurrent: false
  }
])

/**
 * @type {Recipe[]}
 *
 * @typedef {Object} Recipe
 * @property {string} name - название рецепта
 * @property {string} engName - название рецепта на английском
 * @property {string} description - описание рецепта
 * @property {number} count - количество предмета, получаемое при крафте
 * @property {Cost[]} cost - массив ресурсов, нужных для создания
 * @property {string} type - тип рецепта
 * @property {string} bodyType - тип тела, на которое будет надеваться предмет
 * @property {number} durability - прочность предмета
 * @property {Info[]} info - массив описаний предмета
 * @property {boolean} isEquipped - экипирован ли предмет
 *
 * @typedef {Object} Cost
 * @property {string} name - название необходимого ресурса для создания предмета
 * @property {string} engName - название на английском
 * @property {number} count - количество ресурса
 * @property {string} type - тип ресурса
 *
 * @typedef {Object} Info
 * @property {string} name - заголовок информации предмета
 * @property {string} engName - заголовок информации на английском
 * @property {number} value - количество, которое дает тот или иной аспект предмета
 *
 * */
const recipes = reactive({
  recipes: [
    {
      name: 'Кривая палка',
      engName: 'crookedStick',
      description: 'Ветки, наспех связанные сорванной в попыхах травой в своего большого собрата. Выглядит кривой, как культя дряхлой старухи. Бьет так же - небольно и сразу ломается. Удовольствие на один раз. Не подходит в качестве чесалки для спины, но подходит для того, что бы выколоть кому-нибудь глаз... или даже два. Дешевое и бесполезное оружие. Но в умелых руках так же является бесполезным.',
      count: 1,
      cost: [
        {name: 'Трава', engName: 'grass', count: 20, type: 'resource'},
        {name: 'Ветка', engName: 'stick', count: 12, type: 'resource'}
      ],
      type: 'weapon',
      bodyType: 'weapon',
      durability: 1,
      info: [
        {name: 'Урон', engName: 'damage', value: 3},
        {name: 'Прочность', engName: 'startedDurability', value: 1},
        {name: 'Скорость', engName: 'speed', value: 30},
        {name: 'Броня', engName: 'armor', value: -6},
      ],
      isEquipped: false
    },
    {
      name: 'Травяная панамка',
      engName: 'herbalPanamaHat',
      description: 'Будет выглядеть модно, если вы полугодовалый ребенок. Можно надеть сразу поверх вашего скафандра на смех всем полугодовалым детям в радиусе этого континента.',
      count: 1,
      cost: [
        {name: 'Трава', engName: 'grass', count: 160, type: 'resource'},
      ],
      type: 'armor',
      bodyType: 'head',
      durability: 10,
      info: [
        {name: 'Урон', engName: 'damage', value: 0},
        {name: 'Прочность', engName: 'startedDurability', value: 10},
        {name: 'Скорость', engName: 'speed', value: 0},
        {name: 'Броня', engName: 'armor', value: 1},
      ],
      isEquipped: false
    },
    {
      name: 'Простой травяной бинт',
      engName: 'simpleHerbalBandage',
      description: 'Трава, связанная травой и украшенная тремя разноцветными цветами. Никакой пропаганды. Лечит так же, как и выглядит - на все 5 процентов. Хороший шанс получить какое-нибудь заражение. Проще будет помочиться на рану.',
      count: 1,
      cost: [
        {name: 'Трава', engName: 'grass', count: 40, type: 'resource'},
        {name: 'Обычный цветок', engName: 'commonFlower', count: 3, type: 'resource'},
      ],
      type: 'medical',
      info: [
        {name: 'Количество использований', engName: 'numberUses', value: 1},
        {name: 'Полезные свойства', engName: 'positiveEffects', value: []},
        {name: 'Неполезные свойства', engName: 'negativeEffects', value: []},
      ],
    },
  ],
  create(recipe) {
    console.clear()
    console.log('Создаем предмет', recipe)
    const recipeToCreate = player.getObjectCopy(recipe)
    console.log('Рецепт на создание(копия)', recipeToCreate)

    if (!player.isResourcesToCreateEnough(recipeToCreate.cost)) {
      console.log('Недостаточно ресурсов для создания')
      return
    }

    console.log('Достаточно ресурсов для создания')
    recipeToCreate.cost.forEach(resource => {
      console.log('ресурс из рецепта, который надо потратить', resource)
      player.decreaseResource(resource)
    //     player.showResourceBubble(resource, 'resourceDecrease')
    })

      player.addItemToInventory(recipeToCreate)
    //   player.showResourceBubble(recipeToCreate, 'itemCreated')
  },
})


// // теория
// import Test from "@/components/Test.vue";

provide('locations', locations.value)
provide('player', player)
provide('recipes', recipes)
</script>

<template>
  <Map />
  <UI />
</template>

<style>

</style>
