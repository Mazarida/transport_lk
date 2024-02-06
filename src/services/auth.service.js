import axios from 'axios'

const API_URL = 'https://lk.bescargo.ru//api/'

class AuthService {
  async login(user) {
    return await axios
      .get(API_URL + 'login.php', {
        params: {
          login: user.login,
          password: user.password
        }
      })
      .then((response) => {
        if (response.data.key) {
          localStorage.setItem('token', response.data.key)
        } else {
          throw new Error('Неверный логин или пароль')
        }

        return response.data.key
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  logout() {
    //localStorage.removeItem('token')
    localStorage.clear()
  }

  async isAdmin(token) {
    console.log('start isAdmin:')
    return await axios.get(API_URL + 'info/read.php', {
      params: {
        key: token
      }
    })
    .then((response) => {
      console.log(response);
      if (response.data.PARENT_ID == null) {
        return true
      } else {
        return false
      }
    })
  }
}

export default new AuthService()
