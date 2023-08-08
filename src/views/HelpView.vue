<script>
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import MainLayoutSubheader from "@/components/app/MainLayoutSubheader.vue"
import messageService from "../services/message.service";

export default {
  name: "HelpView",
  components: { MainLayoutSubheader },
  setup: () => ({ v$: useVuelidate() }),
  data() {
    return {
      displayedCount: 7,
      isVisibleAll: false,
      userName: '',
      userEmail: '',
      textQuestion: '',
      sendSuccess: false,
      errorMessage: '',
    }
  },
  validations () {
    return {
      userName: { required },
      userEmail: { required, email },
      textQuestion: { required }
    }
  },
  computed: {
    faq() {
      // const arrFaq = [
      //   {
      //     id: 1,
      //     question: 'Вопрос 1',
      //     answer: 'Ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ'
      //   },
      //   {
      //     id: 2,
      //     question: 'Вопрос 2',
      //     answer: 'Ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ'
      //   },
      //   {
      //     id: 3,
      //     question: 'Вопрос 3',
      //     answer: 'Ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ'
      //   },
      //   {
      //     id: 4,
      //     question: 'Вопрос 4',
      //     answer: 'Ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ'
      //   },
      //   {
      //     id: 5,
      //     question: 'Вопрос 5',
      //     answer: 'Ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ'
      //   },
      //   {
      //     id: 6,
      //     question: 'Вопрос 6',
      //     answer: 'Ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ'
      //   },
      //   {
      //     id: 7,
      //     question: 'Вопрос 7',
      //     answer: 'Ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ'
      //   },
      //   {
      //     id: 8,
      //     question: 'Вопрос 8',
      //     answer: 'Ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ'
      //   },
      //   {
      //     id: 9,
      //     question: 'Вопрос 9',
      //     answer: 'Ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ'
      //   },
      //   {
      //     id: 10,
      //     question: 'Вопрос 10',
      //     answer: 'Ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ ответ'
      //   },
      // ]
      // return arrFaq

      return this.$store.state.faq.faq
    }
  },
  mounted() {
    this.$store.dispatch("faq/getFaq", this.$store.state.auth.token)
  },
  methods: {
    toggleQuestion(event) {
      event.target.closest(".help__item").classList.toggle('help__item-open')
    },
    async submitHandler() {
      const result = await this.v$.$validate()
      if (!result) {
        this.sendSuccess = false
        this.errorMessage = ''

        return
      }

      const formData = {
        token: this.$store.state.auth.token,
        subject: 'Сообщение из формы обратной связи "Не нашли ответ на свой вопрос"',
        text: `<p><strong>Сообщение из формы обратной связи "Не нашли ответ на свой вопрос"</strong></p>
<br>
<p>ФИО пользователя: ${this.userName}</p>
<p>E-mail пользователя: ${this.userEmail}</p>
<p>Текст сообщения: ${this.textQuestion}</p>`
      }

      await messageService.sendMessage(formData)
          .then(() => {
            this.sendSuccess = true
            this.errorMessage = ''
          })
          .catch((err) => {
            this.sendSuccess = false
            if (err.message !== undefined) {
              this.errorMessage = err.message
            } else {
              this.errorMessage = 'Ошибка при отправке сообщения'
            }
            console.log(err)
          })
    }
  }
}
</script>

<template>
  <MainLayoutSubheader />
  <div class="help">
    <div class="help__wrapper">
      <div class="help__col-text">
        <div class="help__col-header">
          Часто задаваемые вопросы
        </div>
        <div class="help__items">
          <div
              class="help__item"
              v-show="(item.id < displayedCount + 1) || (isVisibleAll && item.id > displayedCount)"
              v-for="item in faq"
              :key="item.id"
              @click="toggleQuestion($event)"
          >
            <div class="help__item-title">
              {{ item.question }}
            </div>
            <div class="help__item-text">
              {{ item.answer }}
            </div>
          </div>
        </div>

        <a
            href="#"
            class="help__read-more"
            v-if="faq.length > displayedCount"
            @click.prevent="isVisibleAll = !isVisibleAll"
        >
          {{ isVisibleAll ? 'Свернуть' : 'Смотреть ещё' }}
        </a>
      </div>
      <div class="help__col-form-wrap">
        <form method="post" @submit.prevent="submitHandler" class="help__col-form">
          <div class="help__col-header">
            Не нашли ответа на свой вопрос? Напишите нам:
          </div>
          <div class="help__contact-form">
            <div class="help__contact-form-cols">
              <div class="help__contact-form-col">
                <label for="fio_input" class="help__contact-form-label">
                  Ваше ФИО
                </label>
                <input
                    id="fio_input"
                    type="text"
                    placeholder="Андрей Андреевич Бобров"
                    class="help__contact-form-input"
                    v-model.trim="userName"
                    @blur="v$.userName.$touch"
                >
                <div class="help-form__input-group-errors">
                  <div class="help-form__input-group-error" v-if="v$.userName.$dirty && v$.userName.required.$invalid">
                    Поле "Ваше ФИО" не должно быть пустым
                  </div>
                </div>
              </div>
              <div class="help__contact-form-col">
                <label for="email_input" class="help__contact-form-label">
                  Почта
                </label>
                <input
                    id="email_input"
                    type="text"
                    placeholder="bobrov@gmail.com"
                    class="help__contact-form-input"
                    v-model.trim="userEmail"
                    @blur="v$.userEmail.$touch"
                >
                <div class="help-form__input-group-errors">
                  <div class="help-form__input-group-error" v-if="v$.userEmail.$dirty && v$.userEmail.required.$invalid">
                    Поле "Почта" не должно быть пустым
                  </div>
                  <div class="help-form__input-group-error" v-if="v$.userEmail.$dirty && v$.userEmail.email.$invalid">
                    Некорректный E-mail
                  </div>
                </div>
              </div>
            </div>
            <label for="message_input" class="help__contact-form-label">
              Сообщение
            </label>
            <textarea
                id="message_input"
                placeholder="Сообщение"
                class="help__contact-form-input"
                v-model.trim="textQuestion"
                @blur="v$.textQuestion.$touch"
            ></textarea>
            <div class="help-form__input-group-errors">
              <div class="help-form__input-group-error" v-if="v$.textQuestion.$dirty && v$.textQuestion.required.$invalid">
                Напишите текст сообщения
              </div>
            </div>

            <div class="help-form__input-group-errors">
              <div class="help-form__input-group-error" v-if="!sendSuccess && errorMessage">
                {{ errorMessage }}
              </div>
              <div class="help-form__input-group-success" v-if="sendSuccess">
                Сообщение успешно отправлено
              </div>
            </div>

            <button type="submit" class="help__contact-form-submit">
              Отправить
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.help {
  width: 100%;
}
.help__col-header {
  font-weight: 700;
  font-size: 18px;
  line-height: 22px;
  margin-bottom: 14px;
}

.help__wrapper {
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
}

.help__col-text {
  max-width: 50%;
  padding: 0 15px;
}

.help__col-form-wrap {
  padding: 0 40px;
  width: 50%;
}

form.help__col-form {
  max-width: 440px;
  display: block;
}

label.help__contact-form-label {
  display: block;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  margin-bottom: 8px;
}

.help__contact-form-cols {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.help__contact-form-input {
  display: block;
  width: 100%;
  border: 2px solid #ACACAC;
  padding: 17px;
  border-radius: 7px;
}

.help__contact-form-col {
  width: calc(50% - 5px);
}

.help__items {
  margin-top: 37px;
}

.help__item-title {
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  margin-bottom: 4px;
  position: relative;
}

.help__item-title:before {
  content: '+';
  display: block;
  position: absolute;
  left: -20px;
  font-size: 12px;
  color: #FFF;
  width: 13px;
  height: 13px;
  line-height: 14px;
  top: 2px;
  border-radius: 50%;
  text-align: center;
  background: #078BBE;
}

.help__item-open .help__item-title:before {
  background: #F7A600;
  content: '-';
}

.help__item {
  padding-left: 21px;
  margin-bottom: 25px;
  cursor: pointer;
}

.help__item-text {
  max-height: 0px;
  transition: .5s;
  overflow: hidden;
  line-height: 1.1;
}

.help__item-open .help__item-text {
  max-height: 400px;
}

textarea.help__contact-form-input {
  display: block;
  width: 100%;
  padding: 17px;
  font-family: inherit;
  height: 115px;
  margin-bottom: 21px;
}

.help__contact-form-submit {
  cursor: pointer;
  background: #078BBE;
  color: #FFF;
  border: 0;
  padding: 18px 33px;
  border-radius: 7px;
  font-weight: 500;
}

.help__read-more {
  font-size: 15px;
  line-height: 24px;
  text-decoration-line: underline;
  color: #078BBE;
}

.help-form__input-group-error {
  color: #ff4f4f;
}

.help-form__input-group-success {
  color: #28a745;
}
@media (max-width: 1170px) {
  .help__col-text {
    width: 100%;
    max-width: 100%;
    padding: 0 15px;
  }

  .help__col-form-wrap {
    width: 100%;
    max-width: none;
    padding: 0;
  }
}
</style>
