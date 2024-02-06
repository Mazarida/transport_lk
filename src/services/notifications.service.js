import axios from 'axios'

const API_URL = 'https://lk.bescargo.ru//api/'

class NotificationsService {
  getNotifications(token) {
    return axios
      .get(API_URL + 'notification/read.php', {
        params: {
          key: token
        }
      })
      .then((response) => {
        let notifications = []

        if (response.data.error === undefined) {
          if (Array.isArray(response.data)) {
            response.data.forEach((notification) => {
              notifications.push({
                id: notification.NOTIFICATION_TYPE_ID,
                name: notification.NOTIFICATION_TYPE_NAME,
                toEmail: notification.TO_EMAIL === '1',
                toTelegram: notification.TO_TELEGRAM === '1'
              })
            })
          }
        } else {
          throw new Error('Что-то пошло не так...')
        }

        return notifications
      })
  }

  async updateNotification(token, notification) {
      return await fetch(API_URL + 'notification/write.php', {
        method: 'POST',
        body: JSON.stringify({
          key: token,
          notification_type_id: Number(notification.id),
          to_email: notification.toEmail === true ? 1 : 0,
          to_telegram: notification.toTelegram === true ? 1 : 0
        })
      })
      .then((response) => response)
      .catch((error) => error.message)
  }
}

export default new NotificationsService()
