<script setup>
/**
 * Главный компонент игры */

import {ref, reactive, toRaw} from "vue";
import Map from "@/components/Map/Map.vue";
import UI from "@/components/UI/UI.vue";

const resourcesBubbles = ref([])

/** todo по нормальному переписать доку */
/**
 * Объект игрока.
 *
 * @typedef {Object} Player
 *
 * @property {string} [name] - Имя игрока на русском
 * @property {number} [health] - Здоровье
 * @property {number} [food] - Еда
 * @property {number} [water] - Вода
 * @property {string} [engName] - Имя игрока на английском
 * @property {string} [currentLocation] - engName локации, на которой находится игрок
 * @property {array} inventory - Инвентарь со всеми ресурсами, предметами и так далее
 *           Ресурс должен быть вот в таком виде: {
 *             name: 'Трава',
 *             engName: 'grass',
 *             count: 20,
 *             type: 'resource',
 *           }
 *           Если это объект оружия или брони, то приходит такой же объект
 * @property {object} [body] Объект тела со всеми надетыми предметами на персонажа
 *
 * Методы смены локаций:
 * @property [function():void] moveLocation - Переход в другую локацию
 * @method [getLocation] - Получение локации из массива locations по имени
 * @method [toggleCurrentLocation] - Смена isCurrent значений локаций и currentLocation игрока
 *
 * Методы работы с ресурсами:
 * @method [addResource] - Добавление ресурса в инвентарь
 * @method [decreaseResource] - трата определенного ресурса.
 * @method [addSomeCountToInventory] - Добавление количества к чему-либо в инвентаре
 * @method [addSomeToInventory] - Добавление чего-либо нового в инвентарь. Через push
 * @method [getInventoryResource] - Получение ресурса, который находится в инвентаре
 * @method [showResourceBubble] - Добавление уведомления о ресурсе или предмете в бабл ресурсов
 * @method [isResourcesToCreateEnough] - достаточно ли ресурса на создание предмета
 *
 * Методы работы с предметами
 * @method [addItem] - Добавление предмета в инвентарь
 * @method [getInventoryItem] - Поиск опребеделеного предмета типа оружия или брони по имени и прочности.
 * @method [isAnyItemEquipped] - экипирован ли какой-либо предмет
 * @method [isEqualItemEquipped] - надет ли этот же предмет
 * @method [getPartOfBody] - получение предмета, который сейчас находится на определенной части персонажа.
 * @method [putOnItemHandler] - метод надевания предмета со всеми проверками
 * @method [putOnItem] - метод надевания предмета в слот тела
 * @method [takeOffItem] - снять предмет
 * @method [getItemInfo] - получение какой либо информации из массива info предмета
 * @method [addBrokenItem] - добавление сломанного предмета в инвентарь
 * @method [destroyItemHandler] - метод разбора предмета со всеми проверками
 * @method [destroyItem] - разобрать именно предмет
 * @method [removeItem] - удаляет предмет из инвентаря
 *
 * @method [clearPartOfBody] - установка определенной части тела в false(ничего не надето)
 * @method [getObjectCopy] - Возвращает копию объекта
 * */
const player = reactive({
  name: 'Роуг Уолкер',
  health: 200,
  food: 300,
  water: 100,
  engName: 'Rouge Walker',
  currentLocation: 'landingZone',
  inventory: [
    {name: 'Трава', engName: 'grass',count: 320, type: 'resource'},
    // {name: 'Златограйник', engName: 'goldenFlower', count: 1000, type: 'resource'},
    // {name: 'Обычный цветок', engName: 'commonFlower', count: 1000, type: 'resource'},
    // {name: 'Ветка', engName: 'stick', count: 1000, type: 'resource'},
    {
      name: 'Травяная панамка',
      engName: 'herbalPanamaHat',
      description: 'Будет выглядеть модно, если вы полугодовалый ребенок. Можно надеть сразу поверх вашего скафандра на смех всем полугодовалым детям в радиусе этого континента.',
      count: 10,
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
      name: 'Травяная панамка',
      engName: 'herbalPanamaHat',
      description: 'Будет выглядеть модно, если вы полугодовалый ребенок. Можно надеть сразу поверх вашего скафандра на смех всем полугодовалым детям в радиусе этого континента.',
      count: 1,
      cost: [
        {name: 'Трава', engName: 'grass', count: 160, type: 'resource'},
      ],
      type: 'armor',
      bodyType: 'head',
      durability: 5,
      info: [
        {name: 'Урон', engName: 'damage', value: 0},
        {name: 'Прочность', engName: 'startedDurability', value: 10},
        {name: 'Скорость', engName: 'speed', value: 0},
        {name: 'Броня', engName: 'armor', value: 1},
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
      durability: 3,
      info: [
        {name: 'Урон', engName: 'damage', value: 0},
        {name: 'Прочность', engName: 'startedDurability', value: 10},
        {name: 'Скорость', engName: 'speed', value: 0},
        {name: 'Броня', engName: 'armor', value: 1},
      ],
      isEquipped: false
    },
    {
      name: 'Каменная панамка',
      engName: 'stoneHat',
      description: 'Носите, если хотите накачать шею.',
      count: 10,
      cost: [
        {name: 'Трава', engName: 'grass', count: 160, type: 'resource'},
        {name: 'Камешки', engName: 'smallStones', count: 20, type: 'resource'},
      ],
      type: 'armor',
      bodyType: 'head',
      durability: 20,
      info: [
        {name: 'Урон', engName: 'damage', value: 0},
        {name: 'Прочность', engName: 'startedDurability', value: 20},
        {name: 'Скорость', engName: 'speed', value: 0},
        {name: 'Броня', engName: 'armor', value: 1},
      ],
      isEquipped: false
    },
    {
      name: 'Каменный нагрудник',
      engName: 'stoneChest',
      description: 'Носите, если хотите накачать грудные мышцы.',
      count: 2,
      cost: [
        {name: 'Трава', engName: 'grass', count: 160, type: 'resource'},
      ],
      type: 'armor',
      bodyType: 'body',
      durability: 20,
      info: [
        {name: 'Урон', engName: 'damage', value: 0},
        {name: 'Прочность', engName: 'startedDurability', value: 20},
        {name: 'Скорость', engName: 'speed', value: 0},
        {name: 'Броня', engName: 'armor', value: 1},
      ],
      isEquipped: false
    },
  ],
  body: {
    head: false,
    body: false,
    leftArm: false,
    rightArm: false,
    leftWrist: false,
    rightWrist: false,
    leftLeg: false,
    rightLeg: false
  },
  /** Переход в другую локацию
   *
   * @param {string} locationName - имя локации, в которую будет происходить переход
   * @returns {void} */
  moveLocation(locationName) {
    const isLocationCurrent = () => {
      return locationName === this.currentLocation
    }

    if (isLocationCurrent()) {
      console.log('Мы уже в этой локации')
      return
    }

    console.log('Идем в локацию')
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
    console.log('Ресурс для добавления в инвентарь, который приходит после обработки:', resource)
    console.log('Добавляем обычный ресурс')

    /** todo пока оставил проверку на ресурс или медицину. Когда буду делать медицину, посмотрю, в этом методе оставить
          или перенести. */
    if (resource.type === 'resource' || resource.type === 'medical') {

      if (this.getInventoryResource(resource))
        this.addSomeCountToInventory(resource)
      else this.addSomeToInventory(resource)
    }

    console.log('Инвентарь после добавления ресурса или создания предмета:', this.inventory)
  },
  decreaseResource(resource) {
    console.log('ресрус, приходящий в decrease resource при создании предмета', resource)

    if (this.getInventoryResource(resource).count - resource.count === 0) {
      console.log('После траты ресурсов, он становитя 0, значит удаляем его')
      this.removeItem(resource)
      return
    }

    this.getInventoryResource(resource).count -= resource.count
  },
  addSomeCountToInventory(something) {
    this.getInventoryResource(something).count += something.count
  },
  addSomeToInventory(something) {
    this.inventory.push(something)
  },
  getInventoryResource(resource) {
    return this.inventory.find(inventoryResource => inventoryResource.engName === resource.engName)
  },
  showResourceBubble(resource, action) {
    const cockedResource = this.getObjectCopy(resource)
    cockedResource.action = action
    resourcesBubbles.value.unshift(cockedResource)
    console.log('бабл ресурсов:', resourcesBubbles.value)

    const timeOut = setTimeout(() => {
      resourcesBubbles.value.pop()
    }, 2400)
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

  addItem(item) {
    console.log('Предмет, приходящий в addItem:', item)
    console.log('Создаем оружие или броню')
    const neededItem = this.getInventoryItem(item)
    console.log('Предмет в инвентаре после поиска:', neededItem)

    if (neededItem) {
      console.log('Предмет существует')
      this.addSomeCountToInventory(item)
    } else {
      console.log('Добавляем целый предмет в инвентарь')
      this.addSomeToInventory(item)
    }

    console.log('Инвентарь после создания предмета:', this.inventory)
  },
  getInventoryItem(item, findEquipped = false) {
    return this.inventory.find(inventoryItem => {
      if (findEquipped) {
        return inventoryItem.engName === item.engName
            && inventoryItem.durability === item.durability
            && inventoryItem.isEquipped === item.isEquipped
      } else {
        return inventoryItem.engName === item.engName && inventoryItem.durability === item.durability
      }
    })
  },
  isAnyItemEquipped(item) {
    /** todo удалить, если не будет нигде использоваться */
    return this.body[item.bodyType]
  },
  isEqualItemEquipped(itemToEquip, equippedItem) {
    return itemToEquip.engName === equippedItem.engName
        && itemToEquip.isEquipped === equippedItem.isEquipped
        && itemToEquip.durability === equippedItem.durability
  },
  getPartOfBody(partOfBody) {
    return this.body[partOfBody]
  },
  putOnItemHandler(item) {
    console.clear()
    console.log('Предмет, приходящий в PutOnItem. Выбранный ресурс(item)', item)
    console.log('Инвентарь', this.inventory)

    const itemToEquip = this.getObjectCopy(item)
    itemToEquip.count = 1
    console.log('Новая надеваемый предмет(newItemTiEquip)', itemToEquip)
    const equippedItem = this.getPartOfBody(itemToEquip.bodyType)
    console.log('Надетый предмет', equippedItem)

    if (!equippedItem) {
      console.log('Никакого предмета не надето, надеваем предмет')
      this.putOnItem(item, itemToEquip)
      console.log('Тело после надетого предмета', this.body)

      return;
    }

    /** если надет такой же предмет, то ничего не делаем */
    if (this.isEqualItemEquipped(itemToEquip, equippedItem)) {
      console.log('Этот предмет уже надет!')
      this.showResourceBubble(item, 'alreadyEquipped')
      return
    }

    /**
     *  если надет другой предмет, то:
     *    1. Снимаем этот предмет
     *    2. Надеваем новый предмет
     * */
    console.log('Какой-то предмет уже надет, будем снимать его')
    this.takeOffItem(this.body[item.bodyType])
    this.putOnItem(item, itemToEquip)

  },
  putOnItem(item, itemToEquip) {
    itemToEquip.isEquipped = true
    item.isEquipped = true

    this.body[item.bodyType] = itemToEquip
    item.count -= 1
    this.showResourceBubble(item, 'putOnItem')

    if (item.count === 0)
      this.removeItem(item)
  },
  takeOffItem(item) {
    console.clear()
    console.log('Приходит предмет, который выбран в инвентаре(item)', item)

    const itemOnBody = this.getPartOfBody(item.bodyType)
    console.log('Предмет на теле(itemOnBody)', itemOnBody)
    let inventoryItem = this.getInventoryItem(itemOnBody)
    console.log('Надетый предмет, который должен быть в инвентаре. Ищется по имени и дурабилити(inventoryItem)', inventoryItem)
    const equippedItemInInventory = this.inventory.find(iItem => iItem.engName === item.engName
        && iItem.isEquipped === item.isEquipped) // нужно для того, что бы чистить isEquipped, когда снимаем поломанный
                                                 // предмет при условии, что надели его из стака целых
    console.log('Надетый предмет в инвентаре', equippedItemInInventory)

    if (!itemOnBody) {
      console.log('Никакой Предмет не надет. Ничего не снимаем')
      this.showResourceBubble(item, 'notEquipped')
      return
    }
    //
    const startedDurability = this.getItemInfo(itemOnBody, 'startedDurability').value
    const durability = itemOnBody.durability

    /** Предмет на теле(itemOnBody) должен соответствовать по эквипу, дурабилити и имени с item */
    if (!this.isEqualItemEquipped(item, itemOnBody)) {
      console.log('Выбранный предмет не соответствует тому, котрый будем снимать')
      this.showResourceBubble(item, 'notEquipped')
      return
    }

    console.log('Снимаем')

    if (inventoryItem) {
      inventoryItem.isEquipped = false
      item.isEquipped = false

      if (equippedItemInInventory)
        equippedItemInInventory.isEquipped = false

      inventoryItem.count += 1
      this.clearPartOfBody(itemOnBody.bodyType)
    } else {
      console.log('Предмета нет, создаем его в инвентаре')
      itemOnBody.isEquipped = false

      if (equippedItemInInventory)
        equippedItemInInventory.isEquipped = false

      this.addBrokenItem(this.getObjectCopy(itemOnBody))
      this.clearPartOfBody(itemOnBody.bodyType)
    }

    this.showResourceBubble(itemOnBody, 'takeOffItem')
  },
  getItemInfo(item, typeOfInfo) {
    console.log(item.info.find(info => info.engName === typeOfInfo))
    return item.info.find(info => info.engName === typeOfInfo)
  },
  addBrokenItem(item) {
    item.count = 1
    this.inventory.push(item)
  },
  /** todo при поломке предмета убирать еще его актуальную версию в инвентаре */
  destroyItemHandler(item) {
    console.clear()
    console.log('Разбираем предмет:', item)
    const itemStartedDurability = this.getItemInfo(item, 'startedDurability').value
    const isItemFull = () => {
      return item.durability === itemStartedDurability
    }
    const isItemHalf = () => {
      return item.durability >= Math.floor(itemStartedDurability/2) && item.durability < itemStartedDurability
    }

    if (isItemFull()) {
      console.log('Разбираем целый предмет')
      this.destroyItem(this.getObjectCopy(item))

      item.count -= 1
      if (item.count === 0)
        this.removeItem(item)
      return
    }
    if (isItemHalf()) {
      console.log('Разбираем половину предмета')
      this.destroyItem(this.getObjectCopy(item), 'half')

      item.count -= 1
      if (item.count === 0)
        this.removeItem(item)
      return
    }

    console.log('Разбираем сломанный предмет')
    this.destroyItem(this.getObjectCopy(item), 'damaged')
    item.count -= 1
    if (item.count === 0)
      this.removeItem(item)
  },
  destroyItem(item, itemDurabilityType = 'full') {
    switch (itemDurabilityType) {
      case 'full':
        console.log('full')
        item.cost.forEach(resource => {
          this.addResource(resource)
          this.showResourceBubble(resource, 'farm')
        })
        this.showResourceBubble(item, 'itemDestroy')
        break
      case 'half':
        console.log('half')
        item.cost.forEach(resource => {
          resource.count = Math.floor(resource.count/2)
          this.addResource(resource)
          this.showResourceBubble(resource, 'farm')
        })
        this.showResourceBubble(item, 'itemDestroy')
        break
      case 'damaged':
        console.log('damaged')
        item.cost.forEach(resource => {
          resource.count = Math.floor(resource.count * 0.25)
          this.addResource(resource)
          this.showResourceBubble(resource, 'farm')
        })
        this.showResourceBubble(item, 'itemDestroy')
        break
      default: return
    }
  },
  removeItem(item) {
    console.log('Удаляем: ', item, 'из инвентаря', this.inventory)
    const itemToDelete = this.getInventoryItem(item)
    const itemIndex = this.inventory.indexOf(itemToDelete)
    console.log('Индекс удаляемого предмета', itemIndex)
    this.inventory.splice(itemIndex, 1)
  },

  clearPartOfBody(partOfBody) {
    this.body[partOfBody] = false
  },
  getObjectCopy(object) {
    return structuredClone(toRaw(object))
  },
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
    ],
    submenu: ['i', 'ресурсы'],
    isCurrent: false
  }
])

/**
 * Объект рецептов.
 *
 * @property {array} [recipes] - Массив Объектов рецептов.
 *
 *
 * @property {string} [name] - Имя на русском
 * @property {string} [engName] - Имя на английском
 * @property {string} [description] - Описание
 * @property {number} [count] - Количество предметов, созданных за один раз
 * @property {array} [cost] - Стоимость в ресурсах
 * @property {string} [type] - Тип
 *           weapon - оружие
 *           armor - броня
 *           medical - медицина
 * @property {array} [info] Массив объектов со второстепенной информацией. У каждого типа создаваемого предмета
 *                   своя информация.
 *
 *                   Для оружия и брони: Урон, Прочность, Скорость, Броня
 *                   Для брони добавляется тип тела
 *                   Для оружия добавляется левая, правая или обе руки.
 *                   Для медицины: Количество использований, Баффы, Дебаффы
 *
 *
 * Пример объекта оружия(у брони такой же, почти):
 * {
 *  name: 'Кривая палка',
 *  engName: 'crookedStick',
 *  description: 'Ветки, наспех связанные сорванной в попыхах травой в своего большого собрата. Выглядит кривой, как культя дряхлой старухи. Бьет так же - небольно и сразу ломается. Не подходит в качестве чесалки для спины, но подходит для того, что бы выколоть кому-нибудь глаз... или даже два. Дешевое и бесполезное оружие. Но в умелых руках так же является бесполезным.',
 *  count: 1,
 *  cost: [
 *    {name: 'Трава', engName: 'grass', count: 20, type: 'resource'},
 *    {name: 'Ветка', engName: 'stick', count: 12, type: 'resource'}
 *  ],
 *  type: 'weapon',
 *  weaponType: 'right',
 *  durability: 1,
 *  info: [
 *    {name: 'Урон', engName: 'damage', value: 3},
 *    {name: 'Начальная прочность', engName: 'startedDurability', value: 1},
 *    {name: 'Скорость', engName: 'speed', value: 30},
 *    {name: 'Броня', engName: 'armor', value: -6},
 *  ],
 * }
 *
 * @property {number} [damage] - урон
 * @property {number} [durability] - прочность
 * @property {number} [startedDurability] - начальная прочность
 * @property {number} [speed] - скорость
 * @property {number} [armor] - броня
 * @property {string} [weaponType] - тип оружия: right, left или both
 * @property {string} [bodyType] - часть тела, на которую надевается броня
 * @property {boolean} [isEquipped] - надет ли предмет
 *
 * Пример объекта предмета, восстанавливающего здоровье или влияющее на здоровье:
 * {
 *  name: 'Простой травяной бинт',
 *  engName: 'simpleHerbalBandage',
 *  description: 'Трава, связанная травой и украшенная тремя разноцветными цветами. Никакой пропаганды. Лечит так же, как и выглядит - на все 5 процентов. Хороший шанс получить какое-нибудь заражение. Проще будет помочиться на рану.',
 *  count: 1,
 *  type: 'medical',
 *  cost: [
 *    {name: 'Трава', engName: 'grass', count: 40, type: 'resource'},
 *    {name: 'Обычный цветок', engName: 'commonFlower', count: 40, type: 'resource'},
 *  ],
 *  info: [
 *    {name: 'Количество использований', engName: 'numberUses', value: 1},
 *    {name: 'Полезные свойства', engName: 'positiveEffects', value: []},
 *    {name: 'Неполезные свойства', engName: 'negativeEffects', value: []},
 *  ],
 * }
 *
 * @property {number} [numberUses] - количество использований
 * @property {array} [positiveEffects] - баффы
 * @property {array} [negativeEffects] - дебаффы
 *
 * @method [create] - создание предмета
 * @method [addRecipe] - add recipe to recipes array - not implemented
 * @method [getRecipeInfo] - получение определенной информации из массива info
 *
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
      weaponType: 'right',
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
    const recipeToCreate = player.getObjectCopy(recipe)
    console.log('Рецепт на создание', recipeToCreate)

    if (player.isResourcesToCreateEnough(recipeToCreate.cost)) {
      console.log('Достаточно ресурсов для создания')
      recipeToCreate.cost.forEach(resource => {
        console.log('ресурс из рецепта, который надо потратить', resource)
        resource.type = 'resource'
        player.decreaseResource(resource)
        player.showResourceBubble(resource, 'resourceDecrease')
      })

      player.addItem(recipeToCreate)
      player.showResourceBubble(recipeToCreate, 'itemCreated')
    }
  },
  addRecipe() {

  }
})
</script>

<template>
  <Map :player="player" :locations="locations" :resourcesBubbles="resourcesBubbles" />
  <UI :inventory="player.inventory" :recipes="recipes" :player="player" />
</template>

<style>

</style>