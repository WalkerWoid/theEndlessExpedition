<script setup>
/**
 * Компонент отдельного рецепта */

import {ref, onMounted, onUpdated} from "vue";
const definedProps = defineProps(['recipes', 'recipe', 'player', 'types'])
const isItemCreated = ref(false)
const recipeInfoRef = ref(null)


onMounted(() => {
  initInfoHeight()
})

/**
 * Определяет, хватает ли определенного ресурса для крафта */
const isResourceEnoughToCraft = (resource, recipeResourceCount) => {
  const inventoryResource = definedProps.player.getInventoryResource(resource)
  return inventoryResource ? inventoryResource.count >= recipeResourceCount : false
}

/**
 * Получение количества определенного ресурса из инвентаря, нужного для отображения общего количество такого ресурса */
const getInventoryResourceCount = (resource) => {
  const neededResource = definedProps.player.getInventoryResource(resource)
  return neededResource ? neededResource.count : 0
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
            :class="{_green: isResourceEnoughToCraft(resource, resource.count),
                       _red: !isResourceEnoughToCraft(resource, resource.count)}">
          {{resource.name}}: {{resource.count}} ({{ getInventoryResourceCount(resource) }})
        </li>
      </ul>
    </div>

    <!-- todo Сделать иконки для большинства свойств и выводить через иконки -->
    <!-- todo нарисовать стрелку для открытия инфы о предмете -->
    <span class="recipe__openInfo" @click="toggleInfoWindow($event)">+</span>

    <ul class="recipe__info" ref="recipeInfoRef">
      <li class="info__row _full">
        <h5>Описание:</h5>
        <p class="_little">{{recipe.description}}</p>
      </li>

      <li class="info__row">
        <h5>Тип:</h5>
        <p class="_little">{{types[recipe.type]}};</p>
      </li>

      <template v-for="info of recipe.info" :key="info.engName">
        <li class="info__row">
          <h5>{{ info.name }}:</h5>
          <p class="_little">{{ info.value }}</p>
        </li>
      </template>
    </ul>
  </li>
</template>

<style>

</style>