import axios from 'axios'
// import authHeader from './auth-header';

const API_URL = 'https://lk.bescargo.ru//api/'

class FaqService {
  getFaq(token) {
    return axios
      .get(API_URL + 'faq/read.php', {
        params: {
          key: token
        }
      })
      .then(response => {
        let faq = []
        let index = 0

        if (response.data.error === undefined) {
          if (Array.isArray(response.data)) {
            response.data.forEach(question => {
              faq.push(
                {
                  id: index++,
                  question: question.QUESTION || '',
                  answer: question.ANSWER || '',
                }
              )
            })
          }
        } else {
          throw new Error("Что-то пошло не так...")
        }

        return faq
      })
  }

  deleteFaq() {
    localStorage.removeItem('faq')
  }
}

export default new FaqService()