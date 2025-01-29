<script setup>
const definedProps = defineProps({
  listSource: [Array, Object],
  keyName: String
})
</script>

<template>
  <ul v-if="listSource">
    <template v-if="$slots.objElement" v-for="(element, key, index) of listSource" :key="element[keyName]">
      <slot name="objElement" v-bind="element" :elementKey="key" :index="index"></slot>
    </template>

    <template v-if="$slots.element" v-for="(element, id) of listSource" :key="element">
      <slot name="element" :element="element" :id="id"></slot>
    </template>
  </ul>
</template>