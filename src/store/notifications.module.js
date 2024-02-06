import NotificationsService from '../services/notifications.service'

export const notifications = {
  namespaced: true,
  state: {
    notifications: [],
    changedNotifications: [],
    status: '',
    error: null
  },
  getters: {
    faq: (state) => state.faq,
    faqStatus: (state) => state.status,
    errMessage: (state) => state.error.message
  },
  actions: {
    switchCheckbox({ commit }, params) {
      commit('changeCheckbox', params)
      commit('appendChangedNotification', params.id)
    },

    getNotifications({ commit }, token) {
      return NotificationsService.getNotifications(token).then(
        (notifications) => {
          // console.log('notifications:', notifications);
          commit('getNotificationsSuccess', notifications)

          return Promise.resolve(notifications)
        },
        (error) => {
          commit('getNotificationsFailure', error)

          return Promise.reject(error)
        }
      )
    },

    async updateNotifications({ commit, state, dispatch }, token) {
      try {
        const promises = state.changedNotifications.map((notification) =>
          NotificationsService.updateNotification(token, notification)
        )
        const responses = await Promise.all(promises)
        responses.forEach((response, index) => {
          console.log(`Уведомление ${state.notifications[index].id}: ${response.data}`)
        })
        // commit('removeChangedNotifications')
        dispatch('getNotifications', token)
      } catch (error) {
        dispatch('getNotifications', token)
        console.error(`Ошибка при обработке уведомлений: ${error.message}`)
        throw error
      }
    }
  },
  mutations: {
    appendChangedNotification(state, id) {
      let changedNotice = state.notifications.filter((notice) => notice.id === id)[0]

      if (!(state.changedNotifications.includes(changedNotice))) {
        state.changedNotifications.push(changedNotice)
      }
    },
    removeChangedNotifications(state) {
      state.changedNotifications = []
    },
    changeCheckbox(state, params) {
      for (let i = 0; i < state.notifications.length; i++) {
        if (state.notifications[i].id === params.id) {
          if (params.type === 'email') {
            state.notifications[i]['toEmail'] = !state.notifications[i]['toEmail']
          } else if (params.type === 'telegram') {
            state.notifications[i]['toTelegram'] = !state.notifications[i]['toTelegram']
          }
        }
      }
    },
    getNotificationsSuccess(state, notifications) {
      state.status = 'success'
      state.notifications = notifications
      state.error = null
    },
    getNotificationsFailure(state, error) {
      state.status = 'error'
      state.notifications = []
      state.error = error
    }
  }
}
