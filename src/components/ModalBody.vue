<template>
  <div class="modal__body">
    <div class="modal-close" @click="modalClose"></div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    modalClose: {
      type: Function,
    }
  }
}
</script>
