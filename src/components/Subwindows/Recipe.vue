<script setup lang="ts">
import type {InventoryItemsTypes} from "@/classes/player.ts";
import type {Recipes} from "@/classes/allRecipes.ts";
import type {MedicalRecipe} from "@/classes/allRecipes.ts";

import {ref, useTemplateRef, watch} from "vue";
import {storeToRefs} from "pinia";
import {useGameStore} from "@/store/useGameStore.ts";

const definedProps = defineProps<{
  recipe: Recipes
}>()

const {recipes, player, notifications, game} = storeToRefs(useGameStore())
const recipeInfo = useTemplateRef<HTMLElement | null>('recipeInfoRef')
const recipeInfoHeight = ref<number>(0)
const recipeInfoVisibility = ref<boolean>(false)

const isMedicalRecipe = (recipe: Recipes): recipe is MedicalRecipe => {
  return 'positiveEffects' in recipe || 'negativeEffects' in recipe
}
const toggleRecipeInfo = () => {
  if (!recipeInfo.value) return

  if (recipeInfoVisibility.value) {
    recipeInfo.value.style.height = `0px`
    recipeInfoVisibility.value = false
  } else {
    recipeInfo.value.style.height = `${recipeInfoHeight.value}px`
    recipeInfoVisibility.value = true
  }
}

/** todo мб в зависимлсти от типа предмета так же сделать разное количество прошедшего времени */
const createRecipe = (recipeToCreate: Recipes) => {
  if (recipes.value.createRecipe(recipeToCreate, player.value.inventory)) {
    notifications.value.showNotification(recipeToCreate, 'createItem')
    recipeToCreate.cost.forEach(resource => notifications.value.showNotification(resource, 'decreaseResource'))
    game.value.changeTime(15, 0, 0)
  } else {
    notifications.value.showNotification(recipeToCreate, 'cantCreate')
  }
}


const isResourcesToCreateEnough = (resource: InventoryItemsTypes): boolean => {
  const foundInventoryResource = player.value.inventory.getInventoryResource(resource)

  if (foundInventoryResource) return foundInventoryResource.count >= resource.count
  else return false
}
const getTotalResourceNumber = (resource: InventoryItemsTypes): number => {
  const foundInventoryResource = player.value.inventory.getInventoryResource(resource)

  if (foundInventoryResource)
    return foundInventoryResource.count
  else return 0
}


watch(() => recipeInfo.value, (newRef) => {
  if (!newRef) return

  recipeInfoHeight.value = newRef.offsetHeight
  newRef.style.height = '0'
}, {once: true})
</script>

<!-- todo вместо "создать" сделать иконку молоточка -->
<!-- todo Сделать иконки для большинства свойств и выводить через иконки -->
<!-- todo нарисовать стрелку для открытия инфы о предмете -->

<template>
  <li class="recipe">
    <div class="recipe__main">
      <h3 class="_big">{{recipe.name}}</h3>

      <p class="main__texture recipe__create" @click="createRecipe(recipe)">
        Создать
      </p>

      <ul class="recipe__cost">
        <li v-for="resource of recipe.cost"
            class="_little main__texture"
            :class="{_green: isResourcesToCreateEnough(resource), _red: !isResourcesToCreateEnough(resource)}">
          {{resource.name}}: {{resource.count}} ({{getTotalResourceNumber(resource)}})
        </li>
      </ul>
    </div>

    <span class="recipe__open-info" @click="toggleRecipeInfo">+</span>

    <ul class="recipe__info" ref="recipeInfoRef">
      <li class="info__li">
        <h5>Описание:</h5>
        <p class="_little">{{recipe.description}}</p>
      </li>

      <li class="info__li">
        <h5>Тип:</h5>
        <p class="_little">{{recipe.ruType}}</p>
      </li>

      <template v-for="info of recipe.info">
        <li class="info__li">
          <h5>{{info.name}}:</h5>

          <p class="_little">
            {{info.value}}
          </p>
        </li>
      </template>

      <template v-if="isMedicalRecipe(recipe)">
        <li v-if="recipe.positiveEffects" class="info__li">
          <h5>Положительные эффекты:</h5>
          <p v-for="positive of recipe.positiveEffects" :key="positive.name" class="_little">
            {{positive.name}}({{positive.chance}}%)
          </p>
        </li>

        <li v-if="recipe.negativeEffects" class="info__li">
          <h5>Негативные эффекты:</h5>
          <p v-for="negative of recipe.negativeEffects" :key="negative.name" class="_little">
            {{negative.name}}({{negative.chance}}%)
          </p>
        </li>
      </template>
    </ul>
  </li>
</template>

<style>
.recipe {
  position: relative;
}
.recipe__main {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--gap-half)
}
.recipe__create {
  padding: var(--gap-half);
  border-radius: var(--radius-half);
  cursor: pointer;
}
.recipe__cost {
  padding-left: 30px;
  border-top: 1px solid var(--border-color);
  flex: 1 1 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--gap-half);
}
.recipe__cost li {
  border-top: none;
  padding: var(--gap-half);
  border-radius: 0 0 var(--radius-half) var(--radius-half);
}

.recipe__info {
  padding-top: var(--gap);
  overflow: hidden;
  transition-duration: var(--transition);
  display: flex;
  flex-direction: column;
  gap: var(--gap-half);
}
.recipe__open-info {
  position: absolute;
  top: 47px;
  left: 6px;
  width: 12px;
  height: 12px;
  color: var(--border-color);
  z-index: 2;
  cursor: pointer;
}
.info__li {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: var(--gap-half)
}
</style>