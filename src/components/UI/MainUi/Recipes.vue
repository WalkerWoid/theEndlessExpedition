<script setup>
/**
 * Компонент всех рецептов */

import Recipe from "@/components/UI/MainUi/Recipe.vue";
import {ref} from "vue";

const definedProps = defineProps(['recipes', 'player'])

const types = {
  armor: 'броня',
  weapon: 'оружие',
  medical: 'медицина'
}
</script>

<template>
  <h2>Рецепты</h2>

  <ul class="ui__subWindow recipes">
    <Recipe v-for="(recipe) of recipes.recipes" :key="recipe.engName" :recipe :recipes :player :types />
  </ul>
</template>

<style>
.recipes {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-right: 12px;
}

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