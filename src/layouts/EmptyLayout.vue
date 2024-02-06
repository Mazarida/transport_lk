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
  background-color: #354FA2;
  background-image: url(/src/assets/img/bg_auth.svg);
  background-size: 880px;
  background-repeat: no-repeat;
  background-position: calc(50% - -260px) -21px;
  padding: 68px 0;
}
</style>
