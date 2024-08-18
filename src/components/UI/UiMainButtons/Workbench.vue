<script setup>/**
 * Компонент начального верстака. Тут будут отображаться начальные предметы, доступные для крафта */
import {effect} from "@vue/reactivity";

const definedProps = defineProps(['workbench'])

const typesInfo = {
  weapon: 'Оружие',
  consumable: 'Расходуемые материалы'
}
</script>
<template>
  <h2 class="h2__header">Обычный верстак</h2>

  <p v-if="!Object.keys(definedProps.workbench).length" class="main__text">Пока рецептов нет(</p>

  <div v-else class="recipes__container">
    <div v-for="recipe of workbench" class="recipe" :key="recipe.engName">
      <h3 class="recipe__title main__text">
        <span>{{recipe.name}}</span>
        <button type="button" class="main__btn">Создать</button>
      </h3>

      <div class="recipe__block">
        <h4 class="main__text">Стоимость:</h4>
        <ul class="main__text _little">
          <li v-for="recipeRes of recipe.cost" class="recipe__cost" :key="recipeRes.engName">
            {{recipeRes.name}}: {{recipeRes.count}}
          </li>
        </ul>
      </div>

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
</template>

<style>
.recipes__container {
  display: flex;
  flex-direction: column;
  overflow: auto;
  max-height: calc(300px - 48px);
  padding-bottom: 15px;
  gap: 40px;
}
.recipe {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.recipe__title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 0 15px;
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