import http from '@/utils/http'
// let kafkaRestful = process.env.kafka_restful

let kafkaRes="/kafkaRes";
// let ansibleRestful = process.env.ansible_restful
// export const getListPage = params => {
//   return http.get(`${kafkaRestful}/kafka/brokers`)
// }
//1.查看所有
export const getListPage = params => {
  return http.post(`${kafkaRes}/paas-kafka/kafka/localAndServerBrokers`,params)
}
//2.broker启停
export const StartStop = params => {
  return http.post(`${kafkaRes}/paas-kafka/kafka/kafkaBrokerStartOrStop`,params)
}
//3.broker强停
export const forceStop = params => {
  return http.post(`${kafkaRes}/paas-kafka/kafka/kafkaBrokerForceStop`,params)
}
// 4批量启停
export const BatchRev = params => {
  return http.post(`${kafkaRes}/paas-kafka/kafka/kafkaBrokerBatchRev`,params)
}
// 5.批量强停
export const BatchForceStop = params => {
  return http.post(`${kafkaRes}/paas-kafka/kafka/kafkaBrokerBatchForceStop`,params)
}
//6手动恢复
export const kafkaRecoverBroker = params => {
  return http.post(`${kafkaRes}/paas-kafka/kafka/kafkaRecoverBroker`,params)
}
//7.读取配置文件
export const kafkaReadBrokerConfig = params => {
  return http.post(`${kafkaRes}/paas-kafka/kafka/kafkaReadBrokerConfig`,params)
}
//8.修改本地配置
export const updateBrokerConfig = params => {
  return http.post(`${kafkaRes}/paas-kafka/kafka/updateBrokerConfig`,params)
}
//9.修改集群配置
export const updateBroCluConf = params => {
  return http.post(`${kafkaRes}/paas-kafka/kafka/updateBroCluConf`,params)
}
