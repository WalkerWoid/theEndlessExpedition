<script setup lang="ts">
/**
 * Сделал todo Карта
 * Сделал todo Переход по локациям
 * Сделал todo Бабл уведомлений
 * Сделал todo Фарм ресурсов
 * Сделал todo Создание предметов
 * Сделал todo Окно статуса
 * Сделал todo Экипировка предметов
 * */
import {storeToRefs} from "pinia";
import {useGameStore} from "@/store/useGameStore.ts";

import Map from "../src/components/Map/Map.vue";
import Bubbles from "@/components/Notification/Bubbles.vue";
import Ui from "@/components/UI/Ui.vue";

const gameStore = useGameStore()
const {player} = storeToRefs(gameStore)
</script>

<template>
  <Map />
  <Bubbles />
  <Ui />
</template>

<style></style>