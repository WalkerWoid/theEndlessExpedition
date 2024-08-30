<script setup>/**
 * Компонент начального верстака. Тут будут отображаться начальные предметы, доступные для крафта */
import {onMounted, onUpdated, ref} from "vue";

const definedProps = defineProps(['workbench', 'resources'])

const typesInfo = {
  weapon: 'Оружие',
  consumable: 'Расходуемые материалы',
  armor: 'Броня'
}

const infoNodeRef = ref(null)

onMounted(() => {
  initItemInfoHeight()
})
onUpdated(() => {
})

const initItemInfoHeight = () => {
  const getItemInfoHeight = item => {
    return item.getBoundingClientRect().height
  }
  const resetItemInfoHeight = item => {
    item.style.height = '0'
  }
  infoNodeRef.value.forEach(item => {
    const height = getItemInfoHeight(item)
    resetItemInfoHeight(item)
    item.dataset.height = height
  })
}
const toggleItemInfo = (event) => {
  const itemNode = event.target.parentNode.parentNode
  const itemInfoNode = itemNode.querySelector('.recipe__info')
  const itemInfoHeight = itemInfoNode.dataset.height;
  const openInfoBtn = itemNode.querySelector('.open-info-btn');

  if (!itemInfoNode.classList.contains('_opened')) {
    itemInfoNode.style.height = `${itemInfoHeight}px`
    itemInfoNode.classList.add('_opened');
    openInfoBtn.style.scale = '-1'
  } else {
    itemInfoNode.style.height = `0`
    itemInfoNode.classList.remove('_opened')
    openInfoBtn.style.scale = '1'
  }
}
const createItem = (recipe, event) => {
  const parent = event.target.parentNode
  const statusFieldSuccess = parent.querySelector('.item-create-status._green')
  const statusFieldError = parent.querySelector('.item-create-status._red')
  const itemName = recipe.engName
  const resourcesStatus = []

  const showSuccessField = () => {
    statusFieldError.classList.remove('_opened')
    statusFieldSuccess.classList.add('_opened')

    let timingFunction = setTimeout(() => {
      statusFieldSuccess.classList.remove('_opened')
      // console.log(12)
    }, 1000)
  }
  const showErrorField = () => {
    statusFieldSuccess.classList.remove('_opened')
    statusFieldError.classList.add('_opened')

    let timingFunction = setTimeout(() => {
      statusFieldError.classList.remove('_opened')
      // console.log(12)
    }, 1000)
  }
  const addItemToResources = (item) => {
    // console.log('Созданный предмет', item)
    if (definedProps.resources[itemName]) {
      // console.log('такой предмета есть')
      definedProps.resources[itemName].count += 1
    } else {
      // console.log('такого предмета нет')
      definedProps.resources[itemName] = Object.assign({}, item, {count: 1})
    }
  }

  const wasteOfResources = () => {
    recipe.cost.forEach(res => {
      definedProps.resources[res.engName].count -= res.count
    })
  }

  const item = {}
  item.damage = recipe?.damage
  item.armor = recipe?.armor
  item.durability = recipe?.durability
  item.speed = recipe?.speed
  item.buffs = recipe?.buffs
  item.negativeEffects = recipe?.negativeEffects
  item.engName = recipe.engName
  item.name = recipe.name
  item.type = recipe.type
  item.bodyType = recipe?.bodyType
  item.description = recipe.description

  for (const key in item) {
    if (!item[key]) {
      delete item[key]
    }
  }

  if (Object.keys(definedProps.resources).length === 0) {
    showErrorField()
    return
  }

  for (const res of recipe.cost) {
    if (!definedProps.resources[res.engName]) {
      // console.log('нет ресурса')
      resourcesStatus.push(false)
    } else if (definedProps.resources[res.engName].count >= res.count) {
      // console.log('больше')
      resourcesStatus.push(true)
    } else {
      // console.log('меньше')
      resourcesStatus.push(false)
    }
  }

  if (resourcesStatus.find(element => element === false) !== false && !statusFieldSuccess.classList.contains('_opened')) {
    showSuccessField()
    wasteOfResources()
    addItemToResources(item)
    // console.log(item)
    return;
  }
  if (resourcesStatus.find(element => element === false) === false && !statusFieldError.classList.contains('_opened')) {
    showErrorField()
  }

  console.log(definedProps.resources)
}

</script>

<template>
  <h2 class="h2__header">Обычный верстак</h2>

  <p v-if="!Object.keys(definedProps.workbench).length" class="main__text">Пока рецептов нет(</p>

  <div v-else class="recipes__container">
    <div v-for="recipe of workbench" class="recipe" :key="recipe.engName">
      <h3 class="recipe__title main__text">
        <span class="open-info-btn" @click="toggleItemInfo($event)"></span>
        <span>{{recipe.name}}</span>
        <button type="button" class="main__btn create-item-btn" @click="createItem(recipe, $event)" :data-name="recipe.engName">Создать</button>
        <span class="item-create-status _green main__text _little">Создано!</span>
        <span class="item-create-status _red main__text _little">Нехватает ресурсов!</span>
      </h3>

      <div class="recipe__block">
        <h4 class="main__text">Стоимость:</h4>
        <ul class="main__text _little">
          <li v-for="recipeRes of recipe.cost"
              class="recipe__cost"
              :key="recipeRes.engName"
              :class="resources[recipeRes.engName] ? resources[recipeRes.engName].count >= recipeRes.count ? '_green' : '_red' : '_red'">
            <!-- todo закинуть всю эту чертовщину в вычисляемые значения -->
            {{recipeRes.name}}: {{recipeRes.count}} ({{ resources[recipeRes.engName] ? resources[recipeRes.engName].count : 0 }})
          </li>
        </ul>
      </div>

      <div class="recipe__info" ref="infoNodeRef">
        <div class="recipe__block">
          <h4 class="main__text">Описание:</h4>
          <p class="main__text _little">{{recipe.description}}</p>
        </div>

        <div class="recipe__block _line">
          <h4 class="main__text">Тип:</h4>
          <p class="main__text _little">{{typesInfo[recipe.type]}}</p>
        </div>

        <div v-if="recipe.type === 'weapon' || recipe.type === 'armor'" class="recipe__block _line">
          <h4 class="main__text">Скорость:</h4>
          <p class="main__text _little">{{recipe.speed}}</p>
        </div>

        <div v-if="recipe.type === 'weapon' || recipe.type === 'armor'" class="recipe__block _line">
          <h4 class="main__text">Урон:</h4>
          <p class="main__text _little">{{recipe.damage}}</p>
        </div>

        <div v-if="recipe.type === 'weapon' || recipe.type === 'armor'" class="recipe__block _line">
          <h4 class="main__text">Прочность:</h4>
          <p class="main__text _little">{{recipe.durability}}</p>
        </div>

        <div v-if="recipe.type === 'consumable'" class="recipe__block">
          <h4 class="main__text">Положительные эффекты:</h4>
          <ul class="main__text _little">
            <li v-for="effect of recipe.buffs" class="recipe__cost" :key="effect.title">
              {{effect.text}}
            </li>
          </ul>
        </div>

        <div v-if="recipe.type === 'consumable'" class="recipe__block">
          <h4 class="main__text">Отрицательные эффекты:</h4>
          <ul class="main__text _little">
            <li v-for="effect of recipe.negativeEffects" class="recipe__cost" :key="effect.title">
              {{effect.text}}: {{effect.chance[1] - effect.chance[0]}}%
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.recipes__container {
  display: flex;
  flex-direction: column;
  overflow: auto;
  max-height: calc(700px - 48px);
  padding-bottom: 15px;
  gap: 20px;
  padding-top: 15px;
}
.recipe {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.open-info-btn {
  position: relative;
  width: 10px;
  height: 10px;
  border-bottom: 2px solid var(--border-color);
  border-right: 2px solid var(--border-color);
  transform: rotate(-135deg);
  cursor: pointer;
  transition-duration: var(--transition);
}
.recipe__title {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 0 15px;
  position: relative;
}
.recipe__title .item-create-status {
  position: absolute;
  text-decoration: none;
  right: 23px;
  z-index: 1;
  transition-duration: var(--transition);
  max-width: 100px;
  width: 100%;
  text-align: center;
}
.item-create-status._opened {
  transform: translateY(45px);
}
.create-item-btn {
  margin-left: auto;
  z-index: 2;
}
.recipe__info {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition-duration: var(--transition);
}
.recipe__title span {
  text-decoration: underline;
}
.recipe__block._line {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

</style>