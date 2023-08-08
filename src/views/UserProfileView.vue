<script>
import { computed, reactive, ref, toRef } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { email, minLength, required } from '@vuelidate/validators'
import MainLayoutSubheader from "@/components/app/MainLayoutSubheader.vue"
import ManagerForm from "@/components/forms/ManagerForm.vue"
import { vMaska } from "maska"

export default {
  name: "UserProfileView",
  components: { ManagerForm, MainLayoutSubheader },
  setup: () => {
    const store = useStore()
    const editMode = ref(false)
    const errMsg = ref('')

    const profile = computed(() => {
      return store.state.user.userProfile
    })

    const profileForm = reactive({
      userName: profile.value.userName,
      userEmail: profile.value.userEmail,
      userPhone: profile.value.userPhone,
      userPassword: '',
    });

    const rules = {
      userName: { required },
      userEmail: { email, required },
      userPhone: { required, minLength: minLength(17) },
      userPassword: { minLength: minLength(4) },
    }

    const v$ = useVuelidate(rules, {
      userName: toRef(profileForm, 'userName'),
      userEmail: toRef(profileForm, 'userEmail'),
      userPhone: toRef(profileForm, 'userPhone'),
      userPassword: toRef(profileForm, 'userPassword'),
    })

    const submitProfileForm = async () => {
      if (editMode.value) {
        const newUserName = v$.value.userName.$model
        const newUserEmail = v$.value.userEmail.$model
        const newUserPhone = v$.value.userPhone.$model
        const newUserPassword = v$.value.userPassword.$model

        // Ни одно поле формы не изменилось
        if (newUserName === profile.value.userName && newUserEmail === profile.value.userEmail
            && newUserPhone === profile.value.userPhone && !newUserPassword.length) {

          editMode.value = !editMode.value
          return
        }

        // Поля профиля не изменились, введен новый пароль
        if (newUserName === profile.value.userName && newUserEmail === profile.value.userEmail
            && newUserPhone === profile.value.userPhone && newUserPassword.length) {
          v$.value.userPassword.$touch()

          if (v$.value.userPassword.$invalid) {
            //console.log('Password error')
            return
          }

          const formData = {
            token: store.state.auth.token,
            password: newUserPassword,
          }

          const { result, msg } = await store.dispatch("user/updatePassword", formData)

          if (!result) {
            errMsg.value = msg
            return
          } else {
            errMsg.value = ''
            v$.value.userPassword.$model = ''
            editMode.value = false
            return
          }
        }

        if (!newUserPassword.length) { // Поля профиля изменились, пароль не введен
          v$.value.userName.$touch()
          v$.value.userEmail.$touch()
          v$.value.userPhone.$touch()

          if (v$.value.userName.$invalid || v$.value.userEmail.$invalid || v$.value.userPhone.$invalid) {
            //console.log('Fields error')
            return
          }

          const formData = {
            token: store.state.auth.token,
            fio: newUserName,
            email: newUserEmail,
            phone: newUserPhone,
          }

          const { result, msg } = await store.dispatch("user/updateProfile", formData)

          if (!result) {
            errMsg.value = msg
            return
          } else {
            errMsg.value = ''
            editMode.value = false
            return
          }
        } else { // Изменились все поля формы
          v$.value.userName.$touch()
          v$.value.userEmail.$touch()
          v$.value.userPhone.$touch()
          v$.value.userPassword.$touch()

          if (v$.value.userName.$invalid || v$.value.userEmail.$invalid || v$.value.userPhone.$invalid
            || v$.value.userPassword.$invalid) {
            //console.log('Fields or Password error')
            return
          }

          const formData = {
            token: store.state.auth.token,
            fio: newUserName,
            email: newUserEmail,
            phone: newUserPhone,
            password: newUserPassword,
          }

          const profileResponse = await store.dispatch("user/updateProfile", formData)

          if (!profileResponse.result) {
            errMsg.value = profileResponse.msg
            return
          }

          const { result, msg } = await store.dispatch("user/updatePassword", formData)

          if (!result) {
            errMsg.value = msg
            return
          } else {
            errMsg.value = ''
            v$.value.userPassword.$model = ''
            editMode.value = false
            return
          }
        }
      }

      editMode.value = !editMode.value
    }

    return {
      editMode,
      errMsg,
      profile,
      store,
      submitProfileForm,
      v$
    }
  },
  directives: {
    mask: vMaska
  }
}
</script>

<template>
  <MainLayoutSubheader />
  <div class="user-profile">
    <form @submit.prevent="submitProfileForm" class="user-profile__col user-profile__col-l">
      <div v-if="editMode" class="profile-subcols">
        <div class="profile-subcol">
          <div class="user-profile__field-name">
            Ваше ФИО
          </div>
          <input
              type="text"
              class="user-profile__edit-input"
              v-model="v$.userName.$model"
              @blur="v$.userName.$touch"
          >
          <div class="user-form__input-group-errors">
            <div class="user-form__input-group-error" v-if="v$.userName.$dirty && v$.userName.required.$invalid">
              Заполните поле
            </div>
          </div>
          <div class="user-profile__field-name">
            Почта
          </div>
          <input
              type="text"
              class="user-profile__edit-input"
              v-model="v$.userEmail.$model"
              @blur="v$.userEmail.$touch"
          >
          <div class="user-form__input-group-errors">
            <div class="user-form__input-group-error" v-if="v$.userEmail.$dirty && v$.userEmail.required.$invalid">
              Заполните поле
            </div>
          </div>
          <div class="user-form__input-group-errors">
            <div class="user-form__input-group-error" v-if="v$.userEmail.$dirty && v$.userEmail.email.$invalid">
              Некорректный E-mail
            </div>
          </div>
        </div>
        <div class="profile-subcol">
          <div class="user-profile__field-name">
            Пароль
          </div>
          <input
              type="password"
              class="user-profile__edit-input"
              v-model="v$.userPassword.$model"
              @blur="v$.userPassword.$touch"
              placeholder="•••••••"
          >
          <div class="user-form__input-group-errors">
            <div class="user-form__input-group-error" v-if="v$.userPassword.$dirty && v$.userPassword.minLength.$invalid">
              Пароль должен быть не менее 4 символов
            </div>
          </div>
          <div class="user-profile__field-name">
            Телефон
          </div>
          <input
              type="text"
              class="user-profile__edit-input"
              v-model="v$.userPhone.$model"
              @blur="v$.userPhone.$touch"
              v-mask
              data-maska="+7 (###) ###-##-##"
          >
          <div class="user-form__input-group-errors">
            <div class="user-form__input-group-error" v-if="v$.userPhone.$dirty && v$.userPhone.required.$invalid">
              Заполните поле
            </div>
          </div>
          <div class="user-form__input-group-errors">
            <div class="user-form__input-group-error" v-if="v$.userPhone.$dirty && v$.userPhone.minLength.$invalid">
              Некорректный номер телефона
            </div>
          </div>
        </div>
      </div>

      <div v-if="!editMode" class="profile-subcols">
        <div class="profile-subcol">
          <div class="user-profile__field-name">
            Ваше ФИО
          </div>
          <div class="user-profile__field-value">
            {{ profile.userName }}
          </div>
          <div class="user-profile__field-name">
            Почта
          </div>
          <div class="user-profile__field-value">
            {{ profile.userEmail }}
          </div>
          <div class="user-profile__field-name">
            Город
          </div>
          <div class="user-profile__field-value">
            Город
          </div>
        </div>
        <div class="profile-subcol">
          <div class="user-profile__field-name">
            Пароль
          </div>
          <div class="user-profile__field-value">
            •••••••
          </div>
          <div class="user-profile__field-name">
            Телефон
          </div>
          <div class="user-profile__field-value">
            {{ profile.userPhone }}
          </div>
          <div class="user-profile__field-name">
            Организация
          </div>
          <div class="user-profile__field-value">
            {{ profile.orgName }}
          </div>
        </div>
      </div>

      <div class="user-form__input-group-errors">
        <div class="user-form__input-group-error" v-if="errMsg.length">
          Некорректный E-mail
        </div>
      </div>

      <button type="submit" class="user-profile__btn">
        {{ editMode ? 'Сохранить' : 'Редактировать' }}
      </button>
    </form>
    <manager-form></manager-form>
  </div>
</template>

<style scoped>
.user-profile, .profile-subcols {
  display: flex;
}
.user-profile {
  padding: 30px 10px;
  width: 100%;
}
.user-profile__col {
  width: 50%;
}
.user-profile__field-name {
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  margin-bottom: 14px;
}
.user-profile__field-value {
  font-size: 15px;
  line-height: 18px;
  margin-bottom: 31px;
}
.profile-subcol {
  width: 243px;
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
