<script setup>
/**
 * Компонент отдельного рецепта */

import {ref, onMounted} from "vue";
const definedProps = defineProps(['recipes', 'recipe', 'player', 'types'])
const isItemCreated = ref(false)
const recipeInfoRef = ref(null)

onMounted(() => {
  initInfoHeight()
})

/**
 * Получение определенного ресурса из инвентаря по имени */
const getResource = (resourceEngName) => {
  return definedProps.player.inventory.find(resource => resource.engName === resourceEngName)
}

/**
 * Определяет, хватает ли определенного ресурса для крафта */
const isResourceEnoughToCraft = (resourceEngName, resourceCount) => {
  return getResource(resourceEngName) ? getResource(resourceEngName).count >= resourceCount : false
}

/**
 * Получение количества определенного ресурса, нужного для крафта */
const getResourceCount = (resourceEngName) => {
  return getResource(resourceEngName) ? getResource(resourceEngName).count : 0
}

/**
 * Показывает удачно создан предмет или нет */
const showCreatedItemCount = (recipe) => {
  if (definedProps.player.isResourcesToCreateEnough(recipe.cost))
    isItemCreated.value = true
}


/**
 * Установка высоты окна с информацией о предмете в 0 */
const resetInfoWindowHeight = (infoWindow) => {
  infoWindow.style.height = 0
}

/**
 * Открывает/закрывает окно информации о предмете */
const toggleInfoWindow = (event) => {
  const infoWindow = event.target.nextSibling
  const dataHeight = infoWindow.dataset.height
  const height = infoWindow.getBoundingClientRect().height

  if (height === 0) {
    infoWindow.style.height = `${dataHeight}px`
  } else {
    resetInfoWindowHeight(infoWindow)
  }
}

/**
 * Начальная установка высоты в data-аттрибут для всех окошек информации о предмете. Потом я устанавливаю высоту в 0 и
 * при клике тащу высоту из data-аттрибута, что бы все работало плавненько */
const initInfoHeight = () => {
  if (!recipeInfoRef.value.dataset.height) {
    recipeInfoRef.value.dataset.height = `${recipeInfoRef.value.getBoundingClientRect().height}`
    resetInfoWindowHeight(recipeInfoRef.value)
  }
}

const itemCreate = (recipe) => {
  if (isItemCreated.value) {
    return
  }

  if (definedProps.player.isResourcesToCreateEnough(recipe.cost)) {
    isItemCreated.value = true

    setTimeout(() => {
      isItemCreated.value = false
    }, 800)
  }

  definedProps.recipes.create(recipe);
}
</script>

<template>
  <li class="recipe">
    <div class="recipe__main">
      <!-- todo вместо "создать" сделать иконку молоточка -->
      <h3 class="_big">{{recipe.name}}</h3>
      <p class="recipe__create main__texture" @click="itemCreate(recipe)">
        Создать
      </p>
      <span class="item__created _green _little" :class="{_hide: !isItemCreated}">+{{recipe.count}}</span>

      <ul class="recipe__cost">
        <li v-for="resource of recipe.cost"
            class="_little main__texture"
            :class="{_green: isResourceEnoughToCraft(resource.engName, resource.count),
                       _red: !isResourceEnoughToCraft(resource.engName, resource.count)}">
          {{resource.name}}: {{resource.count}} ({{ getResourceCount(resource.engName) }})
        </li>
      </ul>
    </div>

    <!-- todo Сделать иконки для большинства свойств и выводить через иконки -->
    <!-- todo нарисовать стрелку для открытия инфы о предмете -->
    <span class="recipe__openInfo" @click="toggleInfoWindow($event)">+</span>

    <div class="recipe__info" ref="recipeInfoRef">
      <div class="info__row _description">
        <h5>Описание:</h5>
        <p class="_little">{{recipe.description}}</p>
      </div>

      <div class="info__row">
        <h5>Тип:</h5>
        <p class="_little">{{types[recipe.type]}};</p>
      </div>

      <div class="info__row" v-if="recipe.damage">
        <h5>Урон:</h5>
        <p class="_little">{{recipe.damage}};</p>
      </div>

      <div class="info__row" v-if="recipe.armor">
        <h5>Броня:</h5>
        <p class="_little">{{recipe.armor}};</p>
      </div>

      <div class="info__row" v-if="recipe.speed">
        <h5>Скорость использования:</h5>
        <p class="_little">{{recipe.speed}};</p>
      </div>

      <div class="info__row" v-if="recipe.durability">
        <h5>Прочность:</h5>
        <p class="_little">{{recipe.durability}};</p>
      </div>

      <div class="info__row" v-if="recipe.numberUses">
        <h5>Количество использований:</h5>
        <p class="_little">{{recipe.numberUses}};</p>
      </div>
    </div>
  </li>
</template>

<style>

</style>