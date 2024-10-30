const mqtt = require('mqtt')

const protocol = 'mqtt'
const host = 'broker.emqx.io'
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const mqttConn = `${protocol}://${host}:${port}` 
mqtt://broker.emqx.io:1883

const topic = '/test/node/sn'

const client = mqtt.connect(mqttConn, {
    clientId,
    keepalive: 10,
    clean: false,
    connectTimeout: 4000,
    username: 'emqx',
    password: 'public',
    reconnectPeriod: 1000,
})

client.on('error', error => {
  console.error('Mqtt Error =>', error)
})

client.on('offline', () => {
  console.error('Mqtt offline ')
})

client.on('reconnect', () => {
  console.error('Mqtt reconnect ')
})

client.on('connect', () => {
    console.log(`mqtt connected ${clientId}`)
    client.subscribe([topic], ()=>{
        console.log(`subscribed to ${topic}`);
    })
})

client.on('message', (topic, message) => {
    console.log('Received Message:', topic, message.toString())
})

const notifyRealTime = message => {
    client.publish(topic, JSON.stringify(message), { retain: false, qos: 2 })
  }

module.exports = { notifyRealTime }