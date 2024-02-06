<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useStore } from "vuex"
import { useRoute } from 'vue-router'
// datatables
import DataTable from 'datatables.net-vue3'
import DataTablesLib from 'datatables.net'
import 'datatables.net-select'
import 'datatables.net-fixedheader'
import 'datatables.net-colreorder'
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
  individualSettings: '',
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
const rowFiltersActive = ref(false)
const uniqueVals = ref({})
const filtersSetup = ref({})
const searchCheckboxesText = ref()
const editableTitle = ref(null)
const pageLength = ref(25)

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
const dataFiltered = computed(() => data.value.filter(el => {
  return !el.isHiddenByFilter || Object.keys(el.isHiddenByFilter).length === 0
}))

watch(currentFilter, () => {
  currentFilter.value.forEach(col => {
    dt?.column(col.id).visible(col.isVisible)
  })
})

watch(pageLength, () => {
  dt?.page.len(Number(pageLength.value)).draw()
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
            uniqueVals.value = {}
            filtersSetup.value = {}
            data.value.map(el => {
              for (const idx of Object.keys(el)) {
                if (!filtersSetup.value[idx]) {
                  filtersSetup.value[idx] = {}
                }
                if (!filtersSetup.value[idx][el[idx]]) {
                  filtersSetup.value[idx][el[idx]] = true
                }
                if (!uniqueVals.value[idx]) {
                  uniqueVals.value[idx] = []
                }
                if (uniqueVals.value[idx].indexOf(el[idx]) === -1) {
                  uniqueVals.value[idx].push(el[idx])
                  uniqueVals.value[idx].sort()
                }
              }
              return el
            })
            dt = table.value.dt

            dt.on('select', function (e, dat, type, indexes) {
              if (type === 'row') {
                rowData = JSON.parse(JSON.stringify(dt.rows(indexes[0]).data()[0]))
                // console.log(rowData)
                pointsMap.value = createRoadMap(rowData)
                modalOrder.value.modalOpen()
              }
            })
            dt.columns().colReorder.order(currentFilter.value.map(e => e.order))
          },
          (/*error*/) => {
            //console.log(error.message)
          }
      )

  OrderService.getRoadPoints(store.state.auth.token)
      .then((points) => {
            roadMap.value = points
          },
          (/*error*/) => {
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

const logReorder = () => {
  // itemsArray.sort((a, b) => sortingArr.indexOf(a) - sortingArr.indexOf(b))
  // onSubmitCheckboxes()
  store.commit('column/setColumnFilterOrder', dt.columns().colReorder.order())
  // console.log(dt.columns().colReorder.order())
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

const checkAll = (event) => {
  const newVal = event.target.checked
  console.log(newVal)
  currentFilter.value.filter(elem => {
      return !elem.required
  }).forEach(col => {
    checkboxArray.value[col.data] = newVal
  })
}

// const tblInitComplete = (ths) => {
//   ths.api()
//       .columns()
//       .every(function (this: any) {
//         let column = this;
//         let title = column.header().textContent;
//
//         // Create input element
//         let input = document.createElement('input');
//         input.setAttribute('placeholder', title)
//         input.setAttribute('class', 'foot-filter-input')
//         // input.placeholder = title;
//         column.footer().replaceChildren(input);
//
//         // Event listener for user input
//         input.addEventListener('keyup', () => {
//           if (column.search() !== input.value) {
//             this.search(input.value).draw();
//           }
//         });
//       });
// }

const rowFiltersCheckAll = ($event) => {
  const tgt = $event.target
  const checked = tgt.checked
  tgt.parentNode.parentNode.querySelectorAll('.group-filtr__item .group-filtr__checks').forEach(el => {
    el.checked = checked
    el.dispatchEvent(new Event('change'))
  })
}

const setHiddenByFilter = (colId, colValue, event) => {
  data.value = data.value.map(el => {
    if (el[colId] === colValue) {
      if (event.target.checked === false) {
        if (!el.isHiddenByFilter) {
          el.isHiddenByFilter = []
        }
        if (el.isHiddenByFilter.indexOf(colId) === -1) {
          el.isHiddenByFilter.push(colId)
        }
      } else if (el.isHiddenByFilter.indexOf(colId) !== -1) {
        el.isHiddenByFilter.splice(el.isHiddenByFilter.indexOf(colId), 1);
      }
    }
    return el
  })
}

const isAnyChecked = (colId) => {
  return Object.keys(filtersSetup.value[colId]).filter(key => filtersSetup.value[colId][key] === true).length !== 0
}
</script>

<template>
  <MainLayoutSubheader>
    <div class="orders-actions">
      <div @click="() => filtersActive = !filtersActive"
           class="orders-actions__filters">
        Мои настройки
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
              У вас нет сохраненных настроек
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
  <div class="table-actions">
    <div class="per-page-selector">
      Показывать на странице по:
      <select v-model="pageLength">
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
        <option value="250">250</option>
        <option value="500">500</option>
      </select>
      <div @click="rowFiltersActive = true" class="funnel-trigger">
        Фильтр <img src="@/assets/img/funnel-dark.svg" alt="">
      </div>
      <simple-tooltip v-click-outside="() => rowFiltersActive = false" class="funnel-dropdown" v-if="rowFiltersActive">
        <div class="filterz">
          <div class="filterz__group-filtr" v-for="col in currentFilter.filter(elem => !elem.required && elem.isVisible)" :key="col.id">
            <label class="group-filtr__header">
              <input :checked="isAnyChecked(col.data)" @change="rowFiltersCheckAll($event)" class="group-filtr__checks" type="checkbox">
              <span class="row-filters-title__text">
                {{ col.title }}
              </span>
            </label>
            <label v-bind:key="row" v-for="row in uniqueVals[col.data]" class="group-filtr__item">
              <input @change="setHiddenByFilter(col.data, row, $event)" v-model="filtersSetup[col.data][row]" class="group-filtr__checks" type="checkbox">
              <span class="row-filters-check__text">
                {{ row ? row : '(пусто)' }}
              </span>
            </label>
          </div>
        </div>
      </simple-tooltip>
    </div>
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
            <div
                class="filters__form-item"
            >
              <input
                  class="form-item__checkbox"
                  type="checkbox"
                  @change="checkAll($event)"
                  id="checkAll"
              />
              <label class="form-item__label" for="checkAll">Выбрать все</label>
            </div>
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
  </div>
  <main class="table-wrapper">
    <DataTable
        class="display"
        :columns="columns"
        :data="dataFiltered"
        @column-reorder="logReorder"
        :options="{
          dom: 'rtp',
          nTfoot: $refs.tfoot,
          select: {
            style: 'single'
          },
          order: [[7, 'desc']],
          pageLength: pageLength,
          language: language,
          fixedHeader: true,
          scrollX: true,
          scrollY: 'calc(100vh - 360px)',
          colReorder: true,
          // initComplete: function() {
          //   tblInitComplete(this)
          // }
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

.filters__form-submit-sm {
  font-weight: 400;
  font-size: 14px;
  padding: 8px 20px;
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

.table-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

label.group-filtr__item,
label.group-filtr__header {
  display: flex;
  align-items: flex-start;
}

label.group-filtr__header {
  font-weight: bold;
}

label.group-filtr__item {
  padding-left: 1em;
}

.filterz {
  display: flex;
  overflow-x: auto;
}

.filterz__group-filtr {
  border: 1px solid #DDD;
  margin-right: -1px;
  position: relative;
  max-height: 250px;
  min-width: 250px;
  overflow-y: auto;
}

label.group-filtr__header {
  position: sticky;
  top: 0;
  background: #FFF;
  padding: 10px;
  border-bottom: 1px solid #DDD;
}

label.group-filtr__item {
  margin: 0 10px;
  margin-top: 5px;
}

.funnel-trigger {
  display: inline-block;
  margin-left: 20px;
  vertical-align: middle;
  cursor: pointer;
}

.group-filtr__checks {
  display: inline-block;
  margin-right: 5px;
}

.foot-filter-input {
  border: 2px solid #17365a;
  padding: 5px 16px 5px 5px;
  border-radius: 3px;
  width: 100%;
  background-position-x: calc(100% - 2px);
  background-repeat: no-repeat;
  background-position-y: 8px;
  background-size: 10px;
  background-image: url("@/assets/img/funnel.svg");
}

@media (max-width: 1170px) {
  .funnel-dropdown {
    top: 200px !important;
    width: calc(100vw - 40px);
    left: 18px;
  }
}

.funnel-trigger img {
  vertical-align: middle;
}
</style>
