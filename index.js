const batching = require('./batching.js')
const query = require('./query.js')

module.exports = function ({ apiKey, maxBatchTime = 60, maxBatchSize = 1000 }) {
  if (!apiKey) {
    throw new Error('API key is required')
  }

  batching.init({
    apiKey,
    maxBatchTime,
    maxBatchSize
  })

  return {
    event: function (name, data, partitionKey = null, timestamp = null) {
      if (!name) {
        throw new Error('Missing required parameter: name')
      }
      return batching.add(name, data, partitionKey, timestamp)
    },
    query: function (data) {
      return query.run(data, apiKey)
    }
  }
}
