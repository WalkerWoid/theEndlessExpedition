<script setup>
  const definedProps = defineProps(['resource'])
  defineEmits(['equipItem', 'unEquipItem'])
</script>
<template>
  <p class="resource main__text"
     :title="resource.description ? `${resource.damage ? 'Урон: ' + resource.damage : 'Урон: 0'}; \n${resource.armor ? 'Броня: ' + resource.armor : 'Броня: 0'}; \n${resource.speed ? 'Скорость: ' + resource.speed : 'Скорость: 0'}; \n${resource.description}` : 'Описания нет'">
    {{resource.name}}: {{resource.count}}

    <span v-if="resource.durability && resource.preEquipped"
          class="main__text _little">({{resource.durabilityLeft}})</span>

    <button v-if="(resource.type === 'armor' || resource.type === 'weapon') && !resource.preEquipped"
            type="button" class="main__btn"
            @click="$emit('equipItem', resource)"
            :class="{'_equipped': resource.preEquipped}">Надеть</button>
    <button v-if="(resource.type === 'armor' || resource.type === 'weapon') && resource.preEquipped"
            type="button" class="main__btn"
            @click="$emit('unEquipItem', resource)"
            :class="{'_equipped': resource.preEquipped}">Снять</button>
  </p>
</template>

<style>
  .resource {
    display: flex;
    align-items: center;
    gap: 20px;
  }
</style>