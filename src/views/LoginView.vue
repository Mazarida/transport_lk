<script>
import {reactive, ref} from 'vue'
import { useRouter} from "vue-router"
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useStore } from 'vuex'
import ModalPopup from "@/components/ModalPopup.vue";

export default {
  name: "LoginView",
  components: {ModalPopup},
  methods: {
    showModalResetPass() {
      this.$refs.modalResetPass.modalOpen()
    },
  },
  setup() {
    const state = reactive({
      login: '',
      password: '',
    })
    const resetPassActive = ref(false)

    const rules = {
      login: { required },
      password: { required },
    }

    const v$ = useVuelidate(rules, state)

    const router = useRouter()
    const store = useStore()

    const submitHandler = async () => {
      const isCorrect = await v$.value.$validate()

      if (!isCorrect) {
        return
      }

      const formData = {
        login: state.login,
        password: state.password
      }

      await store.dispatch("auth/login", formData)
          .then(() => { router.push('/') })
          .catch((err) => { console.log(err) })
    }

    return { state, v$, submitHandler, store, resetPassActive }
  }
}
</script>

<template>
  <form class="auth__form" @submit.prevent="submitHandler">
    <div class="login__header">
      <img class="login__logo" src="@/assets/img/login__logo.png" alt="">
      <div class="login__workhours">
        <div class="icon-clock"></div>
        <div class="login__workhours-legend">
          Будние дни:
        </div>
        <div class="login__workhours-value">
          9<sup>00</sup> - 18<sup>30</sup>
        </div>
      </div>
      <div class="login__email">
        <div class="icon-envelope"></div>
        <a href="mailto:contact@bescargo.ru" class="login__email-value">
          contact@bescargo.ru
        </a>
      </div>
      <div class="login__phones">
        <div class="login__phones-icon icon-phone"></div>
        <div class="login__phones-city">
          Москва
        </div>
        <a href="tel:+74956401980" class="login__phones-number">
          +7 (495) 640-19-80
        </a>
        <div class="login__phones-city">
          Санкт-Петербруг
        </div>
        <a href="tel:+78123320560" class="login__phones-number">
          +7 (812) 332-05-60
        </a>
      </div>
    </div>
    <div class="auth__form-inner">
      <div class="auth__form-header">
        Вход в личный кабинет
      </div>

      <div class="auth-form__input-group">
        <label class="auth-form__input-group-label" for="login">Логин:</label>
        <input class="auth-form__input-group-input" id="login" type="text" v-model.trim="state.login" @blur="v$.login.$touch">
        <div class="auth-form__input-group-errors">
          <div class="auth-form__input-group-error" v-if="v$.login.$dirty && v$.login.required.$invalid">
            Поле "Логин" не должно быть пустым
          </div>
        </div>
      </div>

      <div class="auth-form__input-group">
        <label class="auth-form__input-group-label" for="password">Пароль:</label>
        <input class="auth-form__input-group-input" id="password" type="password" v-model.trim="state.password" @blur="v$.password.$touch">
        <div class="auth-form__input-group-errors">
          <div class="auth-form__input-group-error" v-if="v$.password.$dirty && v$.password.required.$invalid">
            Поле "Пароль" не должно быть пустым
          </div>
        </div>
      </div>
      <label class="remember-me">
        <input type="checkbox" class="remember-me__control"> Запомнить меня
      </label>
      <div class="auth-form__input-group-errors">
        <div class="auth-form__input-group-error" v-if="store.getters['auth/authStatus'] === 'error'">
          {{ store.getters["auth/errMessage"] }}
        </div>
      </div>

      <div class="auth-form__btn-group">
        <button class="auth-form__submit-btn btn-fw" type="submit">Войти</button>
        <!--button @click="showModalResetPass" type="button" class="forgot-pass">
          Забыли пароль?
        </button-->
      </div>
      <modal-popup ref="modalResetPass" class="modal__reset-pass" >
        <div class="modal__header">
          Восстановление пароля
        </div>
        <div class="auth-form__input-group">
          <label class="auth-form__input-group-label" for="reset_email">Адрес эл. почты</label>
          <input class="auth-form__input-group-input" placeholder="bes@cargo.ru" id="reset_email" type="text">
          <button class="auth-form__submit-btn btn-resetpass" type="submit">Восстановить пароль</button>
        </div>
      </modal-popup>
    </div>
  </form>
</template>

<style scoped>
.auth__form {
  max-width: 1185px;
  margin: 0 auto;
  padding: 0 15px;
}
.auth-form__input-group-label {
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  color: #FFFFFF;
  display: block;
}
.auth-form__input-group-input {
  margin-top: 8px;
  display: block;
  width: 100%;
  height: 53px;
  border: 1px solid #ACACAC;
  border-radius: 5px;
  margin-bottom: 7px;
  line-height: 53px;
  padding: 18px;
}
.auth-form__input-group {
  margin-bottom: 15px;
  width: 230px;
}
.auth-form__submit-btn {
  background: #078BBE;
  border: 0;
  --webkit-appearance: none;
  font-weight: 700;
  font-size: 15px;
  line-height: 18px;
  text-align: center;
  color: #FFFFFF;
  display: block;
  padding: 17px;
  border-radius: 7px;
  margin-top: 28px;
  width: 230px;
  cursor: pointer;
}
.auth-form__submit-btn:hover {
  background: #0681b0;
}
.auth-form__input-group-error {
  color: #ff4f4f;
}
.login__header {
  display: flex;
  justify-content: space-between;
  color: #FFF;
  align-items: center;
}

img.login__logo {
  width: 125px;
}

.login__workhours {
  display: flex;
}

.icon-clock {
  width: 18px;
  height: 18px;
  margin-right: 18px;
}

.login__workhours-value {
  font-weight: bold;
}

sup {
  font-size: .5em;
}

.login__email {
  display: flex;
}

.icon-envelope {
  width: 24px;
  height: 24px;
  margin-right: 18px;
}

a.login__email-value {
  text-decoration: none;
  color: inherit;
}

.login__phones {
  display: flex;
}

.icon-phone {
  width: 18px;
  height: 18px;
  /* margin-right: 18px; */
}

.login__phones-city {
  font-weight: 600;
  margin-right: 8px;
  margin-left: 18px;
}

a.login__phones-number {
  text-decoration: none;
  color: inherit;
}

.auth__form-inner {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 460px;
  width: 260px;
  margin: 0 auto;
  color: #FFF;
}

.auth__form-header {
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  margin-bottom: 36px;
}

.auth-form__input-group {
  width: 100% !important;
}

.auth-form__input-group {
  margin-bottom: 10px !important;
}

.remember-me {
  display: flex;
  font-size: 13px;
  line-height: 16px;
  align-items: center;
}

.remember-me__control {height: 18px;width: 18px;margin-right: 10px;}

.auth-form__btn-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgot-pass {
  background: transparent;
  border: 0;
  color: inherit;
  text-decoration: underline;
  white-space: nowrap;
  font-size: 13px;
  line-height: 16px;
  margin-top: 28px;
  cursor: pointer;
}

.auth-form__submit-btn {
  width: 135px !important;
}

.login__workhours-legend {
  margin-right: 10px;
}

.auth-form__input-group-error {
}

.auth-form__input-group-errors {
  position: absolute;
  transform: translate(268px, -56px);
  background: #FFF;
  padding: 12px;
  border-radius: 5px;
}

.remember-me + .auth-form__input-group-errors {
  transform: none;
  position: static;
  margin-top: 10px;
  margin-bottom: -10px;
}

.auth-form__input-group-errors:before {
  content: '';
  display: block;
  width: 10px;
  height: 10px;
  background: inherit;
  position: absolute;
  left: -5px;
  transform: rotate(45deg);
  top: 15px;
}

.auth-form__input-group-errors:empty {
  display: none;
}

.remember-me + .auth-form__input-group-errors:before {
  display: none;
}

@media (max-width: 1170px) {
  .login__header {
    flex-wrap: wrap;
    justify-content: center !important;
  }

  .login__workhours {
    width: 100%;
    padding: 10px 0;
  }

  .login__email {
    width: 100%;
    padding-bottom: 10px;
  }

  .login__phones {
    flex-wrap: wrap;
  }

  .login__phones-city {
    margin-left: 36px !important;
  }

  .login__phones-icon.icon-phone {
    margin-right: -18px;
  }

  .icon-envelope {
    margin-right: 10px !important;
  }

  .auth__form-inner {
    width: 100% !important;
  }
}
</style>
