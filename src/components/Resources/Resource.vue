<script setup>
  defineProps(['resource'])
</script>
<template>
  <p class="resource main__text">
    {{resource.name}}: {{resource.count}}
  </p>
</template>