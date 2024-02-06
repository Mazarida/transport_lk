import { createStore, createLogger } from 'vuex'
import createPersistedState from "vuex-plugin-persistedstate"
import { auth } from "./auth.module"
import { user } from "./user.module"
import { column } from "./column.module"
import { faq } from "./faq.module"
import { notifications } from './notifications.module'
import { employers } from './employers.module'

const debug = process.env.NODE_ENV !== 'production'

const store = createStore({
  modules: {
    auth,
    user,
    column,
    faq,
    notifications,
    employers,
  },
  // strict: debug,
  // plugins: debug ? [createLogger(), createPersistedState()] : [createPersistedState()]
});

export default store;