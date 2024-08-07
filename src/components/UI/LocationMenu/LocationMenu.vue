<script setup>
/**
 * Компонент меню локаций */
// onMounted(() => {
//   console.log('LocationMenu Component mounted')
// })
// onUpdated(() => {
//   console.log('LocationMenu Component updated')
// })

const definedProps = defineProps(['isActual'])
const emits = defineEmits(['farmResource', 'updateLocationTab'])
</script>

<template>
<!-- todo кнопки для локаций сделать динамическими. Например, на первой локации нет охоты, а на других будут охота,
      охота за головами и так далее. -->
  <div class="location__menu" :class="{_nonVisible: !isActual}">
    <span class="location__i main__text _little btn_round">Вы тут</span>

    <div class="location__subMenu" :class="{_open: isActual}">
      <p class="location__btn _info main__text btn_round"
         @click.prevent.stop="$emit('updateLocationTab', 'LocationInfo')">i</p>
      <p class="location__btn _hunt main__text btn_round"
         @click.prevent.stop="$emit('updateLocationTab', 'LocationHunting')">Охота</p>
      <p class="location__btn _res main__text btn_round"
         @click.prevent.stop="$emit('farmResource')">Ресурсы</p>
    </div>
  </div>
</template>

<style>
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
/* todo случайный фарм ресурса происходит из за того, что кнопку ресурса видно, когда она спрятана */
.location__subMenu ._info {
  border-radius: 50%;
  width: 26px;
  height: 26px;
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
  transition-delay: .2s;
  padding: 5px 10px;
}
.location__subMenu._open ._res {
  transform: translate(25px, -50px);
  width: auto;
  border-radius: 10px;
  transition-delay: .4s;
  padding: 5px 10px;
  opacity: 1;
}

.location__btn {
  position: absolute;
  z-index: -2;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition-duration: .4s;
  opacity: 0;
}
</style>