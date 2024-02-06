
<script setup lang="ts">
import router from "@/router";
import { useStore } from 'vuex'
import { computed } from 'vue'

const store = useStore()
const isAdmin = computed(() => store.state.auth.isAdmin)

const props = defineProps<{
  currentActive: 'index' | 'notifications' | 'admin'
}>()
const changeLocation = (route: string) => {
  router.push({
    name: route,
  })


return {
  isAdmin
}
}
</script>
<template>
  <div class="profile-tabs">
    <div @click="changeLocation('profile')" class="profile-tabs__tab" :class="{ active: props.currentActive === 'index' }">
      Мои данные
    </div>
    <div @click="changeLocation('profile-notifications')" class="profile-tabs__tab" :class="{ active: props.currentActive === 'notifications' }">
      Мои уведомления
    </div>
    <div v-if="isAdmin" @click="changeLocation('profile-admin')" class="profile-tabs__tab" :class="{ active: props.currentActive === 'admin' }">
      Добавить сотрудника
    </div>
  </div>
</template>

<style scoped>
.profile-tabs {
  border-radius: 5px;
  background: #D9D9D9;
  font-size: 16px;
  font-style: normal;
  color: #ACACAC;
  font-weight: 600;
  display: inline-flex;
  margin-top: 15px;
}
.profile-tabs__tab {
  padding: 15px 23px;
  cursor: pointer;
}
.active {
  border-radius: 5px 5px 0px 0px;
  background: #078BBE;
  color: #FFF;
  cursor: default;
  pointer-events: none;
}
</style>
