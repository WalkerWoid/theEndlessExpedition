<script setup lang="ts">
/**
 * Сделал todo Карта
 * Сделал todo Переход по локациям
 * Сделал todo Бабл уведомлений
 * todo Фарм ресурсов
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