const notify = require('../../../library/mqtt')

const mqttHandler = async (req, h) => {
    try {
        console.log(req.payload)
        const chat = req.payload.chat
        notify.notifyRealTime({msg:chat})
        // const tokenData = await sendReq()
        return h.response({message:"Server is up and running..."}).code(200);
    } catch (error) {
        return h.response({message:error.message}).code(404);
    }
}

module.exports = {
    mqttHandler
}