<script setup>
import {onMounted} from "vue";

const definedProps = defineProps(['currentLocation'])

</script>
<template>
  <div>
    <p class="main__text">Информация о локации:</p>
<!--    <h2>Название: {{currentLocation.name}}</h2>-->
<!--    <div>-->
<!--      <h3>Возможные ресурсы:</h3>-->
<!--      <ul>-->
<!--        <li class="main__text _little" v-for="resource of currentLocation.resources">{{resource.name}}</li>-->
<!--      </ul>-->
<!--    </div>-->
  </div>
</template>