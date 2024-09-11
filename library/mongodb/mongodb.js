const mongoose  = require("mongoose");
const config = require('../../config')

const state = {db :null}


exports.connect = async () =>{    
    if (state.db) return;

    const client = await mongoose .connect(config.mongodb.url)
    .then((x) => {console.log(`Database Connected... ${x.connections[0].name}`);
    })
    .catch((err) => {
        console.error('db connection failed...');
    });

    state.db = client;
}

exports.get = () => state.db;

exports.close = (callback) => {
    if (state.db) {
        state.db.close((err) => {
            state.db = null;
            return callback(err);
        });
    }
}