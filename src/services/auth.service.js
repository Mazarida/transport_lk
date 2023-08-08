import axios from 'axios'

const API_URL = 'https://lk.bescargo.ru//api/'

class AuthService {
  login(user) {
    return axios
      .get(API_URL + 'login.php', {
        params: {
          login: user.login,
          password: user.password
        }
      })
      .then(response => {
        if (response.data.key) {
          localStorage.setItem('token', response.data.key)
        }
        else {
          throw new Error("Неверный логин или пароль")
        }

        return response.data.key
      })
      .catch(error => {
        return Promise.reject(error)
      })
  }

  logout() {
    //localStorage.removeItem('token')
    localStorage.clear()
  }
}

export default new AuthService()