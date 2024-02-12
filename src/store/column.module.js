//import UserService from '../services/user.service'

const templateColumnFilter = [
  {
    data: 'orderNumber',
    title: '№ заказа',
    isVisible: true,
    required: true,
    order: 0,
  },
  {
    data: 'orderNumberClient',
    title: '№ заказа клиента',
    isVisible: true,
    required: false,
    order: 1,
  },
  {
    data: 'senderName',
    title: 'Отправитель',
    isVisible: true,
    required: false,
    order: 2,
  },
  {
    data: 'transportNumber',
    title: '№ транспортного средства',
    isVisible: true,
    required: false,
    order: 3,
  },
  {
    data: 'transportType',
    title: 'Тип ТС',
    isVisible: true,
    required: false,
    order: 4,
  },
  {
    data: 'dateReadyVendor',
    title: 'Дата готовности груза от поставщика',
    isVisible: false,
    sort: ['date', 'desc'],
    required: false,
    order: 5,
  },
  {
    data: 'importExport',
    title: 'Направление перевозки',
    isVisible: false,
    required: false,
    order: 6,
  },
  {
    data: 'countryName',
    title: 'Страна отгрузки',
    isVisible: false,
    required: false,
    order: 7,
  },
  {
    data: 'cityName',
    title: 'Город отгрузки',
    isVisible: false,
    required: false,
    order: 8,
  },
  {
    data: 'deliveryConditions',
    title: 'Условия поставки',
    isVisible: false,
    required: false,
    order: 9,
  },
  {
    data: 'weightGross',
    title: 'Вес брутто груза',
    isVisible: false,
    required: false,
    order: 10,
  },
  {
    data: 'status',
    title: 'Статус',
    isVisible: false,
    required: false,
    order: 11,
  },
  {
    data: 'dateReadyClient',
    title: 'Дата готовности груза от клиента',
    isVisible: false,
    sort: ['date', 'desc'],
    required: false,
    order: 12,
  },
  {
    data: 'datePlaningLoad',
    title: 'Планируемая дата загрузки',
    isVisible: false,
    sort: ['date', 'desc'],
    required: false,
    order: 13,
  },
  {
    data: 'dateActualLoad',
    title: 'Фактическая дата загрузки',
    isVisible: false,
    sort: ['date', 'desc'],
    required: false,
    order: 14,
  },
  {
    data: 'datePlaningOut',
    title: 'Планируемая дата выхода из страны отправления',
    isVisible: false,
    sort: ['date', 'desc'],
    required: false,
    order: 15,
  },
  {
    data: 'dateActualOut',
    title: 'Фактическая дата выхода из страны отправления',
    isVisible: false,
    sort: ['date', 'desc'],
    required: false,
    order: 16,
  },
  {
    data: 'datePlaningOutShipOcean',
    title: 'Планируемая дата выхода океанского судна',
    isVisible: false,
    sort: ['date', 'desc'],
    required: false,
    order: 17,
  },
  {
    data: 'dateActualOutShipOcean',
    title: 'Фактическая дата выхода океанского судна',
    isVisible: false,
    sort: ['date', 'desc'],
    required: false,
    order: 18,
  },
  {
    data: 'datePlaningOutShipFeeder',
    title: 'Планируемая дата выхода фидерного судна',
    isVisible: false,
    sort: ['date', 'desc'],
    required: false,
    order: 19,
  },
  {
    data: 'dateActualOutShipFeeder',
    title: 'Фактическая дата выхода фидерного судна',
    isVisible: false,
    sort: ['date', 'desc'],
    required: false,
    order: 20,
  },
  {
    data: 'datePlaningBorderTransport',
    title: 'Планируемая дата прибытия на границу ТС',
    isVisible: false,
    sort: ['date', 'desc'],
    required: false,
    order: 21,
  },
  {
    data: 'dateActualBorderTransport',
    title: 'Фактическая дата прибытия на границу ТС',
    isVisible: false,
    sort: ['date', 'desc'],
    required: false,
    order: 22,
  },
  {
    data: 'dateActualRWStationOut',
    title: 'Фактическая дата выхода с ЖД станции в РФ',
    isVisible: false,
    sort: ['date', 'desc'],
    required: false,
    order: 23,
  },
  {
    data: 'datePlaningRWStationIn',
    title: 'Планируемая дата прибытия на ЖД станцию назначения в РФ',
    isVisible: false,
    sort: ['date', 'desc'],
    required: false,
    order: 24,
  },
  {
    data: 'dateActualRWStationIn',
    title: 'Фактическая дата прибытия на ЖД станцию назначения в РФ',
    isVisible: false,
    sort: ['date', 'desc'],
    required: false,
    order: 25,
  },
  {
    data: 'rwStationDest',
    title: 'Наименование ЖД станции назначения в РФ',
    isVisible: false,
    required: false,
    order: 26,
  },
  {
    data: 'datePlaningFinish',
    title: 'Дата доставки на склад',
    isVisible: true,
    sort: ['date', 'desc'],
    required: false,
    order: 27,
  },
  {
    data: 'dateActualFinish',
    title: 'Фактическая дата доставки на склад получателя',
    isVisible: false,
    sort: ['date', 'desc'],
    required: false,
    order: 28,
  },
  {
    data: 'deliveryAddress',
    title: 'Адрес доставки',
    isVisible: false,
    required: false,
    order: 29,
  },
  {
    data: 'dateDTFilling',
    title: 'Дата подачи декларации',
    isVisible: false,
    sort: ['date', 'desc'],
    required: false,
    order: 30,
  },
  {
    data: 'dateDTRelease',
    title: 'Дата выпуска декларации',
    isVisible: false,
    sort: ['date', 'desc'],
    required: false,
    order: 31,
  },
  {
    data: 'customPlace',
    title: 'Место таможенного оформления',
    isVisible: false,
    required: false,
    order: 32,
  },
  {
    data: 'isInspected',
    title: 'Досмотр',
    isVisible: false,
    required: false,
    order: 33,
  },
  {
    data: 'isIDK',
    title: 'ИДК',
    isVisible: false,
    required: false,
    order: 34,
  },
  {
    data: 'isWeighing',
    title: 'Взвешивание',
    isVisible: false,
    required: false,
    order: 35,
  },
  {
    data: 'legalEntityName',
    title: 'Юридическое лицо',
    isVisible: false,
    sort: ['date', 'desc'],
    required: false,
    order: 36,
  },
  {
    data: 'deliveryType',
    title: 'Тип перевозки',
    isVisible: false,
    required: false,
    order: 37,
  },
  {
    data: 'serviceType',
    title: 'Тип услуги',
    isVisible: false,
    required: false,
    order: 38,
  },
  {
    data: 'cargoName',
    title: 'Наименование груза',
    isVisible: false,
    required: false,
    order: 39,
  },
  {
    data: 'deliveryConditions',
    title: 'Условия поставки',
    isVisible: false,
    required: false,
    order: 40,
  },
  {
    data: 'individualSettings',
    title: 'Информация о заказе',
    isVisible: false,
    required: false,
    order: 41,
  },
]

const defaultColumnFilter = () => templateColumnFilter.map((item, index) => { return {id: index, ...item}})

export const column = {
  namespaced: true,
  state: {
    columnFilter: defaultColumnFilter(),
  },
  getters: {
    columnFilter: state => state.columnFilter,
  },
  actions: {
    setDefaultColumnFilter({ commit }) {
      commit('defaultColumnFilter')
    },
    setColumnFilter({ commit }, visibleColumns) {
      const columnFilter = defaultColumnFilter().map(value => (
        {
          ...value,
          isVisible: visibleColumns.includes(value.data)
        }
      ))
      // console.log(columnFilter)

      commit('setColumnFilter', columnFilter)
    },
    async changeColumnsVisible({ state, commit, dispatch }, { checkboxesArray, saveFilter = false }) {
      const columnFilter = JSON.parse(JSON.stringify(state.columnFilter))
      columnFilter.forEach((column) => {
        for (let key of Object.keys(checkboxesArray)) {
          if (key === column.data) {
            column.isVisible = checkboxesArray[key]
          }
        }
      })

      if (saveFilter) {
        const visibleColumns = columnFilter.reduce((acc, value) => value.isVisible ? acc.concat([value.data]) : acc, [])
        // console.log(visibleColumns)
        await dispatch("user/addFilter", visibleColumns, {root: true})
      }
      commit('setColumnFilter', columnFilter)
    },
  },
  mutations: {
    setColumnFilter(state, columnFilter) {
      state.columnFilter = columnFilter
    },
    setColumnFilterOrder(state, newOrder) {
      let index = 0
      newOrder.map(order => {
        state.columnFilter[index].order = order
        index++;
      })
    },
    defaultColumnFilter(state) {
      state.columnFilter = defaultColumnFilter()
    },
  }
}
