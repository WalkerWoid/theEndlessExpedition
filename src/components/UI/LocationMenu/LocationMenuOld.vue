<script setup>/** Компонент меню, которое открывается при нажатии на локацию */
import {onBeforeUpdate, onUpdated} from "vue";

const definedProps = defineProps(['isActual', 'currentLocation'])
defineEmits(['farmResource', 'clickLocationBtn'])
</script>

<!-- todo кнопки для локаций сделать динамическими. Например, на первой локации нет охоты, а на других будут охота,
      охота за головами и так далее. -->
<template>
<!--  <div class="location__menu" :class="{_hidden: !isActual}">
    <span class="location__i main__text _little btn_round">Вы тут</span>

    <div class="location__subMenu" :class="{_open: isActual}">
      <p class="location__btn _info main__text btn_round"
         @click="$emit('clickLocationBtn', 'LocationInfo')">i</p>
      <p class="location__btn _hunt main__text btn_round"
         @click="$emit('clickLocationBtn', 'LocationHunting')">Охота</p>
      <p class="location__btn _res main__text btn_round" @click="$emit('farmResource')">Ресурсы</p>
    </div>
  </div>-->
</template>

<!--
<style>
/* todo при открытии локи все норм, но при закрытии локации(при переходе на другую) всплывающие окошки просто исчезают
    и на долю секунды видно, что они ломаются. Сделать какой-нибудь дилей с обратной анимацией. */

.btn_round {
  background: url("@/assets/images/textures/UI-unit-texture.png");
  border-radius: 50%;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.location__menu {
  transition-duration: .4s;
  z-index: 2;
  display: flex;
  width: 100%;
  max-width: 100%;
  justify-content: center;
  align-items: center;
}
.location__i {
  z-index: 5;
  width: 50px;
  height: 50px;
  padding: 5px;
}

.location__subMenu {
  position: absolute;
  inset: 0;
  z-index: 3;
}
.location__subMenu._open ._info {
  transform: translate(-50px, -50px);
  opacity: 1;
}
.location__subMenu._open ._hunt {
  transform: translate(-50px, 40px);
  opacity: 1;
  width: auto;
  border-radius: 10px;
  padding: 5px 10px;
  transition-delay: .2s;
}
.location__subMenu._open ._res {
  transform: translate(25px, -50px);
  width: auto;
  border-radius: 10px;
  padding: 5px 10px;
  transition-delay: .4s;
  opacity: 1;
}

.location__btn {
  position: absolute;
  z-index: 4;
  width: 26px;
  height: 26px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition-duration: .4s;
  opacity: 0;
}
</style>-->
