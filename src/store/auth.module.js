import AuthService from '../services/auth.service'

export const auth = {
  namespaced: true,
  state: {
    token: localStorage.getItem("token") || null,
    isAdmin: localStorage.getItem("isAdmin") === 'true' || false,
    status: '',
    error: null
  },

  getters: {
    token: state => state.token,
    isAuthenticated: state => !!state.token,
    isAdmin: state => !!state.admin,
    authStatus: state => state.status,
    errMessage: state => state.error.message,
  },
  actions: {
    login({ commit, dispatch }, user) {
      return AuthService.login(user).then(
        token => {
          commit('loginSuccess', token)
          dispatch("isAdmin", token)
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
    async isAdmin({ commit }, token) {
      return await AuthService.isAdmin(token).then(
        (response) => {
          commit('changeAdmin', response)
        }
      )
    }
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
      state.isAdmin = false
      localStorage.removeItem('isAdmin')
    },
    changeAdmin(state, isAdmin) {
      // console.log('changeAdmin', isAdmin);
      state.isAdmin = isAdmin
      localStorage.setItem('isAdmin', isAdmin)
    }
  }
}
