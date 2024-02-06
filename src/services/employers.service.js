import axios from 'axios'
// import authHeader from './auth-header';

const API_URL = 'https://lk.bescargo.ru//api/'

class EmployersService {
  getEmployers(token) {
    return axios
      .get(API_URL + 'user/read.php', {
        params: {
          key: token
        }
      })
      .then((response) => {
        console.log('employers:', response.data)
        let employers = []
        if (response.data.error === undefined) {
          if (Array.isArray(response.data)) {
            response.data.forEach((employer) => {
              employers.push({
                id: Number(employer.ID),
                login: employer.LOGIN,
                password: employer.PASSWORD,
                fio: employer.FIO,
                email: employer.EMAIL,
                emailEx: employer.EMAIL_EX,
                phone: employer.PHONE,
                phoneEx: employer.PHONE_EX,
                organisation: employer.ORGANISATION,
                city: employer.CITY,
                disabled: employer.DISABLED
              })
            })
          }
        } else {
          throw new Error('Что-то пошло не так...')
        }

        return employers
      })
  }

  async addEmployer(token, formData) {
    return await fetch(API_URL + 'user/write.php', {
      method: 'POST',
      body: JSON.stringify({
        key: token,
        id: null,
        login: formData.email,
        password: formData.password,
        fio: formData.fio,
        email: formData.email,
        email_ex: formData.emailEx,
        phone: formData.phone,
        phone_ex: formData.phoneEx,
        organisation: formData.organisation,
        city: formData.city,
      })
    })
    .then((response) => {
      let res = {}

      if (response) {
        res = response
      } else {
        throw new Error('Что-то пошло не так...')
      }

      return res
    })
  }

  async changeBlocking(token, employer) {
    const key = token
    const id = employer.id
    let disabled = employer.disabled

    if (disabled === '1') {
      disabled = '0'
    } else {
      disabled = '1'
    }

    return await fetch(API_URL + 'user/write.php', {
      method: 'POST',
      body: JSON.stringify({
        key,
        id,
        disabled
      })
    })
    .then((response) => {
      let res = {}

      if (response) {
        res = response
      } else {
        throw new Error('Что-то пошло не так...')
      }

      return res
    })
  }
}

export default new EmployersService()
