<script>
import { computed, reactive, ref, toRef, onMounted } from 'vue'
import MainLayoutSubheader from '@/components/app/MainLayoutSubheader.vue'
import ManagerForm from '@/components/forms/ManagerForm.vue'
import ProfileTabs from '@/components/ProfileTabs.vue'
import { useStore } from 'vuex'

export default {
  name: 'UserProfileView',
  components: { ProfileTabs, ManagerForm, MainLayoutSubheader },
  setup: () => {
    const store = useStore()
    const columns = reactive([
      {
        data: 'noticeslist',
        title: 'Список'
      },
      {
        data: 'mail',
        title: 'Почта'
      },
      {
        data: 'telegram',
        title: 'Телеграм'
      }
    ])

    const switchCheckbox = (id, value) => {
      store.dispatch('notifications/switchCheckbox', { id, value })
    }

    const updateNotifications = () => {
      store.dispatch('notifications/updateNotifications', store.state.auth.token)
    }

    const notifications = computed(() => store.state.notifications.notifications)

    onMounted(() => store.dispatch('notifications/getNotifications', store.state.auth.token))

    return {
      store,
      columns,
      switchCheckbox,
      updateNotifications,
      notifications
    }
  }
}
</script>

<template>
  <MainLayoutSubheader>
    <p v-if="store.state.auth.isAdmin" class="subheader-slot">Администратор</p>
  </MainLayoutSubheader>
  <div class="notificationsplace">
    <div>
      <ProfileTabs current-active="notifications" />
      <div class="user-profile__notifications">
        <div class="user-notices-header">Мои уведомления</div>
        <table class="user-notices-table">
          <thead>
            <tr>
              <th
                :class="{ noticetitle: index === 0, noticeset: index !== 0 }"
                v-for="(column, index) in columns"
                :key="column.data + index"
              >
                {{ column.title }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="notice in notifications" :key="notice.id">
              <td>{{ notice.name }}</td>
              <td class="noticeset">
                <input
                  type="checkbox"
                  class="custom-checkbox"
                  :id="`notice-email-${notice.id}`"
                  @input="switchCheckbox(notice.id, 'email')"
                  v-model="notice.toEmail"
                />
                <label :for="`notice-email-${notice.id}`"></label>
              </td>
              <td class="noticeset">
                <input
                  type="checkbox"
                  class="custom-checkbox"
                  :id="`notice-telegram-${notice.id}`"
                  @input="switchCheckbox(notice.id, 'telegram')"
                  v-model="notice.toTelegram"
                />
                <label :for="`notice-telegram-${notice.id}`"></label>
              </td>
            </tr>
          </tbody>
        </table>

        <button @click="updateNotifications" class="user-noties-save-settings__btn">
          Сохранить
        </button>
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

.custom-checkbox {
  position: absolute;
  z-index: -1;
  opacity: 0;
}

.custom-checkbox + label {
  display: inline-flex;
  align-items: center;
  user-select: none;
}

.custom-checkbox + label::before {
  content: '';
  display: inline-block;
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  flex-grow: 0;
  border: 2px solid #aeaeae;
  border-radius: 4px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100% 100%;
}

.custom-checkbox:checked + label::before {
  border-color: #078bbe;
  background-color: #078bbe;
  background-image: url('@/assets/img/checkbox-success.svg');
}

.notificationsplace {
  display: flex;
}

.notificationsplace .user-profile__col {
  padding-top: 25px;
  padding-left: 60px;
}
.user-profile__notifications {
  padding-top: 19px;
}
.user-notices-table {
  width: 590px;
  border-collapse: collapse;
}
.user-notices-header {
  font-family: Proxima Nova;
  font-size: 19px;
  font-weight: 700;
  line-height: 23px;
  letter-spacing: 0em;
  text-align: left;
}
.user-notices-table thead tr th {
  font-family: Proxima Nova;
  font-size: 13px;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0em;
  color: #acacac;
  padding-top: 16px;
}
.user-notices-table tbody tr {
  border-bottom: 1px solid #acacac;
}
.user-notices-table tbody tr td {
  padding-top: 23px;
  padding-bottom: 23px;
  font-family: Proxima Nova;
  font-size: 14px;
  font-weight: 400;
  color: #464646;
}

.user-noties-save-settings__btn {
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
.noticetitle {
  text-align: left;
  width: 70%;
}
.noticeset {
  text-align: center;
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

@media screen and (max-width: 870px) {
  .notificationsplace {
    flex-direction: column;
  }

  .notificationsplace .user-profile__col {
    padding-left: 0;
  }

  .user-notices-table {
    width: 100%;
  }
}
</style>