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
 * Сделал todo Окно основных характеристик. Здоровье, вода, время и так далее.
 * Сделал todo map
 * Сделал todo Перемотка времени
 * Сделал todo Удаление старого кода и перенос старых тудушек
 * Сделал todo Мердж веток
 * Сделал todo Создание компонента игры, который будет отвечать за основные аспекты, такие каки инициания разных событий,
 *  перемотка времени и так далее
 * todo Боевка
 * todo Лечение ран
 * todo Система находок как в игре той про принцессу
 * todo Работа над архитектурой
 * todo Создание первых квестов
 * todo Сброс персонажа
 * todo Система прогрессии
 * todo Сохранение игры
 * todo Релиз
 * todo Рефактор
 * todo Внедрение vue-route
 * */
import {storeToRefs} from "pinia";
import {useGameStore} from "@/store/useGameStore.ts";

import Map from "../src/components/Map/Map.vue";
import Bubbles from "@/components/Notification/Bubbles.vue";
import Ui from "@/components/UI/Ui.vue";
import Dialogue from "@/components/Dialogue/Dialogue.vue";
import BattleWindow from "@/views/battle/BattleWindow.vue";

const gameStore = useGameStore()
const {player} = storeToRefs(gameStore)
</script>

<template>
  <Map />
  <Bubbles />
  <Ui />
  <Dialogue />
  <BattleWindow />
</template>

<style></style>