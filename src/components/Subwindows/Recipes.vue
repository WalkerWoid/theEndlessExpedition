<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useGameStore} from "@/store/useGameStore.ts";
import RecipeTest from "@/components/Subwindows/RecipeTest.vue";

const gameStore = useGameStore()
const {recipes} = storeToRefs(gameStore)
</script>

<template>
  <div class="subWindow__header">Рецепты</div>

  <div class="container _flex">
    <ul class="recipes">
      <RecipeTest v-for="recipe of recipes.recipes" :key="recipe.engName" :recipe="recipe" />
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