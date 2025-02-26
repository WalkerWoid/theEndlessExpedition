<script setup>/**
 * Компонент всех рецептов */
import {defineAsyncComponent, inject} from "vue";

const Recipe = defineAsyncComponent(() => import("@/components/UI/MainUi/Recipe.vue"))
const recipes = inject('recipes')

const types = {
  armor: 'броня',
  weapon: 'оружие',
  medical: 'медицина'
}
</script>

<template>
  <h2>Рецепты</h2>

  <ul class="ui__subWindow recipes">
    <Recipe v-for="recipe of recipes.recipes" :recipe :types :key="recipe.engName"/>
  </ul>
</template>

<style>
.recipes {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-right: 12px;
}
</style>