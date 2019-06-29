# Kafka-zk-restapi-UI 

<b>Kafka-zk-restapi-UI</b> : A web application for Kafka-zk-rest-api [Kafka-zk-restapi](https://github.com/gnuhpc/Kafka-zk-restapi)
## How to Run the application

### Download Kafka-zk-restapi-UI project code and Kafka-zk-restapi project code.
git clone https://github.com/gnuhpc/Kafka-zk-restapi.git

git clone https://github.com/gnuhpc/Kafka-zk-restapi-UI.git

### Start up Kafka-zk-restapi
For a detailed explanation on how to start Kafka-zk-restapi, check out the [Kafka-zk-restapi](https://github.com/gnuhpc/Kafka-zk-restapi)

### Start up Kafka-zk-restapi-UI
cd Kafka-zk-restapi-UI

### Install dependencies
npm install

### Modify configs in config/index.js
 1. Modify target to the real Kafka-zk-restapi application address:
   proxyTable: {
      '/kafkaRes/paas-kafka': {
        target:'http://localhost:8121',
        changeOrigin: true,
        pathRewrite: {
          '^/kafkaRes/paas-kafka': ''
        }
      }
    },
 2. Modify host and port of this application:
  host: 'localhost', // can be overwritten by process.env.HOST
  port: 8088

### Run the application
npm run dev

### Access web project
http://localhost:8088

## ScreenShots
![KafkaDashboard](https://github.com/gnuhpc/Kafka-zk-restapi-UI/blob/master/screenshots/KafkaDashboard.png)
![TopicManage](https://github.com/gnuhpc/Kafka-zk-restapi-UI/blob/master/screenshots/TopicManage.png)
![TopicPartitionView](https://github.com/gnuhpc/Kafka-zk-restapi-UI/blob/master/screenshots/TopicPartitionView.png)
![ConsumersGetByTopic](https://github.com/gnuhpc/Kafka-zk-restapi-UI/blob/master/screenshots/ConsumersGetByTopic.png)
![ManualReassignPartitions](https://github.com/gnuhpc/Kafka-zk-restapi-UI/blob/master/screenshots/ManualReassignPartitions.png)
![MessageView](https://github.com/gnuhpc/Kafka-zk-restapi-UI/blob/master/screenshots/MessageView.png)
![SchemaView](https://github.com/gnuhpc/Kafka-zk-restapi-UI/blob/master/screenshots/SchemaView.png)
![ConsumerGroup](https://github.com/gnuhpc/Kafka-zk-restapi-UI/blob/master/screenshots/ConsumerGroup.png)
![TopicsGetByGroup](https://github.com/gnuhpc/Kafka-zk-restapi-UI/blob/master/screenshots/TopicsGetByGroup.png)
![ConsumersGetByGroupAndTopic](https://github.com/gnuhpc/Kafka-zk-restapi-UI/blob/master/screenshots/ConsumersGetByGroupAndTopic.png)

