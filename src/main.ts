import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import vClickOutside from "click-outside-vue3"

const app = createApp(App)

app.use(store)
app.use(router)
app.use(vClickOutside)

app.config.globalProperties.$store = store
app.config.globalProperties.$axios = axios

app.mount('#app')
