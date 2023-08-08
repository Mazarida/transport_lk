import { createStore, createLogger } from 'vuex'
import createPersistedState from "vuex-plugin-persistedstate"
import { auth } from "./auth.module"
import { user } from "./user.module"
import { column } from "./column.module"
import { faq } from "./faq.module"

const debug = process.env.NODE_ENV !== 'production'

const store = createStore({
  modules: {
    auth,
    user,
    column,
    faq,
  },
  strict: debug,
  plugins: debug ? [createLogger(), createPersistedState()] : [createPersistedState()]
});

export default store;