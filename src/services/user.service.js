import axios from 'axios'
// import authHeader from './auth-header';

const API_URL = 'https://lk.bescargo.ru//api/'

class UserService {
  getProfile(token) {
    return axios
      .get(API_URL + 'info/read.php', {
        params: {
          key: token
        }
      })
      .then(response => {
        const userProfile = {
          // managerId
          empId: parseInt(response.data.EMP_ID) || null,
          userName: response.data.FIO || '',
          userPhone: response.data.PHONE || '',
          userEmail: response.data.EMAIL || '',
          orgWeb: response.data.CLIENT_WEB || '',
          orgName: response.data.CLIENT_NAME || '',
          managerName: response.data.EMP_FIO || '',
          managerPhone: response.data.EMP_PHONE_MOBILE || '',
          managerEmail: response.data.EMP_EMAIL_WORK || '',
          chiefName: response.data.CH_EMP_FIO || '',
          chiefEmail: response.data.CH_EMP_EMAIL_WORK || '',
          officeEmail: response.data.OFFICE_EMAIL || '',
          officePhone: response.data.OFFICE_PHONE || '',
          officeWorkHours: response.data.OFFICE_HOURS || '',
          tlgBotLink: response.data.TLGBOT_LINK || '',
          //params: JSON.parse(response.data.PARAMS || ''),
        }

        let params = JSON.parse(response.data.PARAMS)
        if (params instanceof Object) {
          if (params.columnFilters === 'undefined' || !Array.isArray(params.columnFilters)) {
            params.columnFilters = []
          }
        } else {
          params = {
            columnFilters: []
          }
        }

        userProfile.params = params

        if (typeof userProfile.params.activeColumnFilter !== 'number'
          || params.columnFilters.length < userProfile.params.activeColumnFilter) {
          userProfile.params.activeColumnFilter = null
        }

        if (response.data.error === undefined) {
          localStorage.setItem('userProfile', JSON.stringify(userProfile))
        } else {
          throw new Error("Что-то пошло не так...")
        }

        return userProfile
      })
  }

  deleteProfile() {
    localStorage.removeItem('userProfile')
  }

  setParams(token, profile) {
    return axios
      .post(API_URL + `param/write.php`, {
        key: token,
        params: JSON.stringify(profile.params),
      })
      .then(response => {
        if (response.data?.result === 'ok') {
          localStorage.setItem('userProfile', JSON.stringify(profile))

          return "Фильтр успешно сохранен"
        }

        throw new Error('Ошибка при сохранении фильтра')
      })
  }

  updateProfile(formData) {
    return fetch(API_URL + 'info/write.php', {
      method: 'POST',
      body: JSON.stringify({
        key: formData.token,
        fio: formData.fio,
        phone: formData.phone,
        email: formData.email,
      })
    })
    .then(response => {
      console.log('response::', response)
      if (response.ok === true) {
        return 'Профиль успешно обновлен'
      }

      throw new Error('Ошибка при обновлении профиля')
    })
    return axios
      .post(API_URL + `info/write.php`, {
        key: formData.token,
        fio: formData.fio,
        phone: formData.phone,
        email: formData.email,
      })
      .then(response => {
        if (response.data?.result === 'ok') {
          return 'Профиль успешно обновлен'
        }

        throw new Error('Ошибка при обновлении профиля')
      })
  }

  updatePassword(formData) {
    return axios
      .post(API_URL + `password/write.php`, {
        key: formData.token,
        password: formData.password,
      })
      .then(response => {
        if (response.data?.result === 'ok') {
          return 'Пароль успешно обновлен'
        }

        throw new Error('Ошибка при обновлении пароля')
      })
  }

  // getUserBoard() {
  //   return axios.get(API_URL + 'user', { headers: authHeader() });
  // }
}

export default new UserService()
