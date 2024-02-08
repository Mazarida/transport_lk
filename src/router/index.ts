import { createRouter, createWebHistory } from 'vue-router'
import OrdersView from '@/views/OrdersView.vue'
import { useStore } from "vuex"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      meta: {
        layout: 'empty',
        title: 'Авторизация'
      },
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/',
      name: 'orders',
      meta: {
        layout: 'main',
        title: 'Заказы',
        auth: true
      },
      component: OrdersView,
    },
    {
      path: '/profile',
      name: 'profile',
      meta: {
        layout: 'main',
        title: 'Профиль пользователя',
        auth: true
      },
      component: () => import('@/views/UserProfileView.vue'),
    },
    {
      path: '/profile/notifications',
      name: 'profile-notifications',
      meta: {
        layout: 'main',
        title: 'Уведомления пользователя',
        auth: true
      },
      component: () => import('@/views/UserNoitificationsView.vue'),
    },
    {
      path: '/profile/admin',
      name: 'profile-admin',
      meta: {
        layout: 'main',
        title: 'Администрирование',
        auth: true,
        admin: true,
      },
      component: () => import('@/views/UserAdminView.vue'),
    },
    {
      path: '/orders/:archive',
      name: 'orders-archive',
      meta: {
        layout: 'main',
        title: 'Архив заказов',
        auth: true
      },
      component: OrdersView,
    },
    {
      path: '/payments',
      name: 'payments',
      meta: {
        layout: 'main',
        title: 'Взаиморасчеты',
        auth: true
      },
      component: () => import('@/views/Payments.vue'),
    },
    {
      path: '/help',
      name: 'help',
      meta: {
        layout: 'main',
        title: 'Помощь',
        auth: true
      },
      component: () => import('@/views/HelpView.vue'),
    },

  ]
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title}`

  const store = useStore()
  // console.log('store:', store);
  
  const isAdmin = store.state.auth.isAdmin
  const isAuthenticated = !!store.state.auth.token

  const requireAuth = to.matched.some(record => record.meta.auth)
  const requireAdmin = to.matched.some(record => record.meta.admin)

  // console.log('isAdmin', isAdmin, 'isAuthenticated', isAuthenticated);
  // console.log('requireAuth', requireAuth, 'requireAdmin', requireAdmin);
  
  

  if (requireAdmin && !isAdmin) {
    next('/login?message=login')
  } else if (requireAuth && !isAuthenticated) {
    next('/login?message=login')
  } else if (!requireAuth && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
