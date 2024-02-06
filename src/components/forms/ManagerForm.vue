<template>
  <form @submit.prevent="submitMessageForm" class="user-profile__col user-profile__col-r">
    <div class="user-profile__form-title">
      Форма связи с персональным менеджером
    </div>
    <div class="manager-group">
      <div class="manager-photo" :style="`background-image: url('/img/managers_photo/${profile.empId}.jpg')`"></div>
      <div class="manager-name">
        Ваш менеджер <br>
        {{ profile.managerName }}
        <template v-if="profile.managerPhone">
          <br>
          <a style="color: #0088cc;" target="_blank" :href="`https://t.me/${profile.managerPhone}`">
            <font-awesome-icon :icon="['fab', 'telegram']"></font-awesome-icon>
          </a> &nbsp;
          <a style="color: #075E54;" target="_blank" :href="`https://wa.me/${profile.managerPhone}`">
            <font-awesome-icon :icon="['fab', 'whatsapp']"></font-awesome-icon>
          </a> &nbsp;
          <a style="text-decoration: none; color: inherit;" :href="`tel:${profile.managerPhone}`">
            {{ profile.managerPhone }}
          </a>
        </template>
      </div>
    </div>
    <label class="manager-field-label">
      Сообщение
    </label>
    <textarea
        class="manager-textarea"
        placeholder="Сообщение"
        v-model.trim="textMessage"
        @blur="v$.textMessage.$touch"
    ></textarea>
    <div class="user-form__input-group-errors">
      <div class="user-form__input-group-error" v-if="v$.textMessage.$dirty && v$.textMessage.required.$invalid">
        Напишите текст сообщения
      </div>
    </div>

    <div class="user-form__input-group-errors">
      <div class="user-form__input-group-error" v-if="!sendSuccess && errorMessage">
        {{ errorMessage }}
      </div>
      <div class="user-form__input-group-success" v-if="sendSuccess">
        Сообщение успешно отправлено
      </div>
    </div>

    <button type="submit" class="user-profile__btn">
      Отправить
    </button>
  </form>
</template>

<script>
import messageService from "@/services/message.service"
import { useVuelidate } from "@vuelidate/core"
import { required } from '@vuelidate/validators'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faWhatsapp, faTelegram } from "@fortawesome/free-brands-svg-icons";
library.add(faWhatsapp)
library.add(faTelegram)

export default {
  components: {
    FontAwesomeIcon,
  },
  setup: () => ({ v$: useVuelidate() }),
  data() {
    return {
      textMessage: '',
      sendSuccess: false,
      errorMessage: '',
    }
  },
  validations () {
    return {
      textMessage: {
        required
      }
    }
  },
  methods: {
    async submitMessageForm() {
      const result = await this.v$.$validate()
      if (!result) {
        this.sendSuccess = false
        this.errorMessage = ''

        return
      }

      const formData = {
        token: this.$store.state.auth.token,
        subject: 'Сообщение из формы обратной связи "Связаться с менеджером"',
        text: `<p><strong>Сообщение из формы обратной связи "Связаться с менеджером"</strong></p>
              <br>
              <p>Текст сообщения: ${this.textMessage}</p>`
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
          })
    }
  },
  computed: {
    profile() {
      return this.$store.state.user.userProfile
    },
  },
  mounted() {
    // this.$store.dispatch('user/getProfile', this.$store.state.auth.token)
  }
}
</script>
<style scoped>

.user-profile__form-title {
  font-weight: 700;
  font-size: 19px;
  line-height: 23px;
  margin-bottom: 13px;
}
.manager-group {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
}

.manager-photo {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background-size: cover;
  margin-right: 15px;
}

.manager-name {
  font-weight: 700;
  font-size: 16px;
  line-height: 22px;
}

.manager-field-label {
  display: block;
  font-weight: 700;
  font-size: 16px;
  line-height: 25px;
  margin-bottom: 5px;
}

.manager-textarea {
  display: block;
  width: 100%;
  max-width: 415px;
  border: 2px solid #ACACAC;
  height: 116px;
  border-radius: 10px;
  padding: 14px;
  font-family: inherit;
}

.user-profile__btn {
  display: inline-block;
  border: 0;
  background: #078BBE;
  color: #FFF;
  font-weight: 700;
  font-size: 15px;
  line-height: 18px;
  border-radius: 7px;
  padding: 17px 25px;
  margin-top: 25px;
  cursor: pointer;
}

.user-form__input-group-error {
  color: #ff4f4f;
}

.user-form__input-group-success {
  color: #28a745;
}
</style>
