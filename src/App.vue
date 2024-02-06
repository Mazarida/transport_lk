<script>
import EmptyLayout from "@/layouts/EmptyLayout.vue";
import MainLayout from "@/layouts/MainLayout.vue";

export default {
  components: {
    EmptyLayout, MainLayout
  }
}
</script>

<template>
  <component :is="($route.meta.layout || 'empty') + '-layout'">
    <router-view />
  </component>
</template>

<style scoped>
</style>
