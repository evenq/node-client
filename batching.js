const { Batcher } = require('bottleneck/es5')
const https = require('https')

const ingestURL = 'https://in.evenq.io/v1/events'

const cleanSettings = ({ maxBatchTime, maxBatchSize }) => {
  if (maxBatchSize < 10) {
    maxBatchSize = 10
  } else if (maxBatchSize > 900) {
    maxBatchSize = 900
  }

  if (maxBatchTime < 1) {
    maxBatchTime = 1
  } else if (maxBatchTime > 60) {
    maxBatchTime = 60
  }
  maxBatchTime = maxBatchTime * 1000

  return { maxBatchTime, maxBatchSize }
}

const callAPI = (events, key) => {
  const data = JSON.stringify(events)
  const opt = {
    headers: {
      'X-EVENQ-KEY': key,
      'Content-Type': 'application/json',
      'Content-Length': data.length
    },
    method: 'POST'
  }

  return new Promise((resolve, reject) => {
    const req = https.request(ingestURL, opt, res => {
      if (res.statusCode !== 204) {
        console.log('evenq error:', res.statusCode, res.statusMessage)
        reject(res.statusCode)
      } else {
        resolve()
      }
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

const getCurrentTS = () => {
  const date = new Date()
  const now_utc = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  )

  return new Date(now_utc).toISOString()
}

const batching = {
  isInit: false,
  batcher: null,
  multipleStatements: true,
  key: null,

  init: function ({ apiKey, maxBatchTime, maxBatchSize }) {
    if (this.isInit) {
      return
    }

    this.key = apiKey
    const batchSettings = cleanSettings({ maxBatchTime, maxBatchSize })

    this.isInit = true
    this.batcher = new Batcher({
      maxTime: batchSettings.maxBatchTime,
      maxSize: batchSettings.maxBatchSize
    })

    this.batcher.on('batch', async batch => {
      await callAPI(batch, this.key)
    })
  },

  add: function (name, data, pk, timestamp) {
    return this.batcher.add({ name, ts: timestamp || getCurrentTS(), data, partitionKey: pk })
  }
}

module.exports = batching
