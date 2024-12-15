<script setup>
import {inject, onMounted} from "vue";

const {someVal, updateSomeVal} = inject('someVal', 0)
onMounted(() => {
  console.log(someVal.value)
})
</script>

<template>
  <h1>Проброшенное инжектом значение {{someVal}}</h1>
  <button @click="updateSomeVal(20)">+1</button>
</template>
