# evenq-node

[![npm version](https://badge.fury.io/js/@evenq%2Fnode-client.svg)](https://badge.fury.io/js/@evenq%2Fnode-client)

You can read our full documentation at https://app.evenq.io/docs

### Installation
Run the following command in your repository
`npm install @evenq/node-client@latest`

### Usage
You initialize Evenq once with your API key and then you can call the event functions. 
You can specify a batch size between 10 and 900 and a flush interval between 1-60 seconds.

```
import Evenq from 'evenq';

const evenq = new Evenq({
    apiKey: "YOUR_API_KEY",
    maxBatchTime: 60, // max and default set to 60 seconds
    maxBatchSize: 1000 // max and default set to 1000 events per batch
});
```

Sending events
The event function takes 4 parameters:
1. name - string (required)
2. data - object (optional)
3. partitionKey - string (optional)
4. timestamp - unix epoch seconds (optional)

For example: 

`evenq.event("your.event", { key: "value"}, "partitionKey", 1644210247);`

Here are some other ways to track events
```
// send a simple event
evenq.event("your.event")
```

```
// .. or an event with additional data
evenq.event("your.event", { key: "value" })
```

```
// send an event with a partition key
evenq.event("your.event", { key: "value" }, "partitionKey")
```

```
// send an event with a partition key and custom timestamp
evenq.event("your.event", { key: "value" }, "partitionKey", 1644210247)
```
