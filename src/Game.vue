<script setup lang="ts">
/**
 * Сделал todo Карта
 * Сделал todo Переход по локациям
 * Сделал todo Бабл уведомлений
 * Сделал todo Фарм ресурсов
 * Сделал todo Создание предметов
 * Сделал todo Окно статуса
 * Сделал todo Экипировка предметов
 * Сделал todo Разбор предметов
 * Сделал todo Журнал с заметками
 * Сделал todo Действие эффектов
 * Сделал todo Подокно локации
 * Сделал todo Диалоги
 * Сделал todo Основные последствия в диалогах.
 * Сделал todo Задания
 * todo Перемотка времени
 * todo Окно основных характеристик. Здоровье, вода, время и так далее.
 * */
import {storeToRefs} from "pinia";
import {useGameStore} from "@/store/useGameStore.ts";

import Map from "../src/components/Map/Map.vue";
import Bubbles from "@/components/Notification/Bubbles.vue";
import Ui from "@/components/UI/Ui.vue";
import Dialogue from "@/components/Dialogue/Dialogue.vue";

const gameStore = useGameStore()
const {player} = storeToRefs(gameStore)
</script>

<template>
  <Map />
  <Bubbles />
  <Ui />
  <Dialogue />
</template>

<style></style>