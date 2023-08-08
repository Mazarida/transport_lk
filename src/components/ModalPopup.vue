<template>
  <div class="modal" v-if="modalActive">
    <div class="modal__bg" @click="modalClose"></div>
    <modal-body :class="modalBodyClass" :modal-close="modalClose">
      <slot></slot>
    </modal-body>
  </div>
</template>
<script>
import ModalBody from "@/components/ModalBody.vue";
export default {
  components: {ModalBody},
  data() {
    return {
      modalActive: false
    }
  },
  props: {
    modalBodyClass: {
      type: [String, Object],
      default: '',
    }
  },
  methods: {
    modalClose() {
      this.modalActive = false
    },
    modalOpen() {
      this.modalActive = true
    }
  }
}
</script>
