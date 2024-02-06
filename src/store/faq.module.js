import FaqService from '../services/faq.service'

// const question = {
//   id: null,
//   question: '',
//   answer: '',
// }

export const faq = {
  namespaced: true,
  state: {
    faq: [],
    status: '',
    error: null
  },
  getters: {
    faq: state => state.faq,
    faqStatus: state => state.status,
    errMessage: state => state.error.message,
  },
  actions: {
    getFaq({ commit }, token) {
      return FaqService.getFaq(token).then(
        faq => {
          commit('getFaqSuccess', faq)

          return Promise.resolve(faq)
        },
        error => {
          commit('getFaqFailure', error)

          return Promise.reject(error)
        }
      )
    },
    deleteFaq({ commit }) {
      commit('deleteFaq')
      FaqService.deleteFaq()
    },
  },
  mutations: {
    getFaqSuccess(state, faq) {
      state.status = 'success'
      state.faq = faq
      state.error = null
    },
    getFaqFailure(state, error) {
      state.status = 'error'
      state.faq = []
      state.error = error
    },
    deleteFaq(state) {
      state.status = ''
      state.faq = []
      state.error = null
    },
  }
}
