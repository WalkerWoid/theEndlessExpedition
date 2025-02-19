<script setup lang="ts">
/**
 * Главный компонент игры */

/**
 * Сделал todo сделать убавление еды и воды каждый час
 * Пока что это не буду делать todo рандомные эвенты при переходе из локации в локацию: бои, рандомная информация. Для
 *  этого надо создать компонент эвентов
 * todo сделать объект монстров, которых можно будет встретить в каждой локации
 * todo сделать окно охоты на монстров и животных в локации
 * todo сделать боевку
 *
 * Для релиза:
 * todo придумать начальные квесты
 * todo дорисовать лиственный лес
 * todo дорисовать домик ведьмы
 *
 * Главные квесты:
 * todo Встреча с китой
 * todo Встреча с волшнбным ведьменским цветком.
 *
 * todo перенести все на Pinia
 * */

import {defineAsyncComponent, ref, reactive, watch, provide, toRaw, onMounted, onUpdated} from "vue";
import Dialogues from "@/Characters/NonPlayerCharacters.js"
import Quests from "@/Characters/Quests.js";

const Map = defineAsyncComponent(() => import("@/components/Map/Map.vue"))
const UI = defineAsyncComponent(() => import("@/components/UI/UI.vue"))
const Events = defineAsyncComponent(() => import("@/Game/Events.vue"))
const HuntWindow = defineAsyncComponent(() => import("@/Game/Battle.vue"))
const DeveloperPanel = defineAsyncComponent(() => import("@/Game/DeveloperPanel.vue"))
const battleWindowVisibility = ref(false)
const eventsWindowVisibility = ref(false)

const val = ref<string>('daw')

const positiveEffects = {
  heal: {
    simpleHerbalBandage: {
      name: 'Слабое Лечение',
      chance: 100,
      health: 20,
      ticks: 2
    }
  }
}
const negativeEffects = {
  bloodPoisoning: {
    simpleHerbalBandage: {
      name: 'Заражение крови',
      chance: 8,
      food: -4,
      water: -6,
      ticks: 40
    }
  },
  wormsUnderTheSkin: {
    simpleHerbalBandage: {
      name: 'Заражение червями',
      chance: 50,
      health: -1,
      food: -12,
      water: -20,
      sanity: -20,
      ticks: 70
    }
  }
}
const resourcesBubbles = ref([])

const activeWindow = ref('Inventory')
const uiWindowsVisibility = reactive({
  topMenu: true,
  statusMenu: true,
})

/**
 * @param {boolean} notification - видели ли мы эту подсказку. Отображается зеленым цветом
 * @param {boolean} wasShown - добавлялась ли эта подсказка
 * */
const allHints = reactive({
  awakingThoughts1: {
    title: 'awakingThoughts1',
    text: `Спустя два часа после пробуждения я все-таки нашел тетрадь и ручку, которые валялись около моих ног,
    на самом видном месте. Пора записать всё с начала. Я очнулся в каком-то непонятном саркофаге. Голова раскалывается.
    Первая мысль - я мертв, но чувство неумолимой жажды говорит об обратном. Я не знаю что это за место и кто я такой.
    Так же на меня надет непонятный скафандр, который снять пока не получается. Что делать - тоже остается загадкой.`,
    notification: true,
    wasShown: false
  },
  awakingThoughts2: {
    title: 'awakingThoughts2',
    text: `При беглом осмотре саркофага выяснилось, что это не саркофаг а какая-то капсула с кучей систем
    жизнеобеспечения. Экраны, экраны, экраны с миллионом разных показателей. Но один выделялся: зеленый мониторчик,
    прямо над моим местом, с цифрой 1017. Что это значит? В голове пустота. В капсуле я нашёл бортовой журнал. Запустить
    его оказалось проще простого. Это странно: я ничего не помню, но техническая часть выглядит… понятной. Как будто мои
    руки знают, что делать, даже если мозг — нет. Амнезия?`,
    notification: true,
    wasShown: false
  },
  awakingThoughts3: {
    title: 'awakingThoughts3',
    text: `Судя по бортовому журналу, который капсула мне заботливо предоставила, я был отправлен на эту планету с целью
    ее изучения. Воздух токсичен, фауна и флора - опасна. Поэтому я тут. Почему? Не могу сказать - другая часть
    информации по какой-то причине недоступна. Мысли в кучу, сложно их изъяснять даже в голове. Хочется пить и есть.
    Поищу еду и воду в капсуле.`,
    notification: true,
    wasShown: false
  },
  awakingThoughts4: {
    title: 'awakingThoughts4',
    text: `PS: наткнулся на "Пад", который предоставил мне всю информацию обо мне. Удобная вещь, разделил мне всю
    информацию по окошкам. Даже какие-то "Рецепты" есть, и журнал. Отныне записываю свои наблюдения теперь тут. Так же
    выкрою немного времени для изучения пада и, пожалуй, буду носить его с собой.`,
    notification: true,
    wasShown: false
  },
  firstTimeOpenStatus: {
    title: 'firstTimeOpenStatus',
    text: `Окно статуса. Показывает основную информацию обо мне... Фираксис, значит. Необычное имя. Место, псевдоним,
    порядковый номер, бла-бла-бла. Ой вой, осужденный по законам? Убийство ценного объекта? Так нет, нет, нет, нет, нет.
    Это какая-то ошибка...`,
    notification: true,
    wasShown: false
  },
  firstTimeOpenInventory: {
    title: 'firstTimeOpenInventory',
    text: `Инвентарь. Тут будут отображаться мои ресурсы и предметы? А куда они будут складываться физически? Интересно.
    Бортовой журнал, я хочу кое-что узнать!`,
    notification: true,
    wasShown: false
  },
  firstTimeOpenRecipes: {
    title: 'firstTimeOpenRecipes',
    text: `Окно рецептов. Пока не знаю, что про него сказать. Может быть тут будут рецепты, а может и нет... Если я и
    правда отправлен на эту планету для ее изучения, то вкладка рецептов будет очень полезна, так же как и вкладка
    инвентаря.`,
    notification: true,
    wasShown: false
  },
  firstTimeOpenQuests: {
    title: 'firstTimeOpenQuests',
    text: `Журнал активных заданий, ничего сложного.`,
    notification: true,
    wasShown: false
  },
  deleteHints: {
    title: 'deleteHints',
    text: `Понятно, по нажатию на какую-либо запись, она удалится из журнала. Checked.`,
    notification: true,
    wasShown: false
  },
  questFirstClick: {
    title: 'questClick',
    text: `Клик по заданию ничего не дал, но если задержать на нем курсор - можно получить небольшую подсказку к
    заданию! Так же у задания есть статус. И пока этот статус - в процессе. Как только буду уверен в том, что задача
    выполнена, снова кликну по ней. Что же случится?`,
    notification: true,
    wasShown: false
  },
})
const dialogues = reactive(new Dialogues())

/*
  todo у каждого противника будет полоска агрессивности, в заивимости от неебудет увеличиваться скорость и атака. Пока
    не реализовано
  todo от полоски адреналина, которая будет увеличиваться по мере уменьшения здоровья, будут использоваться все более
    опасные атаки.
  todo я же хотел сделать так, что будет описание приготовления врага, но игрок не будет знать, что враг будет делать.
    У игрока будут несколько выборов типа атаковать или стоять на месте
*/
const enemies = {
  littleSlime: {
    chance: [0, 100],
    name: 'Маленький слайм',
    description:
        `Маленький сгусток живой воды, переливающийся на солнце зеленым цветом. Глубоко внутри него виднеется темный
        шарик - его желудок, скорее всего.`,
    meetText: [
        `В поисках приключений вы наткнулись на слайма, мирно развалившегося на камне. Он пристально смотрит на вас...
        или не на вас, а может он смотрит налево или вообще повернут к вам спиной? Чертовых глаз то у него нет! Или он
        просто спит, замышляет что-то коварное или собирается атаковать? Единственный способ узнать правду – атаковать
        первым!`,
        `Вы заметили самку оленя. Пока она не успела вас заметить, вы решили тихонько подкрасться... но что-то
        отвратительно чавкает под вашей ногой. Зеленая, липкая масса недовольно дрожит – это слайм! Вы стряхиваете его и
        пинаете подальше, но пока отвлекались, олениха уже скрылась. Сраный слайм! Нужно наказать его за испорченный
        ужин. Предлагаю разорвать его зубами, а потом... Ладно, не будем заходить так далеко. Хотя решать, конечно,
        вам.`,
        `Блуждая по полю, вы замечаете что-то блестящее вдали. Артефакт? Сокровище? Вы быстро подбегаете, наклоняетесь,
        чтобы схватить его, и... оно вздрагивает, чавкает и пытается улизнуть! Вы машинально хватаете находку, и теперь
        ваша рука по локоть в чем-то склизком и возмущенно пузырящемся. Это слайм. Поздравляю, у вас новый питомец. Или
        паразит. А может, вы его питомец. Вопрос философский, но решать его некогда - пора атаковать!`,
    ],
    health: 10,
    armor: 0,
    speed: 10,
    adrenaline: 0,
    maxAdrenaline: 10,
    aggressive: 0,
    maxAggressive: 10,
    buffs: [],
    deBuffs: [],
    attackTypes: [
      {
        title: 'slimeShield',
        rusTitle: 'Слаймовый щит.',
        type: 'armor',
        damage: 0,
        armor: 20,
        text: `Зеленая кожа слайма преобрела нежно розовый оттенок, блеснув на Солнце. Сам слайм остался в неподвижном
        положении изредка подрагивая. Что замышляет этот маленький проказник?`
      },
      {
        title: 'simpleAttack.',
        rusTitle: 'Обычная атака',
        type: 'attack',
        damage: 1,
        text: `Поверхность слайма начала пузыриться, воздух прошил резкий треск, а в нос ударил едкий запах. К коже
        слайма из самых его недр стало что-то вытягиваться прямо в вашем направлении. Надо что-то предпринять, пока оно
        не закончило свои приготовления.`
      },
      {
        title: 'slimePower',
        rusTitle: 'Склизская сила.',
        type: 'buff',
        damage: '0',
        buffs: [{damage: 6, armor: 14, speed: 3, steps: 4}],
        text: `Из самого центра слайма в область его тела что-то впрыснулось, постепенно растворяясь по всей области
        слайма`,
      }
    ],
    loot: [
      { name: "mucus", engName: "Слизь", count: 1, type: 'resource' },
    ]
  }
}

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
    this.iteration = 1
    this.name = 'Фираксис Рейнхард'
    this.secondName = 'Охотник'
    this.number = 117
    this.currentLocation = 'landingZone'
    this.status = `Осужденный по законам 19 - *Данные повреждены*; 20 - *Данные повреждены*; 21 - *Данные повреждены*;
    22 - *Данные повреждены*; 698 - Убийство особо ценного объекта, а именно: *Данные повреждены*.`
    this.health = 200
    this.maxHealth = 200
    this.food = 300
    this.maxFood = 300
    this.water = 100
    this.maxWater = 100
    this.inventory = [
      {name: 'Бутылка с дистилированной водой', engName: 'distilledWater', count: '12', type: 'water', water: 40 },
      {name: 'Сухпаек', engName: 'dryFood', count: '12', type: 'food', food: 60 }
      // { "name": "Трава", "engName": "grass", "count": 320, "type": "resource" },
      // { "name": "Обычный цветок", "engName": "commonFlower", "count": 40, "type": "resource" },
      // { name: 'Ветка', engName: 'stick', count: 200, type: 'resource'},
      // { name: 'Камушек', engName: 'littleStone', count: 200, type: 'resource'},
      // {
      //   "name": "Травяная панамка",
      //   "engName": "herbalPanamaHat",
      //   "description": "Будет выглядеть модно, если вы полугодовалый ребенок. Можно надеть сразу поверх вашего скафандра на смех всем полугодовалым детям в радиусе этого континента.",
      //   "count": 2,
      //   "cost": [
      //     {
      //       "name": "Трава",
      //       "engName": "grass",
      //       "count": 160,
      //       "type": "resource"
      //     }
      //   ],
      //   "type": "armor",
      //   "bodyType": "head",
      //   "durability": 10,
      //   "info": [
      //     {
      //       "name": "Урон",
      //       "engName": "damage",
      //       "value": 0
      //     },
      //     {
      //       "name": "Прочность",
      //       "engName": "startedDurability",
      //       "value": 10
      //     },
      //     {
      //       "name": "Скорость",
      //       "engName": "speed",
      //       "value": 0
      //     },
      //     {
      //       "name": "Броня",
      //       "engName": "armor",
      //       "value": 1
      //     }
      //   ],
      //   "isEquipped": false
      // },
      // {
      //   "name": "Травяная панамка",
      //   "engName": "herbalPanamaHat",
      //   "description": "Будет выглядеть модно, если вы полугодовалый ребенок. Можно надеть сразу поверх вашего скафандра на смех всем полугодовалым детям в радиусе этого континента.",
      //   "count": 2,
      //   "cost": [
      //     {
      //       "name": "Трава",
      //       "engName": "grass",
      //       "count": 160,
      //       "type": "resource"
      //     }
      //   ],
      //   "type": "armor",
      //   "bodyType": "head",
      //   "durability": 6,
      //   "info": [
      //     {
      //       "name": "Урон",
      //       "engName": "damage",
      //       "value": 0
      //     },
      //     {
      //       "name": "Прочность",
      //       "engName": "startedDurability",
      //       "value": 10
      //     },
      //     {
      //       "name": "Скорость",
      //       "engName": "speed",
      //       "value": 0
      //     },
      //     {
      //       "name": "Броня",
      //       "engName": "armor",
      //       "value": 1
      //     }
      //   ],
      //   "isEquipped": false
      // },
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
    this.effects = []
    this.quests = new Quests()
    this.conditions = []
    this.minutes = 0
    this.hours = 23
    this.days = 0
    this.map = {
      landingZone: ['landingZone2'],
      landingZone2: ['landingZone']
    }
    this.enemies = enemies
    this.activeEnemy = undefined
    this.damage = 2

    this.journal = []
    this.activeQuests = {}
    this.addHint(allHints.awakingThoughts1)
    this.addHint(allHints.awakingThoughts2)
    this.addHint(allHints.awakingThoughts3)
    this.addHint(allHints.awakingThoughts4)

    this.quests.addQuest(this.activeQuests, this.quests.quests.farmResources)
    this.quests.addQuest(this.activeQuests, this.quests.quests.findStartedResources)
  }



  /**
   * Изменение названия текущей локации
   *
   * @param {string} newLocation - название новой локации
   * @return {void}
   *
   * */
  changeLocation(newLocation) {
    if (this.map[this.currentLocation].find(location => location === newLocation)) {
      this.currentLocation = newLocation
    } 
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

    // console.clear()
    const locationResources = getLocationResources()
    const randomValForResource = this.getRandomByRange([0, 100])
    // const randomValForResource = 100
    const resource = getResource(locationResources, randomValForResource) ?? false

    if (!resource) {
      this.showResourceBubble(resource, 'resourceNotFarmed')
      console.log('Рандомное число', randomValForResource)
      console.log('Лутаем ресурс', resource)
      console.log('В количестве', resourceCount)
      console.log('Готовый ресурс', cockedResource)
      console.log('Инвентарь', toRaw(this.inventory))
      return;
    }

    const resourceCount = this.getRandomByRange(resource.count)
    const cockedResource = getCockedResource(resource, resourceCount)
    this.addResource(cockedResource)
    this.changeTime(29, 0)
    console.log('Инвентарь', this.inventory)

    console.log('Рандомное число', randomValForResource)
    console.log('Лутаем ресурс', resource)
    console.log('В количестве', resourceCount)
    console.log('Готовый ресурс', cockedResource)
    console.log('Инвентарь', toRaw(this.inventory))
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

    this.showResourceBubble(cockedResource, 'farm')
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
    this.changeTime(30, 0)
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
    this.showResourceBubble(item, 'disassembleItem')
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
      this.showResourceBubble(item, 'alreadyEquipped')
      return
    }

    const bodyType = item.bodyType
    const itemToEquip = this.getObjectCopy(item)
    itemToEquip.count = 1
    this.changeTime(15, 0)

    /**
     * Если на теле ничего нет. */
    if (!this.body[bodyType]) {
      console.log('Надеваем предмет в', bodyType)
      console.log('Предмет, который будем надевать', itemToEquip)
      console.log('Слот тела пустой, надеваем предмет')

      this.body[bodyType] = itemToEquip
      this.quantityItemCheck(item)
      console.log('Тело после надевания предмета', this.body)
      this.showResourceBubble(item, 'equipped')
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
      this.showResourceBubble(item, 'equipped')
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

    if (!this.body[bodyType]) {
      this.showResourceBubble(item, 'bodyClear')
      return
    }

    this.changeTime(15, 0)

    if (!this.isEquippedItemEqual(item)) {
      this.showResourceBubble(item, 'itemNotEquipped')
      return
    }

    if (this.getInventoryItem(this.body[bodyType])) {
      console.log('Снимаемый предмет есть в инвентаре, прибавляем единичку')
      this.getInventoryItem(this.body[bodyType]).count += 1
      this.showResourceBubble(item, 'unEquipped')
      this.clearPartOfBody(bodyType)
      return
    }

    console.log('Такого предмета в инвентаре нет, создаем новый')
    this.addItemToInventory(this.body[bodyType])
    this.clearPartOfBody(bodyType)
    this.showResourceBubble(item, 'unEquipped')
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
   * Использование предмета
   *
   * @param {Object} item - используемый предмет
   * */
  useItem(item) {
    console.clear()
    console.log('Используем', item)
    console.log(this.inventory)
    console.log(this)

    this.changeTime(1, 0)
    const {positiveEffects, negativeEffects} = item
    const allItemEffects = [...positiveEffects, ...negativeEffects]
    console.log('Все эффекты предмета', allItemEffects)

    allItemEffects.forEach(effect => {
      const randomVal = this.getRandomByRange([0, 100])
      if (effect.chance >= randomVal) {
        this.addEffect(effect)
        this.showResourceBubble(effect, 'getEffect')
      }
      console.log('Сгенерированное число для определенного эффекта', randomVal)
    })
    item.count -= 1
    if (item.count === 0) {
      this.deleteFromInventory(this.inventory.indexOf(this.getInventoryItem(item)))
    }


    this.showResourceBubble(item, 'useItem')
  }

  /**
   * todo - способ задавать айдишники для эффектов, что бы их можно было удобно чистить. Если какой-то из эффектов будет тик 0, то просто чистим все эффеекты */
  /**
   * Считает действие эффектов при тике
   *
   * @param {Object} effect - объект эффекта, который надо "скалькулировать"
   * @return {void}
   *
   * */
  calcEffect(effect) {
    effect.ticks -= 1

    if (effect.health && player.health <= player.maxHealth) {
      this.changeHealth(effect.health)
    }
    if (effect.food) {
      this.changeFood(effect.food)
    }
    if (effect.water) {
      this.changeWater(effect.water)
    }
    if (effect.sanity) {
      this.changeSanity(effect.sanity)
    }

    if (effect.ticks === 0) {
      this.effects = this.effects.filter(effect => effect.ticks >= 1)
      this.showResourceBubble(effect, 'deleteEffect')
    }
  }

  clearEffect(name = false) {
  }
  clearEffects() {
    this.effects = []
  }
  addEffect(effect) {
    this.effects.push(this.getObjectCopy(effect))
  }

  changeHealth(health) {
    this.health += health
  }
  changeFood(food) {
    this.food += food
  }
  changeWater(water) {
    this.water += water
  }
  changeSanity(sanity) {
    this.sanity += sanity
  }

  resetHealth() {
    this.health = this.maxHealth
  }
  resetFood() {
    this.food = this.maxFood
  }
  resetWater() {
    this.water = this.maxWater
  }
  addIteration() {
    this.iteration += 1
  }
  clearInventory() {
    this.inventory = []
  }


  getTime(typeOfTime) {
    if (this[typeOfTime].toString().length === 1) {
      return `0${this[typeOfTime]}`
    } else {
      return this[typeOfTime]
    }
  }
  changeTime(minutes = 0, hours = 0) {
    this.minutes += minutes
    this.hours += hours
  }


  getActiveQuest(id) {
    return this.activeQuests[id]
  }
  hideQuest(id) {
    this.getActiveQuest(id).visibility = false
  }
  addCondition(condition) {
    if (this.conditions.filter(cond => cond === condition).length === 0) {
      this.conditions.push(condition)
    }
    console.log('кондишонс', this.conditions)
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
  showResourceBubble(resource, action) {
    const rowObj = {
      text: 'Сломано',
      secondText: 'Наручи из жопы дракона',
      className: '_green'
    }

    switch (action) {
      case "farm":
        rowObj.text = '+'
        rowObj.secondText = `${resource.name}: ${resource.count}`
        break
      case "resourceDecrease":
        rowObj.text = '-'
        rowObj.secondText = `${resource.name}: ${resource.count}`
        rowObj.className = '_red'
        break
      case "itemCreated":
        rowObj.text = 'Создано'
        rowObj.secondText = `${resource.name}`
        break
      case "disassembleItem":
        rowObj.text = 'Разобрано'
        rowObj.secondText = `${resource.name}`
        rowObj.className = '_red'
        break
      case "alreadyEquipped":
        rowObj.text = 'Уже экипировано'
        rowObj.secondText = `${resource.name}`
        break
      case "equipped":
        rowObj.text = 'Экипировано'
        rowObj.secondText = `${resource.name}`
        break
      case "unEquipped":
        rowObj.text = 'Снято'
        rowObj.secondText = `${resource.name}`
        rowObj.className = '_red'
        break
      case "bodyClear":
        rowObj.text = 'На теле ничего нет!'
        rowObj.secondText = ``
        rowObj.className = '_red'
        break
      case "itemNotEquipped":
        rowObj.text = 'Этот предмет не надет'
        rowObj.secondText = `${resource.name}`
        rowObj.className = '_red'
        break
      case "useItem":
        rowObj.text = 'Использовано'
        rowObj.secondText = `${resource.name}`
        break
      case "getEffect":
        rowObj.text = '+'
        rowObj.secondText = `${resource.name}`
        break
      case "deleteEffect":
        rowObj.text = '-'
        rowObj.secondText = `${resource.name}`
        rowObj.className = '_red'
        break
      case "playerDead":
        rowObj.text = 'Персонаж погиб'
        rowObj.secondText = ``
        rowObj.className = '_red'
        break
      case "resourceNotFarmed":
        rowObj.text = 'Увы, ничего не нашли'
        rowObj.secondText = ``
        rowObj.className = '_red'
        break
      case "doSomeAction":
        rowObj.text = 'Выполнено'
        rowObj.secondText = `${resource.action}`
        break
    }

    resourcesBubbles.value.unshift(rowObj)
    // console.log('бабл ресурсов:', resourcesBubbles.value)

    const timeOut = setTimeout(() => {
      resourcesBubbles.value.pop()
    }, 2400)
  }

  addHint(hint) {
    if (hint.wasShown)
      return

    hint.wasShown = !hint.wasShown
    this.journal.push(hint)
  }
}

const player = reactive(new Player())

watch([() => player.food, () => player.water], ([newFood, oldFood], [newWater, oldWater]) => {
  if (player.water <= 0) {
    player.water = 0
  } else if (player.water > player.maxWater) {
    player.water = player.maxWater
  }

  if (player.food <= 0) {
    player.food = 0
  } else if (player.food > player.maxFood) {
    player.food = player.maxFood
  }
})

/**
 * Вотчер наблюдения за названием текущей локации */
watch(() => player.currentLocation, (newLocationName, oldLocationName) => {
  player.getLocation(oldLocationName).isCurrent = false
  player.getLocation(newLocationName).isCurrent = true
  player.changeTime(0, 1)
})

watch(() => player.hours, (newHours, oldHours) => {
  if (player.water <= 0) {
    player.water = 0
    player.changeHealth(-10)
  } else if (player.water > player.maxWater) {
    player.water = player.maxWater
  }

  if (player.food <= 0) {
    player.food = 0
    player.changeHealth(-4)
  } else if (player.food > player.maxFood) {
    player.food = player.maxFood
  }

  player.effects.forEach(effect => {
    player.calcEffect(effect)
  })
  console.log('newHours', newHours)

  // console.log('Все эффекты игрока', player.effects)
  player.effects.forEach(effect => console.log(effect))

  player.changeFood(-19)
  player.changeWater(-12)
})

/**
 * Вотчер наблюдения за тиками */
watch([() => player.hours, () => player.minutes], ([newHours, newMinutes], [oldHours, oldMinutes]) => {
  if (newMinutes >= 60) {
    player.minutes = newMinutes%60
    player.changeTime(0, 1)
  }

  if (newHours === 24 && newMinutes > 0) {
    player.days += 1
    player.hours = 0
  }

  if (newHours > 24) {
    player.days += 1
    player.hours = newHours%24
  }
})


/** todo посмотреть про вотчеры еще раз и узнать, как сделать привязку к нескольким переменным */
watch(() => player.health, (newHealth, oldHealth) => {
  if (newHealth <= 0) {
    console.log('Персонаж погиб')
    player.resetHealth()
    player.resetWater()
    player.resetFood()
    player.addIteration()
    player.clearEffects()
    player.clearInventory()
    player.showResourceBubble(player, 'playerDead')
    return
  }
  if (player.health > player.maxHealth) {
    console.log(player.health)
    player.health = player.maxHealth
    console.log('Персонаж полностью исцелен')
  }
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
      {chance: [1, 60], name: 'Трава', engName: 'grass', count: [10, 20], type: 'resource'},
      {chance: [61, 80], name: 'Ветка', engName: 'stick', count: [6, 10], type: 'resource'},
      {chance: [81, 99], name: 'Обычный цветок', engName: 'commonFlower', count: [3, 7], type: 'resource'},
      {chance: [100, 100], name: 'Златограйник', engName: 'goldenFlower', count: [1, 1], type: 'resource'}
    ],
    submenu: [
      {title: 'i', id: 'info'},
      {title: 'ресурсы', id: 'resources'},
      {title: 'охота', id: 'hunt'},
      {title: 'контракты', id: 'contracts'},
      {title: 'карта', id: 'map'},
      {title: 'ритуалы', id: 'rituals'}
    ],
    isCurrent: true,
    npc: ['logbook'],
    enemies: ['littleSlime', 'littleLivingStone', 'flowerBird', 'blackScorpion']
  },
  {
    id: 1,
    name: 'Тестовая зона1',
    engName: 'landingZone2',
    coords: [200, 200],
    width: 135,
    height: 140,
    resources: [
      {chance: [99, 99], name: 'Златограйник', engName: 'goldenFlower', count: [1, 1], type: 'resource'}
    ],
    submenu: [
      {title: 'i', id: 'info'},
      {title: 'ресурсы', id: 'resources'}
    ],
    isCurrent: false,
    npc: ['satyr']
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
 * @property {array} positiveEffects - массив положительных эффектов
 * @property {array} negativeEffects - массив негативных эффектов
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
      description: 'Трава, связанная травой и украшенная тремя разноцветными цветами. Никакой пропаганды. Лечит так же, как и выглядит - на троечку. Хороший шанс получить какое-нибудь заражение. Проще будет помочиться на рану.',
      count: 1,
      cost: [
        {name: 'Трава', engName: 'grass', count: 40, type: 'resource'},
        {name: 'Обычный цветок', engName: 'commonFlower', count: 3, type: 'resource'},
      ],
      type: 'medical',
      info: [
        {name: 'Количество использований', engName: 'numberUses', value: 1},
      ],
      positiveEffects: [
        positiveEffects.heal.simpleHerbalBandage
      ],
      negativeEffects: [
        negativeEffects.bloodPoisoning.simpleHerbalBandage,
        negativeEffects.wormsUnderTheSkin.simpleHerbalBandage
      ]
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
      player.showResourceBubble(resource, 'resourceDecrease')
    })

    player.addItemToInventory(recipeToCreate)
    player.showResourceBubble(recipeToCreate, 'itemCreated')
    if (recipeToCreate.type === 'medical') {
      player.changeTime(10, 0)
    }
    if (recipeToCreate.type === 'armor' || recipeToCreate.type === 'weapon') {
      player.changeTime(45, 0)
    }
  },
})


provide('locations', locations.value)
provide('player', player)
provide('recipes', recipes)
provide('journal', player.journal)
provide('allHints', allHints)
provide('activeWindow', activeWindow)
provide('uiWindowsVisibility', uiWindowsVisibility)
provide('dialogues', dialogues)
provide('battleWindowVisibility', battleWindowVisibility)
provide('eventsWindowVisibility', eventsWindowVisibility)
</script>

<template>
  <Map />
  <UI :resourcesBubbles />
<!--  <Events />-->
<!--  <HuntWindow />-->
  <DeveloperPanel />
</template>

<style>

</style>
