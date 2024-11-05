// // const mailTo = {
// //   name: i18nLang.__('EmailNotificationTemplate.emailToEmployer.3000'), //Novu notification template name
// //   to:[
// //     {
// //       subscriberId: "4567891230",
// //       email: "suryakanta@appscrip.co",
// //       firstName: "testing",
// //       lastName:"testing"
// //     }
// //   ]
// // }
// // sendMail(mailTo,{})


// // const mailTo = []
// // await params?.to?.map((subscriber) => {
// //   to = {
// //     subscriberId: subscriber.subscriberId,
// //     email: subscriber.email,
// //     firstName: subscriber.firstName,
// //     lastName: subscriber.lastName
// //   }
// //   mailTo.push(to)
// // })
// // const param = {
// //   type:'sendEmail',
// //   data:{
// //       name:params.name,
// //       to:mailTo,
// //       additionalKeys: {
// //           ...commonKeysToReplace,
// //           ...keysToReplace
// //       }
// //   },
// //   attachments:attachments
// // }  
// // grpcService.novuEmailService(param)



// const string = "hello"
// let a = []
// for (let i =0; i< string.length; i++){
// a.push(string[i])
// }

// // console.log(a.reverse())

// a = {a:1,b:2}
// b = {c:3,d:4}

// console.log({...a,...b})

// const random = Math.random().toString(16).slice(3)
// const clientId = `mqtt_${random}`

// console.log(random)

    
// // let emailTo = []
// // let listners = []
// // const fcmTopics = []
// // switch (userType) {
// //   case 'EMPLOYER':
// //     const customerData = await customerDB.getData({ _id: new ObjectId(userId) })
// //     if (customerData) {
// //       if (customerData.mqttTopic) {
// //         listners = customerData.mqttTopic
// //       }

// //       emailTo = [{
// //         subscriberId: customerData?._id,
// //         email: customerData?.email,
// //         firstName: customerData?.firstName,
// //         lastName: customerData?.lastName
// //       }]

// //       if (customerData.activeDeviceData.length > 0) {
// //         customerData.activeDeviceData.map(async (item) => {
// //           fcmTopics.push({
// //             id: customerData._id.toString(),
// //             name: `${customerData.firstName} ${customerData.lastName}`,
// //             topic: `/topics/${customerData.fcmTopic + '_' + item}`
// //           })
// //         })
// //       }
// //     }
// //     break
// //   case 'WORKER':
// //     const workerData = await serviceProvidersDB.getOne({ _id: new ObjectId(userId) })
// //     if (workerData) {
// //       if (workerData.mqttTopic.length > 0) {
// //         listners = workerData.mqttTopic
// //       }

// //       emailTo = [{
// //         subscriberId: workerData._id,
// //         email: workerData.email,
// //         firstName: workerData.firstName,
// //         lastName: workerData.lastName
// //       }]

// //       if (workerData.fcmTopic) {
// //         fcmTopics.push({
// //           id: workerData._id.toString(),
// //           name: `${workerData.firstName} ${workerData.lastName} `,
// //           topic: `/topics/${workerData.fcmTopic}`
// //         })
// //       }
// //     }
// //     break
// //   default:
// //     if (emailData && Object.keys(emailData).length > 0 && (emailData.to)) {
// //       emailTo = emailData.to
// //     }

// //     if (mqttData && Object.keys(mqttData).length > 0 && (mqttData.listner)) {
// //       listners = mqttData.listner
// //     }

// //     if (pushData && Object.keys(mqttData).length > 0 && (pushData.fcmTopic)) {
// //       fcmTopics.push(pushData.fcmTopic)
// //     }
// //     break
// // }

// const config = require('config')
// const { ObjectId } = require('mongodb')
// const i18n = require('../../../locales/locales')
// const { notifyRealTime } = require('../../../library/mqttModule')
// const { sendNotification } = require('../../../grpcClient/pushNotificationClient')
// const { sendMail } = require('../novuEmail/novuEmail')
// const { debugLogger } = require('../../../utils/logger')
// const serviceProvidersDB = require('../../../models/serviceProviders')
// const customerDB = require('../../../models/customer')

// /**
//  * sendEmailNotification
//  * @param {String} templateName - type of novu notification
//  * @param {Array{Object}} to   - subscriberId, email, firstName, lastName (Array of subscribers)
//  * @param {String} to.subscriberId - unique identifier of subscriber
//  * @param {String} to.email - subscriber email
//  * @param {String} to.firstName - subscriber first name
//  * @param {String} to.lastName - subscriber last name
//  * @param {object} additionalKeys - Additional custom data which will be replaced
//  */
// async function sendEmailNotification({
//   templateName = 'costumer_job_posted', // Default template name
//   to = [],
//   additionalKeys = {}
// } = {}) {
//   const mailData = {
//     name: templateName,
//     to: to.map(subscriber => ({
//       subscriberId: subscriber.subscriberId,
//       email: subscriber.email,
//       firstName: subscriber.firstName,
//       lastName: subscriber.lastName
//     })),
//     additionalKeys
//   }

//   debugLogger.debug(`${templateName} : ${JSON.stringify(mailData)}`)
//   await sendMail(mailData)
// }

// /**
//  * sendMqttNotificaton
//  * @description for sending notification to customer
//  * @param {Array} listner
//  * @param {number} action
//  * @param {string} statusMsg
//  * @param {string} jobId
//  * @param {number} qos
//  */
// async function sendMqttNotificaton({
//   listner,
//   action = 1001,
//   statusMsg = i18n.__('serviceJob.notificationToWorker.1001'),
//   jobId,
//   qos = 2
// } = {}) {
//   const mqttData = {
//     listner,
//     message: {
//       action,
//       statusMsg,
//       jobId
//     },
//     qos
//   }

//   await notifyRealTime(mqttData)
// }

// /**
//  * sendFcmNotification
//  * @description for sending notification
//  * @param {number} action
//  * @param {string} title
//  * @param {string} body
//  * @param {string} sound
//  * @param {number} pushType
//  * @param {number} orderType
//  * @param {number} data.title
//  * @param {string} data.body
//  * @param {string} data.sound
//  * @param {string} data.action
//  * @param {number} data.pushType
//  * @param {number} data.orderType
//  * @param {string} data.categoryIdentifier
//  * @param {string} data.jobId
//  * @param {string} userId
//  * @param {string} userName
//  * @param {string} fcmTopic
//  * @param {string} collapseKey
//  * @param {boolean} notificactionRequired
//  * @param {boolean} content_available
//  * @param {string} priority
//  * @param {boolean} delay_while_idle
//  * @param {number} timeToLive
//  * @param {boolean} dryRun
//  * @param {number} badge
//  */
// async function sendFcmNotification({
//   title = config.get('APP_NAME'),
//   body = i18n.__('serviceJob.notificationToWorker.1001'),
//   sound = 'default',
//   action = 1001,
//   pushType = 1,
//   orderType = 8,
//   categoryIdentifier = 'order',
//   data = {},
//   userId,
//   userType = 1,
//   userName = '',
//   fcmTopic,
//   collapse_key = 'order',
//   content_available = true,
//   priority = 'high',
//   notificactionRequired = true,
//   delay_while_idle = true,
//   dry_run = false,
//   time_to_live = 3600,
//   badge = '1'
// } = {}) {
//   const pushData = {
//     notification: {
//       title,
//       body,
//       sound,
//       action,
//       pushType,
//       orderType,
//       categoryIdentifier
//     },
//     notificationMongoId: new ObjectId(),
//     data,
//     notificactionRequired,
//     collapse_key,
//     content_available,
//     priority,
//     userId: userId.toString(),
//     userType,
//     userName,
//     appName: config.get('APP_NAME'),
//     delay_while_idle,
//     dry_run,
//     time_to_live,
//     badge,
//     to: `/topics/${fcmTopic}`
//   }

//   await sendNotification(pushData)
// }

// /**
//  * sendAllNotifications
//  * @description for sending all notification
//  * @param {string} userType
//  * @param {string} userId
//  * @param {Object} emailData
//  * @param {Object} pushData
//  * @param {string} mqttData
//  * @param {boolean} customerNotificationData
//  */
// async function sendAllNotifications({
//   userType = 'EMPLOYER', // EMPLOYER/WORKER
//   userId = '',
//   emailData = null,
//   pushData = null,
//   mqttData = null
// } = {}) {
//   let emailTo = []
//   let customerData, workersData
//   let listners = []
//   switch (userType) {
//     case 'EMPLOYER':
//       customerData = await customerDB.getData({ _id: new ObjectId(userId) })
//       listners = customerData?.mqttTopic
//       emailTo = [{
//         subscriberId: customerData._id,
//         email: customerData.email,
//         firstName: customerData.firstName,
//         lastName: customerData.lastName
//       }]
//       break
//     case 'WORKER':
//       workersData = await serviceProvidersDB.getOne({ _id: new ObjectId(userId) })
//       listners = workersData?.mqttTopic
//       emailTo = [{
//         subscriberId: workersData._id,
//         email: workersData.email,
//         firstName: workersData.firstName,
//         lastName: workersData.lastName
//       }]
//       break
//     default:
//       if (emailData && Object.keys(emailData).length > 0) {
//         emailTo = emailData?.to
//       }

//       if (mqttData && Object.keys(mqttData).length > 0) {
//         listners = mqttData.listner
//       }
//       break
//   }
//   // Send Email Notification if emailData is provided
//   if (emailData && Object.keys(emailData).length > 0) {
//     try {
//       await sendEmailNotification({
//         templateName: emailData.templateName || 'costumer_job_posted',
//         to: emailTo || [],
//         additionalKeys: emailData.additionalKeys || {}
//       })
//     } catch (err) {
//       debugLogger.error(`Failed to send email: ${err.message}`)
//     }
//   }

//   if (pushData && Object.keys(pushData).length > 0) {
//     if (userType === 'EMPLOYER') {
//       const action = pushData.notification ? pushData.notification.action ? pushData.notification.action : config.get('ORDER_STATUS_NOTIFICATION')[0] : config.get('ORDER_STATUS_NOTIFICATION')[0]
//       const orderStatusNotification = config.get('ORDER_STATUS_NOTIFICATION').split(',')
//       if (orderStatusNotification.indexOf(action.toString()) !== -1) {
//         await sendFcmNotificationToCustomer(customerData, pushData)
//       }
//     } else {
//       const data = {
//         title: pushData.title || config.get('APP_NAME'),
//         body: pushData.body || i18n.__('serviceJob.notificationToWorker.1001'),
//         sound: pushData.sound || 'default',
//         action: pushData.action || 1001,
//         pushType: pushData.pushType || 1,
//         orderType: pushData.orderType || 8,
//         categoryIdentifier: pushData.categoryIdentifier || 'order',
//         ...pushData.data
//       }
//       await sendFcmNotification({
//         title: pushData.title || config.get('APP_NAME'),
//         body: pushData.body || i18n.__('serviceJob.notificationToWorker.1001'),
//         sound: pushData.sound || 'default',
//         action: pushData.action || 1001,
//         pushType: pushData.pushType || 1,
//         orderType: pushData.orderType || 8,
//         categoryIdentifier: pushData.categoryIdentifier || 'order',
//         data: data,
//         userId: pushData.userId,
//         userType: pushData.userType || 1,
//         userName: pushData.userName || '',
//         fcmTopic: pushData.fcmTopic || '',
//         collapse_key: pushData.collapse_key || 'order',
//         content_available: pushData.content_available || true,
//         priority: pushData.priority || 'high',
//         notificactionRequired: pushData.notificactionRequired || true,
//         delay_while_idle: pushData.delay_while_idle || true,
//         dry_run: pushData.dry_run || false,
//         time_to_live: pushData.time_to_live || 3600,
//         badge: pushData.badge || '1'
//       })
//     }
//   }

//   // Send MQTT Notification if mqttData is provided
//   if (mqttData && Object.keys(mqttData).length > 0) {
//     try {
//       await sendMqttNotificaton({
//         listner: listners,
//         action: mqttData.action || 1001,
//         statusMsg: mqttData.statusMsg || i18n.__('serviceJob.notificationToWorker.1001'),
//         jobId: mqttData.jobId || '',
//         qos: mqttData.qos || 2
//       })
//     } catch (error) {
//       debugLogger.error(`Failed to send MQTT notification: ${error.message}`)
//     }
//   }
// }

// const sendFcmNotificationToCustomer = async (customerData, pushData) => {
//   if (typeof customerData.fcmTopic !== 'undefined' && typeof customerData.activeDeviceData !== 'undefined' && customerData.activeDeviceData.length >= 0) {
//     customerData.activeDeviceData.map(async (item) => {
//       const topicData = {
//         id: customerData._id.toString(),
//         name: `${customerData.firstName} ${customerData.lastName}`,
//         topic: customerData.fcmTopic + '_' + item
//       }

//       const data = {
//         title: pushData.title || config.get('APP_NAME'),
//         body: pushData.body || i18n.__('serviceJob.notificationToWorker.1001'),
//         sound: pushData.sound || 'default',
//         action: pushData.action || 1001,
//         pushType: pushData.pushType || 1,
//         orderType: pushData.orderType || 8,
//         categoryIdentifier: pushData.categoryIdentifier || 'order',
//         ...pushData.data
//       }
//       pushData = {
//         title: pushData.title || config.get('APP_NAME'),
//         body: pushData.body || i18n.__('serviceJob.notificationToWorker.1001'),
//         data: data,
//         userId: topicData.id.toString(),
//         userType: pushData.userType || 1,
//         userName: topicData.name || '',
//         fcmTopic: `/topics/${topicData.topic}`,
//         collapse_key: pushData.collapse_key || 'order',
//         content_available: pushData.content_available || true,
//         priority: pushData.priority || 'high',
//         notificactionRequired: pushData.notificactionRequired || true,
//         delay_while_idle: pushData.delay_while_idle || true,
//         dry_run: pushData.dry_run || false,
//         time_to_live: pushData.time_to_live || 3600,
//         badge: pushData.badge || '1'
//       }

//       if (item.split('-')[0] === 2 || item.split('-')[0] === '2') {
//         pushData.notificactionRequired = false
//       }

//       await sendFcmNotification(pushData)
//     })
//     debugLogger.debug(`sending notification to user ${customerData.firstName} and id ${customerData._id.toString()}`)
//   }
// }

// module.exports = { sendAllNotifications }
const moment = require('moment')
const zone = require('moment-timezone')

console.log(moment('2024-10-09T07:52:44.058+00:00').format('MMMM Do YYYY'))

console.log(moment('2024-10-09T07:52:44.058+00:00').format('ll'))

console.log(zone('2024-10-09T07:52:44.058+00:00').tz('Asia/Calcutta').format('LLLL'))
console.log(moment.utc().seconds(30).valueOf())
console.log(new Date().setUTCSeconds(30))