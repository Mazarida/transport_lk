import UserService from '../services/user.service'

const defaultUserProfile = {
  // managerId
  empId: null,
  userName: '',
  userPhone: '',
  userEmail: '',
  orgWeb: '',
  orgName: '',
  managerName: '',
  managerEmail: '',
  chiefName: '',
  chiefEmail: '',
  officeEmail: '',
  officePhone: '',
  officeWorkHours: '',
  params: {
    columnFilters: [],
    activeColumnFilter: null
  }
}

export const user = {
  namespaced: true,
  state: {
    userProfile: defaultUserProfile,
    status: '',
    error: null
  },
  getters: {
    userProfile: state => state.userProfile,
    activeColumnFilter: state => state.userProfile.params.activeColumnFilter,
    userName: state => state.userProfile.userName,
    profileStatus: state => state.status,
    errMessage: state => state.error.message,
    // getToken (state, getters, rootState, rootGetters) {
    //   return rootGetters['auth/token']
    // }
  },
  actions: {
    getProfile({ commit, dispatch }, token) {
      // console.log('we need profile')
      return UserService.getProfile(token).then(
        userProfile => {
          commit('getProfileSuccess', userProfile)

          if (typeof userProfile.params.activeColumnFilter === 'number') {
            dispatch("column/setColumnFilter", userProfile.params.columnFilters[userProfile.params.activeColumnFilter].columns, {root: true})
          } else {
            dispatch("column/setDefaultColumnFilter", null, {root: true})
          }

          return Promise.resolve(userProfile)
        },
        error => {
          commit('getProfileFailure', error)

          return Promise.reject(error)
        }
      )
    },
    async updateProfile({ commit, state }, formData) {
      return UserService.updateProfile(formData).then(
        msg => {
          const curProfile = JSON.parse(JSON.stringify(state.userProfile))
          curProfile.userName = formData.fio
          curProfile.userEmail = formData.email
          curProfile.userPhone = formData.phone

          commit('getProfileSuccess', curProfile)

          return Promise.resolve({ msg: msg, result: true })
        },
        error => {
          return Promise.reject({ msg: error, result: false })
        }
      )
    },
    async updatePassword({ commit, state }, formData) {
      return UserService.updatePassword(formData).then(
        msg => {
          const curProfile = JSON.parse(JSON.stringify(state.userProfile))
          commit('getProfileSuccess', curProfile)

          return Promise.resolve({ msg: msg, result: true })
        },
        error => {
          return Promise.reject({ msg: error, result: false })
        }
      )
    },
    deleteProfile({ commit }) {
      commit('deleteProfile')
      UserService.deleteProfile()
    },
    async addFilter({ commit, rootGetters, state }, newColumnFilter) {
      const curDate = new Date()
      const newFilter = {
        name: `Фильтр ${state.userProfile.params.columnFilters.length + 1}`,
        createdAt: curDate.getTime(),
        updatedAt: curDate.getTime(),
        columns: newColumnFilter
      }

      const curProfile = JSON.parse(JSON.stringify(state.userProfile))
      curProfile.params.columnFilters.push(newFilter)
      curProfile.params.activeColumnFilter = curProfile.params.columnFilters.length - 1

      try {
        await UserService.setParams(rootGetters['auth/token'], curProfile)
        commit('getProfileSuccess', curProfile)
      } catch (e) {
        //// console.log(e.message)
      }
    },
    async activateFilter({ commit, dispatch, rootGetters, state }, filterId) {
      const index = state.userProfile.params.columnFilters.findIndex(elem => elem.createdAt === filterId)

      //if (index !== state.userProfile.params.activeColumnFilter) {
      const curProfile = JSON.parse(JSON.stringify(state.userProfile))
      curProfile.params.activeColumnFilter = index

      try {
        dispatch('column/setColumnFilter', curProfile.params.columnFilters[index].columns, {root: true})
        await UserService.setParams(rootGetters['auth/token'], curProfile)
        commit('getProfileSuccess', curProfile)
      } catch (e) {
        //// console.log(e.message)
      }
      //}
    },
    async renameFilter({ commit, rootGetters, state }, { filterId, newTitle }) {
      if (newTitle.length > 0 && newTitle.length < 25) {
        const index = state.userProfile.params.columnFilters.findIndex(elem => elem.createdAt === filterId)
        const curProfile = JSON.parse(JSON.stringify(state.userProfile))

        curProfile.params.columnFilters[index].name = newTitle
        curProfile.params.columnFilters[index].updatedAt = new Date().getTime()

        try {
          await UserService.setParams(rootGetters['auth/token'], curProfile)
          commit('getProfileSuccess', curProfile)
        } catch (e) {
          //// console.log(e.message)
        }
      }
    },
    async deleteFilter({ commit, dispatch, rootGetters, state }, filterId) {
      const index = state.userProfile.params.columnFilters.findIndex(elem => elem.createdAt === filterId)
      const curProfile = JSON.parse(JSON.stringify(state.userProfile))
      curProfile.params.columnFilters.splice(index, 1)

      //// console.log(profile)
      //// console.log(curProfile)

      if (index < state.userProfile.params.activeColumnFilter) {
        curProfile.params.activeColumnFilter = state.userProfile.params.activeColumnFilter - 1
      } else if (index > state.userProfile.params.activeColumnFilter) {
        curProfile.params.activeColumnFilter = state.userProfile.params.activeColumnFilter
      } else {
        curProfile.params.activeColumnFilter = null
      }

      try {
        if (typeof curProfile.params.activeColumnFilter !== 'number') {
          dispatch('column/setDefaultColumnFilter', null, {root: true})
        }
        await UserService.setParams(rootGetters['auth/token'], curProfile)
        commit('getProfileSuccess', curProfile)
      } catch (e) {
        //// console.log(e.message)
      }
    },
  },
  mutations: {
    getProfileSuccess(state, userProfile) {
      state.status = 'success'
      state.userProfile = userProfile
      // console.log('updatedProfile:', state.userProfile)
      state.activeColumnFilter = userProfile.params.activeColumnFilter
      state.error = null
    },
    getProfileFailure(state, error) {
      state.status = 'error'
      state.userProfile = defaultUserProfile
      state.activeColumnFilter = null
      state.error = error
    },
    deleteProfile(state) {
      state.status = ''
      state.userProfile = defaultUserProfile
      state.activeColumnFilter = null
      state.error = null
    },
  }
}
