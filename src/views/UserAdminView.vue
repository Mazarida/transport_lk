<script>
import { computed, reactive, ref, toRef, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { email, minLength, required } from '@vuelidate/validators'
import MainLayoutSubheader from '@/components/app/MainLayoutSubheader.vue'
import ManagerForm from '@/components/forms/ManagerForm.vue'
import { vMaska } from 'maska'
import ProfileTabs from '@/components/ProfileTabs.vue'

//import language from '@/i18n/datatables.ru.json'

export default {
  name: 'UserProfileView',
  components: { ProfileTabs, MainLayoutSubheader },
  setup() {
    const store = useStore()
    const editMode = ref(false)
    const isCorrect = ref(true)

    const columns = ref([
      {
        data: 'userName',
        title: 'ФИО'
      },
      {
        data: 'userEmail',
        title: 'Почта(логин)'
      },
      {
        data: 'userPassword',
        title: 'Пароль'
      },
      {
        data: 'userActive',
        title: 'Состояние'
      },
      {
        data: 'buttonblock',
        title: ''
      }
    ])

    const users = computed(() => store.state.employers.employers)

    const profileForm = reactive({
      userName: '',
      userEmail: '',
      userPassword: '',
      userAddmail: '',
      userPhone: '',
      userAddphone: '',
      userCity: '',
      userOrg: ''
    })

    const rules = {
      userName: { required },
      userEmail: { email, required },
      userAddmail: { email },
      userPhone: { minLength: minLength(17) },
      userAddphone: { minLength: minLength(17) },
      userCity: {},
      userOrg: {},
      userPassword: { minLength: minLength(4), required }
    }

    const v$ = useVuelidate(rules, {
      userName: toRef(profileForm, 'userName'),
      userEmail: toRef(profileForm, 'userEmail'),
      userAddmail: toRef(profileForm, 'userAddmail'),
      userPhone: toRef(profileForm, 'userPhone'),
      userAddphone: toRef(profileForm, 'userAddphone'),
      userCity: toRef(profileForm, 'userCity'),
      userOrg: toRef(profileForm, 'userOrg'),
      userPassword: toRef(profileForm, 'userPassword')
    })

    const submitProfileForm = async () => {
      if (editMode.value) {
        isCorrect.value = await v$.value.$validate()
        if (!isCorrect.value) {
          return
        }

        isCorrect.value = true
        const password = v$.value.userPassword.$model
        const fio = v$.value.userName.$model
        const email = v$.value.userEmail.$model
        const emailEx = v$.value.userAddmail.$model
        const phone = v$.value.userPhone.$model
        const phoneEx = v$.value.userAddphone.$model
        const organisation = v$.value.userOrg.$model
        const city = v$.value.userCity.$model

        const formData = {
          password,
          fio,
          email,
          emailEx,
          phone,
          phoneEx,
          organisation,
          city
        }
        store.dispatch('employers/addEmployer', { token: store.state.auth.token, formData })
      }

      editMode.value = !editMode.value
    }

    const changeBlocking = (id) => {
      store.dispatch('employers/changeBlocking', { token: store.state.auth.token, id })
    }

    const setEditMode = (focusInput) => {
      editMode.value = true
      setTimeout(() => {
        document.getElementById(focusInput) && document.getElementById(focusInput).focus()
      }, 100)
    }

    onMounted(() => {
      store.dispatch('employers/getEmployers', store.state.auth.token)
    })

    return {
      users,
      columns,
      editMode,
      isCorrect,
      store,
      submitProfileForm,
      changeBlocking,
      setEditMode,
      v$
    }
  },
  directives: {
    mask: vMaska
  }
}
</script>

<template>
  <div v-if="store.state.auth.isAdmin">
    <MainLayoutSubheader>
      <p class="subheader-slot">Администратор</p>
    </MainLayoutSubheader>
    <ProfileTabs current-active="admin" />
    <div class="user-profile">
      <form
        autocomplete="off"
        @submit.prevent="submitProfileForm"
        class="user-profile__col user-profile__col-l"
      >
        <div class="profile-subcols">
          <div class="profile-subcol">
            <div class="editable-input">
              <div class="edit-btn" v-if="!editMode" @click="setEditMode('fio')"></div>
              <div class="user-profile__field-name">ФИО сотрудника*</div>
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
              <div class="user-profile__field-name">Почта*</div>
              <input
                name="mail"
                id="mail"
                autocomplete="off"
                type="email"
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
            <div class="editable-input">
              <div class="edit-btn" v-if="!editMode" @click="setEditMode('addMail')"></div>
              <div class="user-profile__field-name">Почта дополнительная</div>
              <input
                name="addMail"
                id="addMail"
                autocomplete="off"
                type="email"
                :disabled="!editMode"
                class="user-profile__edit-input"
                v-model="v$.userAddmail.$model"
                @blur="v$.userAddmail.$touch"
              />
              <div
                class="user-form__input-group-error"
                v-if="v$.userAddmail.$dirty && v$.userAddmail.email.$invalid"
              >
                Некорректный E-mail
              </div>
            </div>
            <div class="editable-input">
              <div class="edit-btn" v-if="!editMode" @click="setEditMode('pass')"></div>
              <div class="user-profile__field-name">Назначьте пароль*</div>
              <input
                name="pass"
                id="pass"
                autocomplete="off"
                type="password"
                :disabled="!editMode"
                class="user-profile__edit-input"
                v-model="v$.userPassword.$model"
                @blur="v$.userPassword.$touch"
                placeholder="•••••••"
                readonly
                onfocus="this.removeAttribute('readonly')"
              />
              <div class="user-form__input-group-errors">
                <div
                  class="user-form__input-group-error"
                  v-if="v$.userPassword.$dirty && v$.userPassword.required.$invalid"
                >
                  Заполните поле
                </div>
              </div>
              <div class="user-form__input-group-errors">
                <div
                  class="user-form__input-group-error"
                  v-if="v$.userPassword.$dirty && v$.userPassword.minLength.$invalid"
                >
                  Пароль должен быть не менее 4 символов
                </div>
              </div>
            </div>
          </div>
          <div class="profile-subcol">
            <div class="editable-input">
              <div class="edit-btn" v-if="!editMode" @click="setEditMode('city')"></div>
              <div class="user-profile__field-name">Город</div>
              <input
                name="city"
                id="city"
                autocomplete="off"
                type="text"
                :disabled="!editMode"
                class="user-profile__edit-input"
                v-model="v$.userCity.$model"
                @blur="v$.userCity.$touch"
              />
              <div class="user-form__input-group-errors"></div>
            </div>
            <div class="editable-input">
              <div class="edit-btn" v-if="!editMode" @click="setEditMode('phone')"></div>
              <div class="user-profile__field-name">Телефон</div>
              <input
                name="phone"
                id="phone"
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
                  v-if="v$.userPhone.$dirty && v$.userPhone.minLength.$invalid"
                >
                  Некорректный номер телефона
                </div>
              </div>
            </div>
            <div class="editable-input">
              <div class="edit-btn" v-if="!editMode" @click="setEditMode('addPhone')"></div>
              <div class="user-profile__field-name">Телефон дополнительный</div>
              <input
                name="addPhone"
                id="addPhone"
                autocomplete="off"
                type="text"
                :disabled="!editMode"
                class="user-profile__edit-input"
                v-model="v$.userAddphone.$model"
                @blur="v$.userAddphone.$touch"
                v-mask
                data-maska="+7 (###) ###-##-##"
              />
              <div class="user-form__input-group-errors">
                <div
                  class="user-form__input-group-error"
                  v-if="v$.userAddphone.$dirty && v$.userAddphone.minLength.$invalid"
                >
                  Некорректный номер телефона
                </div>
              </div>
            </div>
            <div class="editable-input">
              <div class="edit-btn" v-if="!editMode" @click="setEditMode('organization')"></div>
              <div class="user-profile__field-name">Организация</div>
              <input
                name="organization"
                id="organization"
                autocomplete="off"
                type="text"
                :disabled="!editMode"
                class="user-profile__edit-input"
                v-model="v$.userOrg.$model"
                @blur="v$.userOrg.$touch"
              />
            </div>
          </div>
        </div>

        <button type="submit" class="user-profile__btn">
          {{ editMode ? 'Сохранить' : 'Редактировать' }}
        </button>
      </form>
    </div>
    <div v-if="users.length" class="users-table-block">
      <div class="users-table-header">Список сотрудников</div>
      <table class="users-table">
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.data">{{ column.title }}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td :class="{ datadisable: user.disable }">{{ user.fio ? user.fio : 'нет данных' }}</td>
            <td :class="[{ datadisable: !user.disable }, 'font400']">
              {{ user.email ? user.email : user.login ? user.login : 'нет данных' }}
            </td>
            <td :class="[{ datadisable: !user.disable }, 'font400']">
              {{ user.password ? user.password : 'нет данных' }}
            </td>
            <td>{{ user.disabled === '0' ? 'Активен' : 'Заблокирован' }}</td>
            <td>
              <button @click="changeBlocking(user.id)" class="user-buttonblock">
                {{ user.disabled === '0' ? 'Заблокировать' : 'Активировать' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.subheader-slot {
  font-fize: 13px;
  font-weight: 700;
  color: #1dcf39;
}
.users-table-block {
  padding-top: 30px;
}
.users-table-header {
  font-family: Proxima Nova;
  font-size: 19px;
  font-weight: 700;
  line-height: 23px;
  letter-spacing: 0em;
  text-align: left;
}
.users-table {
  border-collapse: collapse;
  text-align: left;
}
.users-table tbody td {
  max-width: 1000px;
  font-family: Proxima Nova;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0em;
  text-align: left;
  color: #061022;
}
.users-table tbody td.datadisable {
  color: #acacac;
}
.users-table th {
  font-family: Proxima Nova;
  font-size: 13px;
  font-weight: 400;
  color: #acacac;
  padding-right: 80px;
}
.users-table thead tr {
  height: 40px;
}
.users-table tr {
  height: 85px;
}
.users-table tbody tr {
  border-bottom: 1px solid #acacac;
}
.users-table tbody td {
  padding-right: 10px;
}
.users-table tbody td.font400 {
  font-family: Proxima Nova;
  font-size: 13px;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0em;
  text-align: left;
}

.user-buttonblock {
  display: inline-block;
  border: 0;
  background: #078bbe;
  color: #fff;
  font-weight: 700;
  font-size: 15px;
  line-height: 18px;
  border-radius: 7px;
  width: 165px;
  height: 45px;
  cursor: pointer;
}

.user-profile,
.profile-subcols {
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
</style>
