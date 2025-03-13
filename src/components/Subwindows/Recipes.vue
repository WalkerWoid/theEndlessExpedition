<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useGameStore} from "@/store/useGameStore.ts";
import Recipe from "@/components/Subwindows/Recipe.vue";

const gameStore = useGameStore()
const {recipes} = storeToRefs(gameStore)
</script>

<template>
  <h2 class="subWindow__header">Рецепты</h2>

  <div class="container _flex">
    <ul class="recipes">
      <Recipe v-for="recipe of recipes.recipes" :key="recipe.engName" :recipe="recipe" />
    </ul>
  </div>
</template>

<style>
.recipes {
  display: flex;
  flex-direction: column;
  gap: var(--gap);
  padding-right: var(--gap);
}
</style>