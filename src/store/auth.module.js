import AuthService from '../services/auth.service'

export const auth = {
  namespaced: true,
  state: {
    token: localStorage.getItem("token") || null,
    status: '',
    error: null
  },
  getters: {
    token: state => state.token,
    isAuthenticated: state => !!state.token,
    authStatus: state => state.status,
    errMessage: state => state.error.message,
  },
  actions: {
    login({ commit, dispatch }, user) {
      return AuthService.login(user).then(
        token => {
          commit('loginSuccess', token)
          dispatch("user/getProfile", token, {root: true})
          //dispatch("column/setDefaultColumnFilter", null, {root: true})

          return Promise.resolve(token)
        },
        error => {
          commit('loginFailure', error)

          return Promise.reject(error)
        }
      )
    },
    logout({ commit }) {
      commit('logout')
      AuthService.logout()
    },
  },
  mutations: {
    loginSuccess(state, token) {
      state.status = 'success'
      state.token = token
      state.error = null
    },
    loginFailure(state, error) {
      state.status = 'error'
      state.token = null
      state.error = error
    },
    logout(state) {
      state.status = ''
      state.token = null
      state.error = null
    },
  }
}