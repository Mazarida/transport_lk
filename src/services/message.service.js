import axios from 'axios'
// import authHeader from './auth-header';

const API_URL = 'https://lk.bescargo.ru//api/'

class MessageService {
  sendMessage(formData) {
    return axios
      .post(API_URL + `mail/write.php`, {
        key: formData.token,
        subject: formData.subject,
        text: formData.text,
      })
      .then(response => {
        if (response.data?.result === 'ok') {
          return "Сообщение успешно отправлено"
        }

        throw new Error('Ошибка при отправке сообщения')
      })
  }
}

export default new MessageService()