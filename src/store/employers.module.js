import EmployersService from '../services/employers.service'

export const employers = {
  namespaced: true,
  state: {
    employers: [],
    status: '',
    error: null
  },
  getters: {
    employers: (state) => state.employers,
    employersStatus: (state) => state.status,
    errMessage: (state) => state.error.message
  },
  actions: {
    getEmployers({ commit }, token) {
      return EmployersService.getEmployers(token).then(
        (employers) => {
          commit('getEmployerSuccess', employers)

          return Promise.resolve(employers)
        },
      )
    },
    async addEmployer({ commit, dispatch }, params) {
      return EmployersService.addEmployer(params.token, params.formData)
      .then((response) => {
        dispatch('getEmployers', params.token)
      })
    },
    changeBlocking({ commit, dispatch, state }, params) {
      const employerToChange = state.employers.find((employer) => employer.id === params.id)
      return EmployersService.changeBlocking(params.token, employerToChange)
      .then((response) => {
        dispatch('getEmployers', params.token)
      })
    }
  },
  mutations: {
    getEmployerSuccess(state, employers) {
      state.status = 'success'
      state.employers = employers
      state.error = null
    },
    getEmployersFailure(state, error) {
      state.status = 'error'
      state.notifications = []
      state.error = error
    },
  }
}
