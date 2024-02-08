<script>
import { computed, reactive, ref, toRef, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { email, minLength, required } from '@vuelidate/validators'
import MainLayoutSubheader from '@/components/app/MainLayoutSubheader.vue'
import ManagerForm from '@/components/forms/ManagerForm.vue'
import { vMaska } from 'maska'
import ProfileTabs from '@/components/ProfileTabs.vue'

export default {
  name: 'UserProfileView',
  components: { ProfileTabs, ManagerForm, MainLayoutSubheader },
  setup: () => {
    const store = useStore()
    const editMode = ref(false)
    const errMsg = ref('')

    const profile = computed(() => {
      return store.state.user.userProfile
    })

    let profileForm = reactive({
      userName: profile.value.userName,
      userEmail: profile.value.userEmail,
      userPhone: profile.value.userPhone,
      userPassword: ''
    })

    watch(
      () => store.state.user.userProfile,
      (value) => {
        profileForm.userName = value.userName
        profileForm.userEmail = value.userEmail
        profileForm.userPhone = value.userPhone
        // console.log('profileForm:', profileForm)
      }
    )

    const rules = {
      userName: { required },
      userEmail: { email, required },
      userPhone: { required, minLength: minLength(17) },
      userPassword: { minLength: minLength(4) }
    }

    const v$ = useVuelidate(rules, {
      userName: toRef(profileForm, 'userName'),
      userEmail: toRef(profileForm, 'userEmail'),
      userPhone: toRef(profileForm, 'userPhone'),
      userPassword: toRef(profileForm, 'userPassword')
    })

    const submitProfileForm = async () => {
      if (editMode.value) {
        const newUserName = v$.value.userName.$model
        const newUserEmail = v$.value.userEmail.$model
        const newUserPhone = v$.value.userPhone.$model
        const newUserPassword = v$.value.userPassword.$model
        // console.log('v$.value:', v$.value)

        // Ни одно поле формы не изменилось
        if (
          newUserName === profile.value.userName &&
          newUserEmail === profile.value.userEmail &&
          newUserPhone === profile.value.userPhone &&
          !newUserPassword.length
        ) {
          editMode.value = !editMode.value
          return
        }

        // Поля профиля не изменились, введен новый пароль
        if (
          newUserName === profile.value.userName &&
          newUserEmail === profile.value.userEmail &&
          newUserPhone === profile.value.userPhone &&
          newUserPassword.length
        ) {
          v$.value.userPassword.$touch()

          if (v$.userPassword.$invalid) {
            //// console.log('Password error')
            return
          }

          const formData = {
            token: store.state.auth.token,
            password: newUserPassword
          }
          // console.log('send password')

          const { result, msg } = await store.dispatch('user/updatePassword', formData)

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

        if (!newUserPassword.length) {
          // Поля профиля изменились, пароль не введен
          v$.value.userName.$touch()
          v$.value.userEmail.$touch()
          v$.value.userPhone.$touch()

          if (
            v$.value.userName.$invalid ||
            v$.value.userEmail.$invalid ||
            v$.value.userPhone.$invalid
          ) {
            //// console.log('Fields error')
            return
          }

          const formData = {
            token: store.state.auth.token,
            fio: newUserName,
            email: newUserEmail,
            phone: newUserPhone
          }

          // console.log('send all without password')

          const { result, msg } = await store.dispatch('user/updateProfile', formData)

          if (!result) {
            errMsg.value = msg
            return
          } else {
            errMsg.value = ''
            editMode.value = false
            return
          }
        } else {
          // Изменились все поля формы
          v$.value.userName.$touch()
          v$.value.userEmail.$touch()
          v$.value.userPhone.$touch()
          v$.value.userPassword.$touch()

          if (
            v$.value.userName.$invalid ||
            v$.value.userEmail.$invalid ||
            v$.value.userPhone.$invalid ||
            v$.value.userPassword.$invalid
          ) {
            //// console.log('Fields or Password error')
            return
          }

          const formData = {
            token: store.state.auth.token,
            fio: newUserName,
            email: newUserEmail,
            phone: newUserPhone,
            password: newUserPassword
          }

          // console.log('send all')

          const profileResponse = await store.dispatch('user/updateProfile', formData)

          if (!profileResponse.result) {
            errMsg.value = profileResponse.msg
            return
          }

          const { result, msg } = await store.dispatch('user/updatePassword', formData)

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

    const setEditMode = (focusInput) => {
      editMode.value = true
      setTimeout(() => {
        document.getElementById(focusInput) && document.getElementById(focusInput).focus()
      }, 100)
    }

    return {
      editMode,
      errMsg,
      profile,
      store,
      submitProfileForm,
      setEditMode,
      v$,
      onMounted
    }
  },
  directives: {
    mask: vMaska
  }
}
</script>

<template>
  <MainLayoutSubheader>
    <p v-if="store.state.auth.isAdmin" class="subheader-slot">Администратор</p>
  </MainLayoutSubheader>
  <div class="user-profile-wrapper">
    <div>
      <ProfileTabs current-active="index" />
      <div class="user-profile">
        <form
          autocomplete="off"
          action="/"
          @submit.prevent="submitProfileForm"
          class="user-profile__col user-profile__col-l"
        >
          <div class="profile-subcols">
            <div class="profile-subcol">
              <div class="editable-input">
                <div class="edit-btn" v-if="!editMode" @click="setEditMode('fio')"></div>
                <div class="user-profile__field-name">Ваше ФИО</div>
                <input
                  name="fio"
                  id="fio"
                  autocomplete="off"
                  type="text"
                  :disabled="!editMode"
                  class="user-profile__edit-input"
                  v-model="v$.userName.$model"
                  @blur="v$.userName.$touch"
                />
                <div class="user-form__input-group-errors">
                  <div
                    class="user-form__input-group-error"
                    v-if="v$.userName.$dirty && v$.userName.required.$invalid"
                  >
                    Заполните поле
                  </div>
                </div>
              </div>
              <div class="editable-input">
                <div class="edit-btn" v-if="!editMode" @click="setEditMode('mail')"></div>
                <div class="user-profile__field-name">Почта</div>
                <input
                  name="mail"
                  id="mail"
                  autocomplete="off"
                  type="text"
                  :disabled="!editMode"
                  class="user-profile__edit-input"
                  v-model="v$.userEmail.$model"
                  @blur="v$.userEmail.$touch"
                />
                <div class="user-form__input-group-errors">
                  <div
                    class="user-form__input-group-error"
                    v-if="v$.userEmail.$dirty && v$.userEmail.required.$invalid"
                  >
                    Заполните поле
                  </div>
                </div>
                <div class="user-form__input-group-errors">
                  <div
                    class="user-form__input-group-error"
                    v-if="v$.userEmail.$dirty && v$.userEmail.email.$invalid"
                  >
                    Некорректный E-mail
                  </div>
                </div>
              </div>
            </div>
            <div class="profile-subcol">
              <div class="editable-input">
                <div class="edit-btn" v-if="!editMode" @click="setEditMode('pass')"></div>
                <div class="user-profile__field-name">Пароль</div>
                <input
                  name="pass"
                  id="pass"
                  autocomplete="new-password"
                  type="password"
                  :disabled="!editMode"
                  class="user-profile__edit-input"
                  v-model="v$.userPassword.$model"
                  @blur="v$.userPassword.$touch"
                  placeholder="•••••••"
                />
                <div class="user-form__input-group-errors">
                  <div
                    class="user-form__input-group-error"
                    v-if="v$.userPassword.$dirty && v$.userPassword.minLength.$invalid"
                  >
                    Пароль должен быть не менее 4 символов
                  </div>
                </div>
              </div>
              <div class="editable-input">
                <div class="edit-btn" v-if="!editMode" @click="setEditMode('phon')"></div>
                <div class="user-profile__field-name">Телефон</div>
                <input
                  name="phon"
                  id="phon"
                  autocomplete="off"
                  type="text"
                  :disabled="!editMode"
                  class="user-profile__edit-input"
                  v-model="v$.userPhone.$model"
                  @blur="v$.userPhone.$touch"
                  v-mask
                  data-maska="+7 (###) ###-##-##"
                />
                <div class="user-form__input-group-errors">
                  <div
                    class="user-form__input-group-error"
                    v-if="v$.userPhone.$dirty && v$.userPhone.required.$invalid"
                  >
                    Заполните поле
                  </div>
                </div>
                <div class="user-form__input-group-errors">
                  <div
                    class="user-form__input-group-error"
                    v-if="v$.userPhone.$dirty && v$.userPhone.minLength.$invalid"
                  >
                    Некорректный номер телефона
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="user-form__input-group-errors">
            <div class="user-form__input-group-error" v-if="errMsg.length">Некорректный E-mail</div>
          </div>

          <button type="submit" class="user-profile__btn">
            {{ editMode ? 'Сохранить' : 'Редактировать' }}
          </button>
        </form>
      </div>
    </div>
    <ManagerForm />
  </div>
</template>

<style scoped>
.subheader-slot {
  font-fize: 13px;
  font-weight: 700;
  color: #1dcf39;
}

.user-profile-wrapper {
  display: flex;
}
.user-profile,
.profile-subcols {
  display: flex;
}
.user-profile {
  padding: 30px 10px;
  width: 100%;
}
/* .user-profile__col {
  width: 50%;
} */
.user-profile__col-r {
  padding-top: 25px;
  padding-left: 60px;
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
  background: #078bbe;
  color: #fff;
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

.editable-input {
  position: relative;
}

.edit-btn {
  position: absolute;
  background-image: url('@/assets/img/pencil-dark.svg');
  background-size: 16px;
  background-position: center;
  cursor: pointer;
  width: 51px;
  height: 51px;
  top: 27px;
  right: 15px;
  background-repeat: no-repeat;
}

@media screen and (max-width: 870px) {
  .user-profile-wrapper {
    flex-direction: column;
  }
  .user-profile__col-r {
    padding-left: 0;
  }
}
</style>
