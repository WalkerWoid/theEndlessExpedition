<script setup>
/**
 * Попап ресурса. Появляется, когда успешно зафармили ресурс */
const definedProps = defineProps(['activeResource'])
</script>

<template>
<!-- todo надо как то сделать так, что бы компонент обновлялся постоянно при клике на фарм ресурсов. Сейчас, если
      фармятся два одинаковых ресурса или не фармятся, то обновления нет. На этом делать анимацию. Как решение,
      передавать рандомное число, на раннем этапе. -->
  <div class="resource__popup main__texture">
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
  transform: translateX(-50%);
  padding: 10px 30px;
  border-radius: var(--radius);
  border: 1px solid var(--border-color);
}
</style>