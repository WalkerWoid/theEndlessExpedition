<script setup>
import {defineAsyncComponent, provide, reactive, ref, watch} from "vue";

const AsyncTest2 = defineAsyncComponent(() => import("@/components/Test2.vue"))

let someVal = ref(2)
const someObj = reactive({name: 'Alice'})
const updateSomeVal = (val) => {
  someVal.value += val
}
provide('someVal', {someVal, updateSomeVal})
provide('someObj', someObj)

class Player {
  constructor(name) {
    this.name = name;
    this.health = 100;
  }
  changeHealth(amount) {
    this.health += amount;
  }
  getHealth() {
    return this.health
  }
}

const player = reactive(new Player('Герой'));
function increaseHealth() {
  player.changeHealth(10);
}
watch(() => player.health, (newh, oldh) => {
  console.log(newh)
})
</script>

<template>
  <AsyncTest2 />
  <div>
    <h1>Игрок: {{ player.name }}</h1>
    <p>Здоровье: {{ player.health }}</p>
    <button @click="increaseHealth">Увеличить здоровье</button>
  </div>
</template>