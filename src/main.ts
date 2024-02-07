import './assets/main.css'
import 'vue-final-modal/style.css'

import { createApp } from 'vue'
import { createVfm } from 'vue-final-modal'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import vClickOutside from "click-outside-vue3"

const app = createApp(App)
const vfm = createVfm()

app.use(store)
app.use(router)
app.use(vClickOutside)
app.use(vfm)

app.config.globalProperties.$store = store
app.config.globalProperties.$axios = axios

app.mount('#app')
