<script>
import AppSidebar from '@/components/app/AppSidebar.vue'
import SimpleTooltip from "@/components/SimpleTooltip.vue";

export default {
  name: "MainLayout",
  components: {SimpleTooltip, AppSidebar},
  data() {
    return {
      logoutActive: false,
    }
  },
  computed: {
    userName() {
      return this.$store.state.user.userProfile.userName || 'уважаемый клиент'
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch('auth/logout')
          .then(() => {
            this.$router.push('/login?message=logout')
          })
    }
  }
}
</script>

<template>
  <div class="main-layout">
    <AppSidebar class="main-layout__aside"/>
    <div class="main-layout__contents">
      <div @click="logoutActive = !logoutActive" class="main-layout__header">Здравствуйте, <b>{{userName}}</b> <img class="angle-down-auth" src="@/assets/img/angle-down-dark.svg" alt=""></div>
      <simple-tooltip v-click-outside="() => logoutActive = false" v-if="logoutActive">
        <div @click="logout" class="dropdown-logout__action">
          <img class="icon-logout" src="@/assets/img/icon-logout.svg" alt=""> Выйти
        </div>
      </simple-tooltip>
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.main-layout {
  display: flex;
  min-height: 100vh;
}
.main-layout__contents {
  padding: 24px 18px;
  flex-grow: 1;
}
.main-layout__header {
  font-size: 13px;
  line-height: 16px;
  text-align: right;
  margin-bottom: 17px;
  padding: 0 5px;
  cursor: pointer;
}
b {
  font-weight: 700;
}

.dropdown-logout__action {
  cursor: pointer;
  font-size: 14px;
  line-height: 17px;
  display: flex;
  align-items: center;
}

img.icon-logout {
  margin-right: 7px;
}
</style>
