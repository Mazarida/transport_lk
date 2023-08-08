<script>
export default {
  name: "MainLayoutSubheader",
}
</script>

<template>
  <div class="main-layout__subheader">
    <h1>{{ $route.meta.title }}</h1>
    <slot></slot>
  </div>
</template>

<style scoped>
.main-layout__subheader {
  background: #17365A;
  padding: 14px;
  display: flex;
  justify-content: space-between;
  border-radius: 10px;
  color: #FFFFFF;
}
h1 {
  font-weight: 700;
  font-size: 19px;
  line-height: 23px;
}
</style>
