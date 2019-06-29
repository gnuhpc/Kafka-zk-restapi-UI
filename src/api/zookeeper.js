import http from '@/utils/http'
let kafkaRes="/kafkaRes";

export const zkStat = params => {
  if(process.env.KAFKA_TYPE ==="paas"){
    return http.post(`${kafkaRes}/paas-kafka/kafka/zkStat`, params)
  }else{
    return http.post(`${kafkaRes}/paas-kafka/kafka/zkStat`,params).then(res =>{
      return{data:{
        "reply": {
          "result": res,
          "returnCode": {
            "type": "S",
            "code": "AAAAAA",
            "domain": null
          }
        }
      }}
    })
  }
}
export const zkEnv = params => {
  return http.post(`${kafkaRes}/paas-kafka/kafka/zkEnv`,params)
}
export const zkHost = params => {
  return http.post(`${kafkaRes}/paas-kafka/kafka/zkHost`, params)
}
//2.单台启停
export const zkStartOrStop = params => {
  return http.post(`${kafkaRes}/paas-kafka/kafka/zkStartOrStop`, params)
}
//3.批量启停
export const zkBatchRev = params => {
  return http.post(`${kafkaRes}/paas-kafka/kafka/zkBatchRev`, params)
}
//4.手动恢复
export const recoverZK = params => {
  return http.post(`${kafkaRes}/paas-kafka/kafka/recoverZK`, params)
}
//5.读取配置文件
export const readZkConfig = params => {
  return http.post(`${kafkaRes}/paas-kafka/kafka/readZkConfig`, params)
}
//6.修改配置文件
export const updateZkConfig = params => {
  return http.post(`${kafkaRes}/paas-kafka/kafka/updateZkConfig`, params)
}
