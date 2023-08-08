<script>
export default {
  name: "EmptyLayout"
}
</script>

<template>
  <div class="empty-layout">
    <router-view />
  </div>
</template>

<style scoped>
.empty-layout {
  min-height: 100vh;
  background-image: url(@/assets/img/bg_auth.jpg);
  background-size: cover;
  background-position: top right;
  padding: 68px 0;
}
</style>
