<script setup lang="ts">
import {useGameStore} from "@/store/useGameStore.ts";
import {storeToRefs} from "pinia";
import type {Notification} from "@/classes/notifications.ts";

const {notifications} = storeToRefs(useGameStore())
</script>

<template>
  <ul class="resourceBubbles__container">
    <TransitionGroup name="notification" :duration="1000">
      <li v-for="notification of notifications.notifications as Notification[]" :key="notification.text">
        <p class="main__texture _little">
          <span :class="notification.className">{{notification.text}} </span>
          {{notification.secondText}}
        </p>
      </li>
    </TransitionGroup>
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
  text-align: left;
  display: flex;
  justify-content: flex-end;
  width: 250px;
}
.resourceBubbles__container p {
  border-radius: 5px;
  padding: 4px 8px;
}

/* Появление */
.notification-move {
  transition: all var(--transition) ease-out;
}
.notification-enter-active {
  transition: all var(--transition) ease-out;
}
.notification-enter-from {
  opacity: 0;
  transform: translateX(90px);
}
.notification-enter-to {
  opacity: 1;
  transform: translateX(0);
}

/* Исчезновение */
.notification-leave-active {
  transition: all var(--transition) ease-in;
  position: absolute;
}
.notification-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.notification-leave-to {
  opacity: 0;
  transform: translateX(-90px);
}
</style>