
const { sendReq } = require('../../common/testCall')














const rootHandler = async (req, h) => {
    try {     
        const tokenData = await sendReq()
        return h.response({message:"Server is up and running...", data:tokenData}).code(200);
    } catch (error) {
        return h.response({message:error.message}).code(404);
    }
}


module.exports = {
    rootHandler
}