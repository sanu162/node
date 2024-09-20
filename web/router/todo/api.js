const joi = require('joi');
const todoSchema = require('../../../models').todo


const todoPayload = joi.object({
    name : joi.string().required().description("name").error(new Error('name is required..')),
    description : joi.string().description("description"),
    completed : joi.boolean().description("completed"),
})


const createTodo = async (req, h) => {
    try{        
        const { personId } = req
        const {name, description, completed} = req.payload

        if (personId) {

            const query = { assignedPersonId:personId, name:name };
            const update = {$set: {
                name:name,
                description:description,
                completed:completed,
                assignedPersonId: personId,
            } };
            const options = {upsert : true, returnDocument: 'after'};

            const todo = await todoSchema.findOneAndUpdate(query, update, options);
            
            return h.response(todo).code(200);
        } else {
            return h.response({message: "Please provide assigned person id of the todo.."}).code(422);
        }
                
    }
    catch (err){
        return h.response({message: err.message}).code(500);
    }
}

const getTodo = async (req, h) => {
    try {
        const { search } = req.query;
        const queryObject = {};

        if (search) {
            queryObject.name = {$regex: search, $options: "i"}
        }
        
        const { personId } = req
        if (personId){
            queryObject.assignedPersonId = personId
            const todos = await todoSchema.find(queryObject,{
                name: 1,
                description: 1,
                _id: 1, 
            })        
            
            return h.response({data:todos}).code(200)
        } else {
            return h.response({message: "Please provide assigned person id of the todo.."}).code(422);
        }
    } catch (error) {
        return h.response({message:error.message}).code(400)
    }
}

const deleteTodo = async (req, h) => {
    try {
        const {id} = req.params;
        const todos = await todoSchema.findByIdAndDelete(id);

        if (!todos){
            return res.status(404).json({message: "Todo not found"});
        }

        return h.response({message:"Todo deleted"}).code(200)

    } catch (error) {
        return h.response({message:error.message}).code(400)
    }
}

module.exports = {
    todoPayload,
    createTodo,
    getTodo,
    deleteTodo,
}