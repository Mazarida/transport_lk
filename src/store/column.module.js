//import UserService from '../services/user.service'

const templateColumnFilter = [
  {
    data: 'orderNumber',
    title: '№ заказа',
    isVisible: true,
    required: true,
  },
  {
    data: 'orderNumberClient',
    title: '№ заказа клиента',
    isVisible: true,
    required: false,
  },
  {
    data: 'senderName',
    title: 'Отправитель',
    isVisible: true,
    required: false,
  },
  {
    data: 'transportNumber',
    title: '№ транспортного средства',
    isVisible: true,
    required: false,
  },
  {
    data: 'transportType',
    title: 'Тип ТС',
    isVisible: true,
    required: false,
  },
  {
    data: 'datePlaningFinish',
    title: 'Дата доставки на склад',
    isVisible: true,
    sort: ['date', 'desc'],
    required: false,
  },
  {
    data: 'importExport',
    title: 'Направление перевозки',
    isVisible: false,
    required: false,
  },
  {
    data: 'countryName',
    title: 'Страна отгрузки',
    isVisible: false,
    required: false,
  },
  {
    data: 'cityName',
    title: 'Город отгрузки',
    isVisible: false,
    required: false,
  },
  {
    data: 'deliveryConditions',
    title: 'Условия поставки',
    isVisible: false,
    required: false,
  },
  {
    data: 'weightGross',
    title: 'Вес брутто груза',
    isVisible: false,
    required: false,
  },
  {
    data: 'status',
    title: 'Статус',
    isVisible: false,
    required: false,
  },
  {
    data: 'dateReadyClient',
    title: 'Дата готовности груза от клиента',
    isVisible: false,
    sort: ['date', 'desc'],
    required: false,
  },
  {
    data: 'dateReadyVendor',
    title: 'Дата готовности груза от поставщика',
    isVisible: false,
    sort: ['date', 'desc'],
    required: false,
  },
  {
    data: 'datePlaningLoad',
    title: 'Планируемая дата загрузки',
    isVisible: false,
    sort: ['date', 'desc'],
    required: false,
  },
  {
    data: 'dateActualLoad',
    title: 'Фактическая дата загрузки',
    isVisible: false,
    sort: ['date', 'desc'],
    required: false,
  },
  {
    data: 'datePlaningOut',
    title: 'Планируемая дата выхода из страны отправления',
    isVisible: false,
    sort: ['date', 'desc'],
    required: false,
  },
  {
    data: 'dateActualOut',
    title: 'Фактическая дата выхода из страны отправления',
    isVisible: false,
    sort: ['date', 'desc'],
    required: false,
  },
  {
    data: 'datePlaningOutShipOcean',
    title: 'Планируемая дата выхода океанского судна',
    isVisible: false,
    sort: ['date', 'desc'],
    required: false,
  },
  {
    data: 'dateActualOutShipOcean',
    title: 'Фактическая дата выхода океанского судна',
    isVisible: false,
    sort: ['date', 'desc'],
    required: false,
  },
  {
    data: 'datePlaningOutShipFeeder',
    title: 'Планируемая дата выхода фидерного судна',
    isVisible: false,
    sort: ['date', 'desc'],
    required: false,
  },
  {
    data: 'dateActualOutShipFeeder',
    title: 'Фактическая дата выхода фидерного судна',
    isVisible: false,
    sort: ['date', 'desc'],
    required: false,
  },
  {
    data: 'datePlaningBorderTransport',
    title: 'Планируемая дата прибытия на границу ТС',
    isVisible: false,
    sort: ['date', 'desc'],
    required: false,
  },
  {
    data: 'dateActualBorderTransport',
    title: 'Фактическая дата прибытия на границу ТС',
    isVisible: false,
    sort: ['date', 'desc'],
    required: false,
  },
  {
    data: 'dateActualRWStationOut',
    title: 'Фактическая дата выхода с ЖД станции в РФ',
    isVisible: false,
    sort: ['date', 'desc'],
    required: false,
  },
  {
    data: 'datePlaningRWStationIn',
    title: 'Планируемая дата прибытия на ЖД станцию назначения в РФ',
    isVisible: false,
    sort: ['date', 'desc'],
    required: false,
  },
  {
    data: 'dateActualRWStationIn',
    title: 'Фактическая дата прибытия на ЖД станцию назначения в РФ',
    isVisible: false,
    sort: ['date', 'desc'],
    required: false,
  },
  {
    data: 'rwStationDest',
    title: 'Наименование ЖД станции назначения в РФ',
    isVisible: false,
    required: false,
  },
  {
    data: 'dateActualFinish',
    title: 'Фактическая дата доставки на склад получателя',
    isVisible: false,
    sort: ['date', 'desc'],
    required: false,
  },
  {
    data: 'deliveryAddress',
    title: 'Адрес доставки',
    isVisible: false,
    required: false,
  },
  {
    data: 'dateDTFilling',
    title: 'Дата подачи декларации',
    isVisible: false,
    sort: ['date', 'desc'],
    required: false,
  },
  {
    data: 'dateDTRelease',
    title: 'Дата выпуска декларации',
    isVisible: false,
    sort: ['date', 'desc'],
    required: false,
  },
  {
    data: 'customPlace',
    title: 'Место таможенного оформления',
    isVisible: false,
    required: false,
  },
  {
    data: 'isInspected',
    title: 'Досмотр',
    isVisible: false,
    required: false,
  },
  {
    data: 'isIDK',
    title: 'ИДК',
    isVisible: false,
    required: false,
  },
  {
    data: 'isWeighing',
    title: 'Взвешивание',
    isVisible: false,
    required: false,
  },
  {
    data: 'legalEntityName',
    title: 'Юридическое лицо',
    isVisible: false,
    sort: ['date', 'desc'],
    required: false,
  },
  {
    data: 'deliveryType',
    title: 'Тип перевозки',
    isVisible: false,
    required: false,
  },
  {
    data: 'serviceType',
    title: 'Тип услуги',
    isVisible: false,
    required: false,
  },
  {
    data: 'cargoName',
    title: 'Наименование груза',
    isVisible: false,
    required: false,
  },
  {
    data: 'deliveryConditions',
    title: 'Условия поставки',
    isVisible: false,
    required: false,
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
      //console.log(columnFilter)

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
        //console.log(visibleColumns)
        await dispatch("user/addFilter", visibleColumns, {root: true})
      }
      commit('setColumnFilter', columnFilter)
    },
  },
  mutations: {
    setColumnFilter(state, columnFilter) {
      state.columnFilter = columnFilter
    },
    defaultColumnFilter(state) {
      state.columnFilter = defaultColumnFilter()
    },
  }
}
