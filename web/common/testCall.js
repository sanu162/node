const rp = require('request-promise')

const sendReq = (data) => new Promise((resolve, reject) => {
    const bodyData = {
        email:"sanu8@mail.com",
        password:"sanu162"
    }


    const options = {
        method: 'POST',
        url: 'http://localhost:3005/api/auth/person/login',
        headers: {
          'content-type': 'application/json'
        },
        body: bodyData,
        json: true
    }

    rp(options)
        .then((tokenData) => {
            return resolve(tokenData)
        })
        .catch((error) => {
            return reject(error)
        })
})

module.exports = { sendReq }