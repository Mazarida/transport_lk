<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useStore } from "vuex"
import { useRoute } from 'vue-router'
// datatables
import DataTable from 'datatables.net-vue3'
import DataTablesLib from 'datatables.net'
import 'datatables.net-select'
import language from '@/i18n/datatables.ru.json'
// export to xlsx
import { utils, writeFileXLSX } from 'xlsx'
// export to pdf
import JsPDF from 'jspdf'
import JsPDFAutotable from 'jspdf-autotable'
import { callAddFont } from "@/i18n/ProximaNova-Regular-normal"
// other
import OrderService from '../services/order.service'
import MainLayoutSubheader from "@/components/app/MainLayoutSubheader.vue"
import SimpleTooltip from "@/components/SimpleTooltip.vue"
import ModalPopup from "@/components/ModalPopup.vue";
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faDollyBox,
  faDollyFlatbed,
  faCartFlatbed,
  faHouseCircleCheck,
  faPlane,
  faShip,
  faTrain,
  faTruck,
  faWarehouse
} from "@fortawesome/free-solid-svg-icons";
import ManagerForm from "@/components/forms/ManagerForm.vue";
library.add(faDollyBox)
library.add(faDollyFlatbed)
library.add(faCartFlatbed)
library.add(faHouseCircleCheck)
library.add(faPlane)
library.add(faWarehouse)
library.add(faShip)
library.add(faTrain)
library.add(faTruck)
const store = useStore()
const route = useRoute()

DataTable.use(DataTablesLib);

let dt
let rowData = {
  orderNumber: '',
  orderNumberClient: '',
  serviceType: '',
  senderName: '',
  cargoName: '',
  transportNumber: '',
  transportType: '',
  datePlaningFinish: '',
  countryName: '',
  cityName: '',
  deliveryConditions: '',
  weightGross: '',
  dateReadyClient: '',
  dateReadyVendor: '',
  datePlaningLoad: '',
  dateActualLoad: '',
  datePlaningOut: '',
  dateActualOut: '',
  datePlaningOutShipFeeder: '',
  dateActualOutShipFeeder: '',
  datePlaningOutShipOcean: '',
  dateActualOutShipOcean: '',
  datePlaningBorderTransport: '',
  dateActualBorderTransport: '',
  dateActualRWStationOut: '',
  datePlaningRWStationIn: '',
  dateActualRWStationIn: '',
  rwStationDest: '',
  dateActualFinish: '',
  deliveryAddress: '',
  dateDTFilling: '',
  dateDTRelease: '',
  customPlace: '',
  isInspected: '',
  isIDK: '',
  isWeighing: '',
  legalEntityName: '',
  importExport: '',
  status: '',
  deliveryType: '',
  imageIndex: 0,
}
const data = ref([])
const downloadActive = ref(false)
const fullFiltersDropdownActive = ref(false)
const table = ref()
const filtersActive = ref(false)
const searchFormActive = ref(false)
const modalOrder = ref(null)
const modalManager = ref<InstanceType<typeof ModalPopup> | null>(null)
const checkboxArray = ref([])
const dropdownActive = ref(false)
const searchCheckboxesText = ref()
const editableTitle = ref(null)

const roadMap = ref([])
const pointsMap = ref([])
const pointColor = {
  fail: '#B2B2B2',
  passed: '#078BBE',
  current: '#F7A600'
}
const roadMapIcons = ['warehouse', 'dolly-box', 'truck', 'house-circle-check']

const userColumnFilters = computed(() => store.getters['user/userProfile'].params.columnFilters)
const currentFilter = computed(() => store.getters['column/columnFilter'])

watch(currentFilter, () => {
  currentFilter.value.forEach(col => {
    dt?.column(col.id).visible(col.isVisible)
  })
})

watch(fullFiltersDropdownActive, () => {
  if (fullFiltersDropdownActive.value) {
    checkboxArray.value = currentFilter.value.reduce((acc, col) => (acc[col.data] = col.isVisible, acc), {})
  }
})

const date2Number = (date) => {
  const dateParsed = date.match(/(\d{1,2}).(\d{1,2}).(\d{2,4})/)
  return new Date(dateParsed[3], dateParsed[2], dateParsed[1]).getTime()
}

const columns = currentFilter.value.map((col) => {
  const colData = {data: col.data, title: col.title, visible: (col.required !== true) ? col.isVisible : true}

  if (col.sort !== undefined) {
    if (col.sort[0] === 'date') { // для сортировки колонки по дате
      // @ts-ignore
      colData.render = (data, type) => {
        if (type === 'sort') {
          try {
            // const dateParsed = data.match(/(\d{1,2}).(\d{1,2}).(\d{2,4})/)
            // return new Date(dateParsed[3], dateParsed[2], dateParsed[1]).getTime()
            return date2Number(data)
          } catch (error) {
            //console.log('Render error:', error.message)
          }
        }
        return data
      }
    } // else if (col.sort[0] === 'number') {}
  }

  return colData
})

const getOrders = () => {
  OrderService.getOrders(store.state.auth.token, route.params.archive === 'archive' ? 1 : 0)
      .then((orders) => {
            data.value = orders
            dt = table.value.dt

            dt.on('select', function (e, dat, type, indexes) {
              if (type === 'row') {
                rowData = JSON.parse(JSON.stringify(dt.rows(indexes[0]).data()[0]))
                // console.log(rowData)
                pointsMap.value = createRoadMap(rowData)
                modalOrder.value.modalOpen()
              }
            })

          },
          (error) => {
            //console.log(error.message)
          }
      )

  OrderService.getRoadPoints(store.state.auth.token)
      .then((points) => {
            roadMap.value = points
          },
          (error) => {
            //console.log(error.message)
          }
      )

}

onMounted(function () {
  getOrders()
  searchCheckboxesText.value = ''
})

watch(() => route.params.archive, getOrders)

const onSearchKeyUp = (e) => {
  dt.search(e.target.value).draw()
}

const onSubmitCheckboxes = () => {
  //console.log(checkboxArray.value)
  store.dispatch("column/changeColumnsVisible", { checkboxesArray: checkboxArray.value, saveFilter: true })
  fullFiltersDropdownActive.value = false
}

const onActivateFilter = async (filter) => {
  await store.dispatch('user/activateFilter', filter.createdAt)
}

const onDeleteFilter = async (filter) => {
  await store.dispatch('user/deleteFilter', filter.createdAt)
}

const onAddCheckboxes = () => {
  store.dispatch("column/changeColumnsVisible", { checkboxesArray: checkboxArray.value })
  dropdownActive.value = false
}

const deleteCheckboxItem = (colName) => {
  checkboxArray.value[colName] = false
  store.dispatch("column/changeColumnsVisible", { checkboxesArray: checkboxArray.value })
}

const onSearchCheckboxes = (e) => {
  //console.log(e.target.value)
  searchCheckboxesText.value = e.target.value
}

const onRenameFilter = async (filter, event) => {
  const newName = event.target.value
  if (newName.length > 0 && newName.length < 25) {
    await store.dispatch('user/renameFilter', { filterId: filter.createdAt, newTitle: newName })
    editableTitle.value = null
  }
}

const exportPDFData = () => {
  try {
    (function (jsPDFAPI) {
      jsPDFAPI.events.push(['addFonts', callAddFont])
    })(JsPDF.API)

    const doc = new JsPDF({
      orientation: "landscape",
    })
    //console.log(doc.getFontList())

    // doc.setFont('ProximaNova-Regular', 'normal')
    // doc.setFontSize(8)

    const head = []
    const body = []
    dt.columns().every((idx) => {
      const col = dt.column(idx)

      if (col.visible() === true) {
        head.push(columns[idx]['title'])
        for (let i = 0; i < col.data().length; i++) {
          if (body[i] === undefined) {
            body.push([])
          }
          body[i].push((col.data())[i])
        }
      }
    })

    // console.log(head)
    // console.log(body)

    JsPDFAutotable(doc, {
      head: [head],
      body: body,
      // head: [['Имя', 'Email', 'Страна']],
      // body: [
      //   ['Дэвид', 'david@example.com', 'Швеция'],
      //   ['Кастилья', 'castille@example.com', 'Испания'],
      //   // ...
      // ],
      styles: {
        font: 'ProximaNova-Regular',
        fontStyle: 'normal',
        fontSize: 8,
      }
    })

    doc.save('bescargo_export_data.pdf')
  } catch (error) {
    // console.log(error.message)
  }
}

const exportXLSXData = () => {
  const tableData = []

  try {
    dt.columns().every((idx) => {
      const col = dt.column(idx)
      if (col.visible() === true) {
        for (let i = 0; i < col.data().length; i++) {
          if (tableData[i] === undefined) {
            tableData.push({})
          }
          //tableData[i][`${col.dataSrc()}`] = (col.data())[i]
          tableData[i][columns[idx]['title']] = (col.data())[i]
        }
      }
    })

    const ws = utils.json_to_sheet(tableData)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, "Лист1")
    writeFileXLSX(wb, "bescargo_export_data.xlsx")
  } catch (error) {
    //console.log(error.message)
  }
}

const createRoadMap = (order) => {
  const currentRoadMap = roadMap.value.filter(point => point.documentId === order.deliveryId)

  return currentRoadMap.map((item, index) => {
    let nextStatus = ''
    if (index + 1 < currentRoadMap.length) {
      nextStatus = 'next-status-' + (currentRoadMap[index + 1]['pointCompleted'] === '0' ? 'fail' : 'passed')
    }

    if (item.pointCompleted === '1'
        && ((index + 1 < currentRoadMap.length && currentRoadMap[index + 1]['pointCompleted'] === '0') || index === currentRoadMap.length - 1)) {
      return { ...item, statusColor: 'current', nextStatus }
    }
    return { ...item, statusColor: item.pointCompleted === '0' ? 'fail' : 'passed', nextStatus }
  })

  // let roadMap = []
  // // массив полей с датами, по которым строится дорожная карта
  // const dateProps = [
  //   { plan: 'datePlaningLoad', fact: 'dateActualLoad', title: 'Загрузка у поставщика', priority: 0 },
  //   { plan: 'datePlaningOut', fact: 'dateActualOut', title: 'Выход из страны отправления', priority: 1 },
  //   { plan: 'datePlaningOutShipFeeder', fact: 'dateActualOutShipFeeder', title: 'Выход фидерного судна из порта', priority: 10 },
  //   { plan: 'datePlaningOutShipOcean', fact: 'dateActualOutShipOcean', title: 'Выход океанского судна из порта', priority: 10 },
  //   { plan: 'datePlaningBorderTransport', fact: 'dateActualBorderTransport', title: 'Прибытие на пограничный переход', priority: 10 },
  //   { plan: 'dateActualRWStationOut', fact: 'dateActualRWStationOut', title: 'Выход с ЖД станции отправления в РФ', priority: 10 }, // !!! нет поля планируемой даты
  //   { plan: 'datePlaningRWStationIn', fact: 'dateActualRWStationIn', title: 'Прибытие на ЖД станцию назначения в РФ', priority: 11 },
  //   { plan: 'dateDTFilling', fact: 'dateDTFilling', title: 'Подача ДТ', priority: 20 },
  //   { plan: 'dateDTRelease', fact: 'dateDTRelease', title: 'Выпуск ДТ', priority: 21 },
  //   { plan: 'datePlaningFinish', fact: 'dateActualFinish', title: 'Доставка на склад получателя', priority: 99 },
  // ]
  //
  // dateProps.forEach(item => {
  //   const stringValue = order[item.fact] !== '' ? order[item.fact] : order[item.plan]
  //   const statusColor = order[item.fact] !== '' ? 'passed' : 'fail'
  //
  //   if (stringValue) {
  //     roadMap.push({
  //       ...item,
  //       stringValue,
  //       numberValue: date2Number(stringValue),
  //       statusColor
  //     })
  //   }
  // })
  //
  // // сортировка по дате, если даты совпадают, то по приоритету
  // roadMap.sort((a, b) => {
  //   if (a.numberValue > b.numberValue) {
  //     return 1
  //   }
  //   if (a.numberValue < b.numberValue) {
  //     return -1
  //   }
  //   if (a.numberValue === b.numberValue) {
  //     return (a.priority > b.priority) ? 1 : ((b.priority > a.priority) ? -1 : 0)
  //   }
  // })
  //
  // // вернуть дорожную карту, установив текущий пункт дорожной карты
  // return roadMap.map((item, index) => {
  //   let nextStatus = ''
  //   if (index + 1 < roadMap.length) {
  //     nextStatus = 'next-status-' + roadMap[index + 1]['statusColor']
  //   }
  //
  //   if (item.statusColor === 'passed'
  //       && ((index + 1 < roadMap.length && roadMap[index + 1]['statusColor'] === 'fail') || index === roadMap.length - 1)) {
  //     return { ...item, statusColor: 'current', nextStatus }
  //   }
  //   return { ...item, nextStatus }
  // })
}
</script>

<template>
  <MainLayoutSubheader>
    <div class="orders-actions">
      <div @click="() => filtersActive = !filtersActive"
           class="orders-actions__filters">
        Мои фильтры
        <img src="@/assets/img/angle-down.svg" alt="">
      </div>
      <simple-tooltip v-click-outside="() => filtersActive = false" class="filters-tooltip centrd" v-if="filtersActive">
        <div
            class="filters-form"
            v-for="filter in userColumnFilters"
            :key="filter.createdAt"
        >
          <div class="filters__active-item">
            <input
                type="text"
                :value="filter.name"
                v-if="editableTitle === filter.createdAt"
                @keyup.enter="onRenameFilter(filter, $event)"
                @keyup.esc="() => {editableTitle = null}"
            >&nbsp;
            <a
                href="#"
                class="filters__label"
                v-if="editableTitle !== filter.createdAt"
                @click.prevent="onActivateFilter(filter)"
            >{{ filter.name }}</a> <div class="filters__date">{{ new Date(filter.updatedAt).toLocaleString('ru-RU') }}</div>
            <img class="filter-action" @click.prevent="onDeleteFilter(filter)" src="@/assets/img/filters-trash.svg" alt="">
            <img class="filter-action" src="@/assets/img/filters-edit.svg" alt="" @click="editableTitle = editableTitle !== filter.createdAt ? filter.createdAt : null">
          </div>
        </div>

        <div class="filters-form" v-if="!userColumnFilters.length">
          <div class="filters__active-item">
            <div class="filters__date">
              У вас нет сохраненных фильтров
            </div>
          </div>
        </div>
      </simple-tooltip>
      <div title="Поиск" @click="() => searchFormActive = !searchFormActive" class="orders-actions__search">
        <img src="@/assets/img/icon-search.svg" alt="">
      </div>
      <simple-tooltip v-click-outside="() => searchFormActive = false" v-if="searchFormActive" class="search-form">
        <input placeholder="Поиск" type="text" class="global_filter" @keyup="onSearchKeyUp">
      </simple-tooltip>
      <div title="Выгрузить в PDF/Excel" @click="() => downloadActive = !downloadActive" class="orders-actions__download">
        <img src="@/assets/img/icon-download.svg" alt="">
      </div>
      <simple-tooltip v-click-outside="() => downloadActive = false" class="download-dropdown" v-if="downloadActive">
        <a class="download-btn" href="#" @click.prevent="exportPDFData">PDF (.pdf)</a>
        <a class="download-btn" href="#" @click.prevent="exportXLSXData">Excel (.xlsx)</a>
      </simple-tooltip>
    </div>
  </MainLayoutSubheader>
  <modal-popup ref="modalOrder" modal-body-class="modal__order">
    <div class="order__number">
      <div class="order__number-label">
        Номер заказа
      </div>
      <div class="order__number-value">
        {{ rowData?.orderNumber }}
      </div>
    </div>
    <div class="order-name">
      {{ rowData?.cargoName?.toLowerCase() }}
    </div>
    <div class="order-name">
      {{ rowData?.transportNumber }}
    </div>
    <div class="order-metadata">
      <div class="order-metadata__row">
        <div class="order-meta">
          {{ rowData?.senderName }}
        </div>
        <div class="order-meta">
          <i class="icon-status" :style="{backgroundColor: route.params.archive === 'archive' ? '#078BBE' : '#F7A600'}"></i>
          {{ rowData?.status }}
        </div>
      </div>
      <div class="hr" v-if="pointsMap.length"></div>
      <div class="status-steps" v-if="pointsMap.length">
        <div
            class="status-step"
            :class="rowData?.imageIndex === index ? 'step-current' : ''"
            v-for="(icon, index) in roadMapIcons"
            :key="icon"
        >
          <div class="icon-wrapper">
            <font-awesome-icon :icon="icon" />
          </div>
          <div class="step-label"></div>
          <div class="step-value"></div>
        </div>
      </div>

      <div class="order-history" v-if="pointsMap.length">
        <div
            :key="point.plan"
            v-for="point in pointsMap"
            class="order-history__item"
            :class="point.nextStatus"
        >
          <i class="icon-status" :style="{backgroundColor: pointColor[point.statusColor]}"></i>
          <div class="order-history__label">
            <div class="order-history__label-date">
              {{ point.pointDate }}
            </div>
            <div class="order-history__label-text">
              {{ point.pointTitle }}
            </div>
          </div>
        </div>
      </div>

      <div class="hr"></div>
      <div class="contact-manger" @click="modalManager.modalOpen">
        <img class="contact-manager__icon" src="@/assets/img/icon__chat.svg" alt="">
        Связаться с менеджером
      </div>
    </div>
  </modal-popup>
  <modal-popup ref="modalManager" modal-body-class="modal__manager">
    <manager-form></manager-form>
  </modal-popup>

  <div title="Настроить колонки таблицы" class="filters-table-wrapper">
    <img @click="() => fullFiltersDropdownActive = !fullFiltersDropdownActive" src="@/assets/img/icon-table.svg" class="filters-table__btn" alt="">
    <simple-tooltip v-click-outside="() => fullFiltersDropdownActive = false" class="full-filters-dropdown" v-if="fullFiltersDropdownActive">
      <form class="filters-form alt" @submit.prevent="onSubmitCheckboxes">

        <div class="filters__active-item alt">
          <div class="filters__label alt">
            Добавить колонку
          </div>
        </div>

        <div class="filters__active-item alt-subhead">
          <div class="filters__label alt-subhead">
            Введите значение
          </div>
        </div>
        <div class="filters__input-bubbles">
          <div class="filters__bubble-item" v-for="col in currentFilter.filter(elem => !elem.required && elem.isVisible)" :key="col.id">
            {{ col.title }} <div class="filters__bubble-item-del" @click="deleteCheckboxItem(col.data)"></div>
          </div>
          <div class="dropdown-trigger" @click="dropdownActive = true"></div>
        </div>
        <div :class="{filters__driopdown: true, active: dropdownActive}">
          <input
              type="text"
              class="filters__dropdown-input"
              v-model="searchCheckboxesText"
              @keyup="onSearchCheckboxes"
          >
          <div class="filters__dropdown-list">
            <div class="filters__form alt">
              <div
                  class="filters__form-item"
                  v-for="col in currentFilter.filter(elem => {
                    if (!searchCheckboxesText.length) {
                      return !elem.required
                    }

                    return !elem.required && elem.title.toLowerCase().includes(searchCheckboxesText.toLowerCase())
                   })"
                  :key="col.id"
              >
                <input
                    class="form-item__checkbox"
                    type="checkbox"
                    v-model="checkboxArray[col.data]"
                    :id="col.data"
                    :checked="col.isVisible"
                />
                <label class="form-item__label" :for="col.data">{{ col.title }}</label>
              </div>
            </div>
            <button class="filters__form-submit" type="button" @click="onAddCheckboxes">Добавить</button>
          </div>
        </div>
        <button class="filters__form-submit" type="submit">Сохранить</button>
      </form>
    </simple-tooltip>
  </div>
  <main class="table-wrapper">
    <DataTable
        class="display"
        :columns="columns"
        :data="data"
        :options="{
          dom: 'rtp',
          select: {
            style: 'single'
          },
          order: [[7, 'desc']],
          language: language,
        }"
        ref="table"
    />
  </main>
</template>

<style>
@import 'datatables.net-dt';

:root {
  --dt-row-selected: 23, 54, 90;
  --dt-row-selected-text: 255, 255, 255;
  --dt-row-selected-link: 9, 10, 11;
}

.dataTables_wrapper .dataTables_paginate {
  float: left;
}
.orders-actions {
  display: flex;
  align-items: center;
  position: relative;
}
.orders-actions__filters {
  font-size: 16px;
  line-height: 19px;
  cursor: pointer;
  width: 143px;
}
.orders-actions__download {
  margin-left: 6px;
  padding-right: 2px;
  padding-left: 2px;
  display: flex;
  cursor: pointer;
}
.orders-actions__search {
  margin-left: 6px;
  padding-right: 2px;
  padding-left: 2px;
  display: flex;
  cursor: pointer;
}

.download-dropdown {
  top: 30px;
  right: -5px;
}

.download-btn {
  margin-top: 11px;
  font-weight: 700;
  font-size: 14px;
  line-height: 17px;
  color: #061022;
  text-decoration: none;
  display: block;
}

.download-btn:hover {
  color: #078BBE;
}
.download-btn:first-child {
  margin-top: 0;
}

input.global_filter {
  border: 0;
  border-bottom: 1px solid rgba(36, 35, 35, 0.15);
  width: 330px;
}

.search-form {
  right: 24px;
  top: 30px;
}

.filters-form {
  font-size: 14px;
  line-height: 17px;
  color: #061022;
}

.filters-tooltip {
  top: 30px;
  right: 0px;
}

.filters__active-item {
  display: flex;
  white-space: nowrap;
  font-size: 14px;
  line-height: 17px;
  /* identical to box height */
  color: #061022;
  align-items: center;
  margin-top: 12px;
}

.filters__label {
  font-weight: 700;
  margin-right: 16px;
  text-decoration: none;
  color: #061022;
}

.filters__date {
  margin-right: 10px;
}

img.filter-action {
  cursor: pointer;
  margin-left: 5px;
}

.filters__active-item:first-child {
  margin-top: 0px;
}

.filters-table-wrapper {
  text-align: right;
  position: relative;
}

img.filters-table__btn {
  margin: 10px 18px;
  cursor: pointer;
}

.full-filters-dropdown {
  top: 38px;
  text-align: left;
}

.filters-table-wrapper {
  text-align: right;
  position: relative;
}

img.filters-table__btn {
  margin: 10px 18px;
}

.full-filters-dropdown {
  top: 38px;
  text-align: left;
}

.filters__form-submit {
  background: #078BBE;
  border: 0;
  border-radius: 5px;
  padding: 9px 22px;
  color: #FFF;
  font-weight: 700;
  font-size: 15px;
  line-height: 18px;
  margin-top: 10px;
}

.filters__form-item {
  margin: 6px 0;
}

.form-item__checkbox {
  margin-right: 5px;
}

.status-step .icon-wrapper {
  color: #098bbf;
}

.step-current .icon-wrapper {
  color: #f7a502;
}

.step-current ~ .status-step .icon-wrapper {
  color: #b2b2b2;
}

.status-step {
  /*padding: 0 5px;*/
  padding: 0;
}

.status-step:first-child {
  padding-left: 0;
}

.status-step:last-child {
  padding-right: 0;
}

.status-step:before {
  content: '';
  display: block;
  height: 2px;
  /*width: 200%;*/
  width: 500%;
  background: #098bbf;
  position: absolute;
  top: 21px;
  /*right: 40px;*/
  right: 0;
  z-index: 2;
}

.status-step {
  position: relative;
}

.icon-wrapper {
  position: relative;
  z-index: 20;
  padding: 10px;
}

.status-step:first-child:before {
  background: #FFF;
  z-index: 120;
  right: 100%;
}

.step-current ~ .status-step:before {
  background: #b2b2b2;
  z-index: 1;
}

.status-step:first-child .icon-wrapper {
  padding-left: 0;
}

.status-step:last-child .icon-wrapper {
  padding-right: 0;
}

.step-label, .step-value {
  text-align: center;
}

.status-step:last-child .step-label, .status-step:last-child .step-value {
  text-align: right;
}

.status-step:first-child .step-label, .status-step:first-child .step-value {
  text-align: left;
}

.order-history__item:before {
  content: '';
  display: block;
  position: absolute;
  width: 2px;
  background: #098bbf;
  height: 21px;
  bottom: -26px;
  left: 4px;
}

.order-history__item.next-status-fail:before {
  background: rgba(36, 35, 35, 0.35);
}

.order-history__item {
  position: relative;
}

.order-history__item:last-child:before {
  display: none;
}

.modal__manager {
  width: 540px;
}
</style>
