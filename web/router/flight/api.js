const flightSchema = require('../../../models').flight

const getFlight = async (req, h) => {
    try {
        const { pageno,limit,search } = req.query
        const queryLimit = parseInt(limit) || 10;
        const page = parseInt(pageno)-1 || 0;
        const skipValue = queryLimit * page
        let queryObject = {}        
        
        if (search) {
            queryObject = { 
                            $or: [
                                {"first_name":search},
                            ]             
                        }
        }

        // const count = await flightSchema.countDocuments(queryObject)
        
        // console.log(count);
        

        const persons = await flightSchema.find(
            queryObject
        );


        return h.response({data:persons}).code(200);
    } catch (error) {
        return h.response({message:error.message}).code(400);
    }
}


module.exports = {
    getFlight,
}