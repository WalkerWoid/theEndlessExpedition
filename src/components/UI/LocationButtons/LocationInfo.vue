<script setup>
import {onMounted} from "vue";

const definedProps = defineProps(['currentLocation', 'currentLocation'])

</script>
<template>
  <h2>{{currentLocation.name}}</h2>
  <div>
    <h2>Возможные ресурсы:</h2>
    <ul>
      <li class="main__text _little" v-for="resource of currentLocation.resources">{{resource.name}}</li>
    </ul>
  </div>
</template>