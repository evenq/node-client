const https = require('https')

const queryURL = 'https://api.evenq.io/v1/queries'

const query = {
  run: function (query, key) {
    const data = JSON.stringify(query)
    const opt = {
      headers: {
        'X-EVENQ-KEY': key,
        'Content-Type': 'application/json',
        'Content-Length': data.length
      },
      method: 'POST'
    }

    return new Promise((resolve, reject) => {
      const req = https.request(queryURL, opt, res => {
        res.on('data', data => {
          let response = {}

          try {
            response = JSON.parse(data.toString())
          } catch (e) {
            reject(e)
            return
          }

          if (res.statusCode === 200) {
            resolve(response)
          } else {
            reject(response)
          }
        })
      })

      req.on('error', e => {
        console.error(`problem with request: ${e.message}`)
        reject(e.message)
      })

      // Write data to request body
      req.write(data)
      req.end()
    })
  }
}

module.exports = query
