<script setup lang="ts">
// import { useRouter } from 'vue-router'
// import { useStore } from "vuex"
import { ref } from "vue";
import store from "@/store";

const isAdmin = store.getters["auth/isAdmin"]

const links = [
  {title: 'Заказы', url: '/', icon: 'orders'},
  {title: 'Архивные заказы', url: '/orders/archive', icon: 'orders-archive'},
  {title: 'Взаиморасчёты', url: '/payments', icon: 'payments'},
  {title: 'Профиль', url: '/profile', icon: 'profile'},
  {title: 'Помощь', url: '/help', icon: 'help'},
]

const cropMenu = ref(false)
const mobileMenuActive = ref(false)

// const router = useRouter()
// const store = useStore()

// const logout = async () => {
//   await store.dispatch('auth/logout')
//       .then(() => {
//         router.push('/login?message=logout')
//       })
// }
</script>

<template>
  <div :class="`sidebar${cropMenu ? ' cropped' : ''}${mobileMenuActive ? ' mobile-menu-active' : ''}`">
    <div class="sidebar__logo-menus">
      <a href="https://bescargo.ru/" v-if="!cropMenu" class="sidebar__logo"></a>
      <div title="Свернуть меню" @click="cropMenu = !cropMenu" class="sidebar__menu-btn desktop-only"></div>
      <div @click="mobileMenuActive = !mobileMenuActive" class="sidebar__menu-btn mobile-only"></div>
    </div>
    <nav class="sidebar__main-menu">
      <router-link class="sidebar__link" v-for="link in links" :key="link.url" :to="link.url">
        <i v-if="link.icon" class="menu-icon" :style="`background-image: url('/img/${link.icon}.svg')`"></i>
        <template v-if="!cropMenu">{{ link.title }}</template>
      </router-link>
    </nav>
  </div>

</template>

<style scoped>
.sidebar {
  background: #17365A;
  color: #fff;
  width: 215px;
  padding: 28px 16px;
}
.sidebar.cropped {
  width: 60px;
}
.sidebar__logo-menus {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 180px;
  margin-bottom: 50px;
}
.sidebar__menu-btn {
  background-image: url("@/assets/img/sidebar__menus-icon.svg");
  background-size: 15px;
  background-position: center;
  background-repeat: no-repeat;
  width: 28px;
  height: 15px;
  cursor: pointer;
}
.sidebar__logo {
  background-image: url("@/assets/img/sidebar__logo.svg");
  background-size: contain;
  background-repeat: no-repeat;
  width: 100px;
  height: 45px;
  display: block;
}
.sidebar__link {
  color: inherit;
  text-decoration: none;
  display: block;
  font-size: 16px;
  line-height: 18px;
  margin-bottom: 14px;
}
.sidebar__link.router-link-active {
  font-weight: 700;
}
.menu-icon {
  width: 28px;
  height: 28px;
  background-size: 14px;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 8px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 9px;
}
a.router-link-active .menu-icon {
  background-color: #0E2845;
}
</style>
