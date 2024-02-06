<template>
  <div class="main-layout__dropdown-logout">
    <div class="bg-wrap"></div>
    <div class="content-wrap">
      <slot/>
    </div>
  </div>
</template>
<script>
export default {
}
</script>
<style>
.main-layout__dropdown-logout {
  position: absolute;
  background: #FFF;
  box-shadow: 0px 0px 14px rgba(23, 23, 23, 0.24);
  top: 47px;
  right: 9px;
  border-radius: 5px;
  padding: 23px 26px;
  z-index: 40;
}

.bg-wrap {
  position: absolute;
  background: #FFF;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 30;
  border-radius: 5px;
}

.content-wrap {
  position: relative;
  z-index: 40;
}

.main-layout__dropdown-logout:before {
  content: '';
  display: block;
  width: 15px;
  height: 15px;
  box-shadow: 0px 0px 14.282px rgba(23, 23, 23, 0.24);
  position: absolute;
  top: -2px;
  right: 10px;
  transform: rotate(45deg);
}

.main-layout__dropdown-logout:after {
  content: '';
  display: block;
  width: 15px;
  height: 15px;
  position: absolute;
  top: -2px;
  right: 10px;
  transform: rotate(45deg);
  background: #FFF;
  z-index: 20;
}

.centrd.main-layout__dropdown-logout:before,
.centrd.main-layout__dropdown-logout:after {
  right: 82px;
}

</style>
