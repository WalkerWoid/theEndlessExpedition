<script setup>/**
 * Компонент всплывающего окна, когда происходит удачный фарм ресурса. */
import {onUpdated, ref} from "vue";

const definedProps = defineProps(['activeResource'])
const messages = [
    'Крутой',
    'Фармила от бога!',
    'Остановите его уже, КТО-НИБУДЬ!',
    'Твоя бабушка случайно не комбайн?',
    'Это не StardewValley, что бы собирать столько ресурсов!',
    'Кому-то пора на пенсию',
    'Камни с цветами карманы не жмут?',
    'Лудоман...',
    'Плюшкин...',
    'Крутой-крутой',
    'Ультра-мега-крутой',
    'Ультра-супер-пупер-мега-крутой',
    'Буду звать тебя крутым... Не буду'
]

const resourcesPopupRef = ref(null)
const flyingResourcePopupRef = ref(null)
let randomId = ref(0)
let messageAccum = ref(0)

onUpdated(() => {
  showResourcePopup()
})

/**
 * Получает рандомный id для "смешных" фраз */
const getRandomId = () => {
  randomId = getRandomValue(0, messages.length-1)
}

/**
 * Показывает всплывающее окошко, когда успешно(или нет) фармится ресурс */
const showResourcePopup = () => {
  const resourcePopupContainer = resourcesPopupRef.value
  const flyingPopup = flyingResourcePopupRef.value

  /**
   * Виден ли попап ресурса */
  const isResourcePopupVisible = () => {
    return resourcePopupContainer.classList.contains('_hidden')
  }

  /**
   * Показывает попап ресурса */
  const showResourcePopup = () => {
    resourcePopupContainer.classList.remove('_hidden')
  }

  /**
   * Добавляет класс анимации к попапу ресурса */
  const addAnimToResourcePopup = () => {
    resourcePopupContainer.classList.add('_anim')
  }

  /**
   * Удаляет класс анимации у попапа ресура */
  const removeAnimFromResourcePopup = () => {
    resourcePopupContainer.classList.remove('_anim')
  }

  /**
   * Увеличивает счетчик сообщений. На каждой десятке будет появляться новое сообщение. А то заебывают частые
   * всплывающие сообщения. */
  const increaseAccum = () => {
    messageAccum.value+=1
  }

  /**
   * Сбрасывает счетчик сообщений */
  const resetMessageAccum = () => {
    messageAccum.value = 0
  }

  if (isResourcePopupVisible()) {
    showResourcePopup()
    return
  }

  /* todo сделать анимацию при каждом клике, а то если компонент не обновляется, то и анимация не воспроизводится */
  if (definedProps.activeResource) {
    addAnimToResourcePopup()
    increaseAccum()

    setTimeout(() => {
      removeAnimFromResourcePopup()
    }, 400)
  }

  if (definedProps.activeResource && messageAccum.value === 10) {
    moveFlyingPopup()
    getRandomId()
    resetMessageAccum()
  } else {
    flyingPopup.classList.add('_hidden')
  }
}

/**
 * Закрывает попап ресурса при нажатии на него */
const hideWindow = (target) => {
    target.classList.add('_hidden')
}

/**
 * Передвигает летающий попап */
const moveFlyingPopup = () => {
  flyingResourcePopupRef.value.classList.remove('_hidden')
  const windowWidth = window.innerWidth-150
  const windowHeight = window.innerHeight-150

  /**
   * Получает новые координаты */
  const getCoordinates = () => {
    const newX = getRandomValue(50, windowWidth)
    const newY = getRandomValue(50, windowHeight)

    return {
      x: newX,
      y: newY
    }
  }

  /**
   * Устанавливает новые координаты */
  const setCoordinates = (x, y) => {
    flyingResourcePopupRef.value.style.left = `${x}px`
    flyingResourcePopupRef.value.style.top = `${y}px`
  }

  const {x ,y} = getCoordinates()
  setCoordinates(x, y)
}

/**
 * Получение рандомного числа с Min и Max*/
const getRandomValue = (min, max) => {
  return Math.round(Math.random() * (max - min) + min)
}


</script>
<template>
  <!-- todo мб для всплывающей подсказки сделать просто количество и картинку? что бы окошко уж слишком большим не было -->
  <!-- todo для динамического окна высчитывать рандомные координаты заранее. Тип при очередном показе высчитывать
        координаты уже для следующего показа. -->
  <div class="resource__popup _hidden" ref="resourcesPopupRef" @click="hideWindow(resourcesPopupRef)">
    <p v-if="activeResource" class="main__text">
      Вы нашли
      <span class="_green">{{activeResource.name}}</span>
      в количестве
      <span class="_green">{{activeResource.count}}</span>
    </p>
    <p v-else class="main__text">Увы, вы ничего не нашли</p>
  </div>

  <div class="resource__popup _flying _hidden" ref="flyingResourcePopupRef" @click="hideWindow(flyingResourcePopupRef)">
      <p class="main__text">{{messages[randomId]}}</p>
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
  background: url("@/assets/images/textures/UI-unit-texture.png") no-repeat center;
  background-size: cover;
  border-radius: var(--radius);
  border: 1px solid var(--border-color);
}
.resource__popup._flying {
  transition-duration: 0s;
  z-index: 6;
  left: auto;
  transform: initial;
  border: 1px solid var(--border-color);
}
.resource__popup._flying._hidden {
  display: none;
}

.resource__popup._anim p {
  animation: shakeAnim ease .4s;
}
@keyframes shakeAnim {
  0% {
    transform: rotate(0);
  }
  25% {
    transform: rotate(1deg);
  }
  50% {
    transform: rotate(0);
  }
  75% {
    transform: rotate(-1deg);
  }
  100% {
    transform: rotate(0);
  }
}
.resource__popup p {
  transition-duration: .4s;
}
</style>