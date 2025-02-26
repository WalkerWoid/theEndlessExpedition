<script setup lang="ts">
import {useGameStore} from "@/store/useGameStore.ts";
import {storeToRefs} from "pinia";

const {notifications} = storeToRefs(useGameStore())
</script>

<template>
  <ul class="resourceBubbles__container">
    <li v-for="notification of notifications.notifications"
        class="main__texture _little">
      <span :class="notification.className">{{notification.text}}</span> {{notification.secondText}}
    </li>
  </ul>
</template>

<style>
.resourceBubbles__container {
  position: fixed;
  z-index: 2;
  top: 30px;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}
.resourceBubbles__container li {
  transition-duration: var(--transition);
  border-radius: 5px;
  padding: 4px 8px;
}
</style>