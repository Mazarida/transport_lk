<script>
import MainLayoutSubheader from "@/components/app/MainLayoutSubheader.vue"

export default {
  name: "PaymentsView",
  components: { MainLayoutSubheader },
}
</script>

<template>
  <MainLayoutSubheader />
  <div class="in-dev">
    Раздел находится в разработке
  </div>
</template>

<style scoped>
.in-dev {
  padding: 1em 0;
}
</style>
