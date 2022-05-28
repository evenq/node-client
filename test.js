const Evenq = require('./index.js')

test('send events', async () => {
  const evenq = new Evenq({
    apiKey: process.env.EVENQ_TESTKEY,
    maxBatchSize: 10,
    maxBatchTime: 1
  })

  evenq.event('test.event.node', { key: 'value' })
  evenq.event('test.event.node', { key: 'value', someNumber: 1 }, 'a')
  evenq.event('test.event.node', { key: 'value', someNumber: 2 }, 'b')
  evenq.event('test.event.node', { key: 'value', someNumber: 3 }, 'c')

  await new Promise(resolve => setTimeout(resolve, 1500))
})

test('query', async () => {
  const evenq = new Evenq({
    apiKey: process.env.EVENQ_TESTKEY,
    maxBatchSize: 10,
    maxBatchTime: 1
  })

  const res = await evenq.query([
    {
      name: 'test.event.node',
      from: '2020-01-01T00:00:00Z',
      to: '2030-01-01T00:00:00Z',
      partitionKeys: ['a', 'b', 'c'],
      items: [
        {
          type: 'number',
          aggregation: 'count'
        },
        {
          type: 'number',
          aggregation: 'min',
          key: 'someNumber'
        },
        {
          type: 'number',
          aggregation: 'max',
          key: 'someNumber'
        }
      ]
    }
  ])

  console.log(res)
})
