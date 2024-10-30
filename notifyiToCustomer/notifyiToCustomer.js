
const ObjectID = require('mongodb').ObjectID
const config = require('config')

const customer = require('../../../models/customer')
const notifyi = require('../../../library/mqttModule')
const { debugLogger, errorLogger } = require('../../../utils/logger')

const pushNotificationClient = require('../../../grpcClient/pushNotificationClient')

/**
 * notifyiToCustomer
 * @description for sending notification to customer
 * @param {string} customerId
 * @param {Object} notificationData
 * @param {Object} notificationData.notification
 * @param {Object} notificationData.data
 * @param {string} notificationData.collapse_key
 * @param {boolean} notificationData.content_available
 * @param {string} notificationData.priority
 * @param {boolean} notificationData.delay_while_idle
 * @param {boolean} notificationData.dry_run
 * @param {boolean} notificationData.time_to_live
 * @param {number} qos
 * @param {boolean} sendPush
 */
const notifyiToCustomer = (customerId, notificationData, qos, sendPush = false, deviceId = '') => new Promise(async (resolve, reject) => {
  try {
    debugLogger.debug('sending notification to customer')

    // Get customer topic
    const searchConn = {
      _id: new ObjectID(customerId)
    }
    const customerData = await customer.getData(searchConn)

    notificationData.data.orderFor = 1
    notificationData.data.orderForText = 'Delivery'
    if ((process.env.OTG_FLOW === 'true' || process.env.OTG_FLOW === true) && typeof notificationData.data.title !== 'undefined' && config.get('APP_NAME') === notificationData.data.title) {
      notificationData.notification.title = ''
      notificationData.data.title = ''
    }
    await notifyiMQTT(customerData, JSON.parse(JSON.stringify(notificationData.data)), qos)
    if (sendPush) {
      const action = notificationData.notification ? notificationData.notification.action ? notificationData.notification.action : config.get('ORDER_STATUS_NOTIFICATION')[0] : config.get('ORDER_STATUS_NOTIFICATION')[0]
      const orderStatusNotification = config.get('ORDER_STATUS_NOTIFICATION').split(',')
      if (orderStatusNotification.indexOf(action.toString()) !== -1) {
        await notifyiFCM(customerData, notificationData, deviceId)
      }
    }
    return resolve(true)
  } catch (err) {
    errorLogger.error('error while sending notification to customer : ', err)
    return resolve(true)
  }
})

/**
 * notifyiMQTT
 * @description for sending notification to Customer
 * @param {Object} customerData
 * @param {Object} notificationData
 * @param {number} qos
 */
const notifyiMQTT = (customerData, notificationData, qos = 2) => new Promise(async (resolve, reject) => {
  try {
    const mqttListners = [customerData.mqttTopic]

    // debugLogger.debug('sending data to : ', mqttListners)

    delete notificationData.sound
    delete notificationData.pushType
    delete notificationData.mediaUrl
    // Sending Data in MQTT
    const mqttData = {
      listner: mqttListners,
      message: notificationData, // change here
      qos: parseInt(qos)
    }
    notifyi.notifyRealTime(mqttData)

    return resolve(true)
  } catch (err) {
    errorLogger.error('error while sending notification to Customer : ', err)
    return resolve(true)
  }
})

/**
 * notifyiFCM
 * @description for sending notification to Customer
 * @param {Object} customerData
 * @param {Object} notificationData
 */
const notifyiFCM = (customerData, notificationData, deviceId = '') => new Promise(async (resolve, reject) => {
  try {
    if (typeof customerData.fcmTopic !== 'undefined' && typeof customerData.activeDeviceData !== 'undefined' && customerData.activeDeviceData.length >= 0) {
      const notificationMongoId = new ObjectID()
      customerData.activeDeviceData.map(async (item) => {
        if (item !== deviceId) {
          const topicData = {
            id: customerData._id.toString(),
            name: `${customerData.firstName} ${customerData.lastName}`,
            topic: customerData.fcmTopic + '_' + item
          }

          const pushData = {
            notification: notificationData.notification,
            notificationMongoId: notificationMongoId,
            data: notificationData.data,
            notificactionRequired: true,
            collapse_key: notificationData.collapse_key || config.get('APP_NAME'),
            isBusiness: notificationData.isBusiness || false,
            content_available: notificationData.content_available || false,
            priority: notificationData.priority,
            userId: topicData.id.toString(),
            userType: 1,
            userName: topicData.name || '',
            appName: config.get('APP_NAME'),
            delay_while_idle: notificationData.delay_while_idle || true,
            dry_run: notificationData.dry_run || false,
            time_to_live: notificationData.time_to_live || 3600,
            badge: '1',
            to: `/topics/${topicData.topic}`
          }
          if (item.split('-')[0] === 2 || item.split('-')[0] === '2') {
            pushData.notificactionRequired = false
          }
          await pushNotificationClient.sendNotification(pushData)
        }
      })
      debugLogger.debug(`sending notification to user ${customerData.firstName} and id ${customerData._id.toString()}`)
    }
    return resolve(true)
  } catch (err) {
    errorLogger.error('error while sending notification to customer : ', err)
    return resolve(true)
  }
})

/**
 * notifyiToCustomer
 * @description for sending notification to customer
 * @param {Object} chatData
 * @param {Object} notificationData
 * @param {Object} notificationData.notification
 * @param {Object} notificationData.data
 * @param {string} notificationData.collapse_key
 * @param {boolean} notificationData.content_available
 * @param {string} notificationData.priority
 * @param {boolean} notificationData.delay_while_idle
 * @param {boolean} notificationData.dry_run
 * @param {boolean} notificationData.time_to_live
 * @param {boolean} sendPush
 */
const notifyiToChat = (chatData, notificationData, sendPush = false) => new Promise(async (resolve, reject) => {
  try {
    debugLogger.debug('sending notification to Chat')
    if (sendPush) {
      await notifyiFCMChat(chatData, notificationData)
    }
    return resolve(true)
  } catch (err) {
    errorLogger.error('error while sending notification to Chat : ', err)
    return resolve(true)
  }
})

/**
 * notifyiFCM
 * @description for sending notification to Chat
 * @param {Object} chatData
 * @param {Object} notificationData
 */
const notifyiFCMChat = (chatData, notificationData) => new Promise(async (resolve, reject) => {
  try {
    const topicData = {
      id: chatData.targetId,
      name: 'Message',
      topic: `message_${chatData.targetId}`
    }
    const notificationMongoId = new ObjectID()

    const pushData = {
      notification: notificationData.notification,
      notificationMongoId: notificationMongoId,
      data: notificationData.data,
      notificactionRequired: true,
      collapse_key: notificationData.collapse_key || config.get('APP_NAME'),
      isBusiness: notificationData.isBusiness || false,
      content_available: notificationData.content_available || false,
      priority: notificationData.priority,
      userId: topicData.id.toString(),
      userType: 1,
      userName: topicData.name || '',
      appName: config.get('APP_NAME'),
      delay_while_idle: notificationData.delay_while_idle || true,
      dry_run: notificationData.dry_run || false,
      time_to_live: notificationData.time_to_live || 3600,
      badge: '1',
      to: `/topics/${topicData.topic}`
    }
    await pushNotificationClient.sendNotification(pushData)

    debugLogger.debug(`sending notification to user id ${chatData.targetId}`)

    return resolve(true)
  } catch (err) {
    errorLogger.error('error while sending notification to Chat : ', err)
    return resolve(true)
  }
})

module.exports = { notifyiToCustomer, notifyiMQTT, notifyiFCM, notifyiToChat, notifyiFCMChat }
