import axios from 'axios'

const API_URL = 'https://lk.bescargo.ru//api/'

class OrderService {
  getOrders(token, isArchive = 0) {
    const params = JSON.stringify({
      key: token,
      archive: isArchive
    })

    return axios
      .post(API_URL + 'order/read.php', params)
      .then(response => {
        let orders = []

        if (response.data.error === undefined) {
          if (Array.isArray(response.data)) {
            response.data.forEach(order => {
              orders.push(
                {
                  clientId: order.CLIENT_ID && order.CLIENT_ID !== '-' ? order.CLIENT_ID : '',
                  orderId: order.ORD_ID && order.ORD_ID !== '-' ? order.ORD_ID : '',
                  orderDate: order.ORD_DATE && order.ORD_DATE !== '-' ? order.ORD_DATE : '',
                  deliveryId: order.DLV_ID && order.DLV_ID !== '-' ? order.DLV_ID : '',
                  deliveryDate: order.DLV_DATE && order.DLV_DATE !== '-' ? order.DLV_DATE : '',
                  isArchived: order.IS_ARCHIVED && order.IS_ARCHIVED !== '-' ? order.IS_ARCHIVED : '',
                  orderNumber: order.ORD_NUM_INT && order.ORD_NUM_INT !== '-' ? order.ORD_NUM_INT : '',
                  orderNumberClient: order.ORD_NUM_CUS && order.ORD_NUM_CUS !== '-' ? order.ORD_NUM_CUS : '',
                  transportNumber: order.TRANSPORT_NUM && order.TRANSPORT_NUM !== '-' ? order.TRANSPORT_NUM : '',
                  deliveryAddress: order.D_ADDRESS && order.D_ADDRESS !== '-' ? order.D_ADDRESS : '',
                  weightGross: order.BRUTTO && order.BRUTTO !== '-' ? order.BRUTTO : '',
                  isWeighing: order.FLAG_WEIGH && order.FLAG_WEIGH !== '-' ? order.FLAG_WEIGH : '',
                  cityName: order.CITY_NAME && order.CITY_NAME !== '-' ? order.CITY_NAME : '',
                  dateDTRelease: order.DATE_DT_RELEASE && order.DATE_DT_RELEASE !== '-' ? order.DATE_DT_RELEASE : '',
                  dateReadyClient: order.DATE_READY_CLI && order.DATE_READY_CLI !== '-' ? order.DATE_READY_CLI : '',
                  dateReadyVendor: order.DATE_READY_VND && order.DATE_READY_VND !== '-' ? order.DATE_READY_VND : '',
                  dateDTFilling: order.DATE_DT_FILING && order.DATE_DT_FILING !== '-' ? order.DATE_DT_FILING : '',
                  isInspected: order.FLAG_INSP && order.FLAG_INSP !== '-' ? order.FLAG_INSP : '',
                  isIDK: order.FLAG_IDK && order.FLAG_IDK !== '-' ? order.FLAG_IDK : '',
                  customPlace: order.CUSTOM_PLACE && order.CUSTOM_PLACE !== '-' ? order.CUSTOM_PLACE : '',
                  cargoName: order.CARGO_NAME && order.CARGO_NAME !== '-' ? order.CARGO_NAME : '',
                  rwStationDest: order.RW_STATION_DEST && order.RW_STATION_DEST !== '-' ? order.RW_STATION_DEST : '',
                  importExport: order.IMP_EXP && order.IMP_EXP !== '-' ? order.IMP_EXP : '',
                  senderName: order.SENDER_NAME && order.SENDER_NAME !== '-' ? order.SENDER_NAME : '',
                  datePlaningOut: order.DATE_P_OUT && order.DATE_P_OUT !== '-' ? order.DATE_P_OUT : '',
                  datePlaningOutShipOcean: order.DATE_P_OUT_SHIPO && order.DATE_P_OUT_SHIPO !== '-' ? order.DATE_P_OUT_SHIPO : '',
                  datePlaningOutShipFeeder: order.DATE_P_OUT_SHIP && order.DATE_P_OUT_SHIP !== '-' ? order.DATE_P_OUT_SHIP : '',
                  datePlaningFinish: order.DATE_P_FINISH && order.DATE_P_FINISH !== '-' ? order.DATE_P_FINISH : '',
                  datePlaningLoad: order.DATE_P_LOAD && order.DATE_P_LOAD !== '-' ? order.DATE_P_LOAD : '',
                  datePlaningBorderTransport: order.DATE_P_BORDERTC && order.DATE_P_BORDERTC !== '-' ? order.DATE_P_BORDERTC : '',
                  datePlaningRWStationIn: order.DATE_P_RWST_IN && order.DATE_P_RWST_IN !== '-' ? order.DATE_P_RWST_IN : '',
                  status: order.STATUS && order.STATUS !== '-' ? order.STATUS : '',
                  countryName: order.COUNTRY_NAME && order.COUNTRY_NAME !== '-' ? order.COUNTRY_NAME : '',
                  deliveryType: order.DLV_TYPE && order.DLV_TYPE !== '-' ? order.DLV_TYPE : '',
                  transportType: order.TRANSPORT_TYPE && order.TRANSPORT_TYPE !== '-' ? order.TRANSPORT_TYPE : '',
                  serviceType: order.SERVICE_TYPE && order.SERVICE_TYPE !== '-' ? order.SERVICE_TYPE : '',
                  deliveryConditions: order.SC_NAME && order.SC_NAME !== '-' ? order.SC_NAME : '',
                  dateActualOut: order.DATE_A_OUT && order.DATE_A_OUT !== '-' ? order.DATE_A_OUT : '',
                  dateActualOutShipOcean: order.DATE_A_OUT_SHIPO && order.DATE_A_OUT_SHIPO !== '-' ? order.DATE_A_OUT_SHIPO : '',
                  dateActualRWStationOut: order.DATE_A_RWST_OUT && order.DATE_A_RWST_OUT !== '-' ? order.DATE_A_RWST_OUT : '',
                  dateActualOutShipFeeder: order.DATE_A_OUT_SHIP && order.DATE_A_OUT_SHIP !== '-' ? order.DATE_A_OUT_SHIP : '',
                  dateActualFinish: order.DATE_A_FINISH && order.DATE_A_FINISH !== '-' ? order.DATE_A_FINISH : '',
                  dateActualLoad: order.DATE_A_LOAD && order.DATE_A_LOAD !== '-' ? order.DATE_A_LOAD : '',
                  dateActualBorderTransport: order.DATE_A_BORDERTC && order.DATE_A_BORDERTC !== '-' ? order.DATE_A_BORDERTC : '',
                  dateActualRWStationIn: order.DATE_A_RWST_IN && order.DATE_A_RWST_IN !== '-' ? order.DATE_A_RWST_IN : '',
                  orgName: order.JP_NAME && order.JP_NAME !== '-' ? order.JP_NAME : '',
                  legalEntityName: order.JP_NAME && order.JP_NAME !== '-' ? order.JP_NAME : '',
                  imageIndex: order.IMG_INDEX ? parseInt(order.IMG_INDEX) : 0,
                }
              )
            })
          }
        } else {
          throw new Error("Что-то пошло не так...")
        }

        return orders
      })
  }

  getRoadPoints(token) {
    const params = JSON.stringify({
      key: token,
    })

    return axios
      .post(API_URL + 'point/read.php', params)
      .then(response => {
        let points = []

        if (response.data.error === undefined) {
          if (Array.isArray(response.data)) {
            response.data.forEach(point => {
              points.push(
                {
                  documentId: point.DOC_ID && point.DOC_ID !== '-' ? point.DOC_ID : '',
                  pointTitle: point.POINT_CAPTION && point.POINT_CAPTION !== '-' ? point.POINT_CAPTION : '',
                  pointDate: point.POINT_DATE && point.POINT_DATE !== '-' ? point.POINT_DATE : '',
                  pointCompleted: point.POINT_IS_COMPLETED && point.POINT_IS_COMPLETED !== '-' ? point.POINT_IS_COMPLETED : '0',
                }
              )
            })
          }
        } else {
          throw new Error("Что-то пошло не так...")
        }

        return points
      })
  }
}

export default new OrderService()