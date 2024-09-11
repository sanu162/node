const rootHandler = async (req, h) => {
    try {        
        return h.response({message:"Server is up and running..."}).code(200);
    } catch (error) {
        return h.response({message:error.message}).code(404);
    }
}


module.exports = {
    rootHandler
}