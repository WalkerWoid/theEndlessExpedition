<script setup>
/**
 * Попап ресурса. Появляется, когда успешно зафармили ресурс */
import {ref, onUpdated} from "vue";
const definedProps = defineProps(['activeResource'])
const resourcePopup = ref(null)

onUpdated(() => {
  updateResourcePopup()
})
/* todo сделать при фарме ресурсов пул(всплывающие баблы) с количеством ресурсов по всему экрану, каждый из которых
    будет исчезать через какое-то время */
const updateResourcePopup = () => {
  const resPopup = resourcePopup.value
  if (resPopup.classList.contains('_closed')) {
    resPopup.classList.remove('_closed')
    return
  }

  const removeAnimClass = setTimeout(() => {
    resPopup.classList.remove('_animated')
    console.log('class was removed')
  }, 400)
  if (resPopup.classList.contains('_animated')) {
    resPopup.classList.remove('_animated')
    clearTimeout(removeAnimClass)
  }
  resPopup.classList.add('_animated')
}
const closeResourcePopup = () => {
  resourcePopup.value.classList.add('_closed')
}
</script>

<template>
  <div class="resource__popup main__texture _closed" ref="resourcePopup" @click="closeResourcePopup">
      <p v-if="activeResource" class="main__text">
        Вы нашли
        <span class="_green">{{activeResource.name}}</span>
        в количестве
        <span class="_green">{{activeResource.count}}</span>
      </p>

      <p v-else class="main__text">Увы, вы ничего не нашли</p>
  </div>
</template>

<style>
.resource__popup {
  cursor: pointer;
  transition-duration: .4s;
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translate(-50%, 0);
  padding: 10px 30px;
  border-radius: var(--radius);
  border: 1px solid var(--border-color);
}
.resource__popup._closed {
  transform: translate(-50%, -120%);
}
.resource__popup._animated {
  animation: scaleAnim ease-in-out forwards .4s;
}
@keyframes scaleAnim {
  0% {
    transform: translate(-50%, 0) rotate(0deg);
  }
  25% {
    transform: translate(-50%, 0) rotate(1deg);
  }
  50% {
    transform: translate(-50%, 0) rotate(0deg);
  }
  75% {
    transform: translate(-50%, 0) rotate(-1deg);
  }
  100% {
    transform: translate(-50%, 0) rotate(0deg);
  }
}
</style>