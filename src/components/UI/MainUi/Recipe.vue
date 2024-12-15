<script setup>/**
 * Компонент отдельного рецепта */
import {inject, onMounted, ref, useTemplateRef} from "vue";

const defiedProps = defineProps({
  recipe: Object,
  types: Object
})
const recipes = inject('recipes')
const player = inject('player')
const recipeInfoRef = ref(null)
const itemWasCreated = ref(false)

onMounted(() => {
  initInfoHeight()
})

/**
 * Начальная установка высоты в data-аттрибут для всех окошек информации о предмете. Потом я устанавливаю высоту в 0 и
 * при клике тащу высоту из data-аттрибута, что бы все работало плавненько */
const initInfoHeight = () => {
  if (!recipeInfoRef.value.dataset.height) {
    recipeInfoRef.value.dataset.height = `${recipeInfoRef.value.getBoundingClientRect().height}`
    resetInfoWindowHeight(recipeInfoRef.value)
  }
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
 * Появление оповещения об удачном создании предмета
 *
 * @param {Object} recipe - объект рецепта
 * @return {void}
 *
 * */
const itemCreate = (recipe) =>  {
  if (itemWasCreated.value) {
    return
  }

  if (player.isResourcesToCreateEnough(recipe.cost)) {
    itemWasCreated.value = true

    setTimeout(() => {
      itemWasCreated.value = false
    }, 800)
  }

  recipes.create(recipe);
}
</script>

<!-- todo вместо "создать" сделать иконку молоточка -->
<!-- todo Сделать иконки для большинства свойств и выводить через иконки -->
<!-- todo нарисовать стрелку для открытия инфы о предмете -->

<template>
  <li class="recipe">
    <div class="recipe__main">
      <h3 class="_big">{{recipe.name}}</h3>
      <p class="recipe__create main__texture" @click="itemCreate(recipe)">
        Создать
      </p>
      <span class="item__created _green _little" :class="{_hide: !itemWasCreated}">+{{recipe.count}}</span>

      <ul class="recipe__cost">
        <li v-for="resource of recipe.cost"
            class="_little main__texture"
            :class="{_green: player.getInventoryResourceCount(resource) >= resource.count,
                       _red: player.getInventoryResourceCount(resource) < resource.count}">
          {{resource.name}}: {{resource.count}} ({{ player.getInventoryResourceCount(resource) }})
          {{  }}
        </li>
      </ul>
    </div>

    <span class="recipe__openInfo" @click="toggleInfoWindow($event)">+</span>

    <ul class="recipe__info" :ref="(node) => {recipeInfoRef = node}">
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
.recipe {
  position: relative;
}
.recipe__openInfo {
  position: absolute;
  top: 38px;
  left: 8px;
  width: 12px;
  height: 12px;
  color: var(--border-color);
  z-index: 2;
  cursor: pointer;
}
.recipe__main {
  position: relative;
  display: flex;
  flex-direction: column;
}
.recipe__main h3 {
  display: inline-flex;
}
.recipe__create {
  position: absolute;
  right: 0;
  top: 0;
  padding: 4px 8px;
  border-radius: 8px;
  cursor: pointer;
  z-index: 2;
}
.recipe__cost {
  border-top: 1px solid var(--border-color);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding-left: 30px;
}
.recipe__cost li {
  border-top: none;
  border-radius: 0 0 4px 4px;
  padding: 4px 8px;
}
.recipe__info {
  overflow: hidden;
  transition-duration: var(--transition);
  display: flex;
  flex-wrap: wrap;
  gap: 0 12px;
}

.info__row {
  padding-top: 10px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}
.info__row._full {
  flex-direction: column;
  gap: 0;
  align-items: flex-start;
  width: 100%;
}

.item__created {
  transition-duration: .8s;
  position: absolute;
  top: 6px;
  right: 100px;
  z-index: 1;
}
.item__created._hide {
  right: 70px;
}
</style>