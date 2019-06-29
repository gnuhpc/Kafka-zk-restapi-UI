import http from '../utils/http'
let proxy = "/kafkaRes/paas-kafka/kafka";//测试环境


export default {

  /*查询所有集群*/
  findAllKafkaCluster(pageSize,pageNo) {
    return http.get(`${proxy}/findAllKafkaCluster`,{recordsPerPage:pageSize,pageNo:pageNo})
  },
  /*增加集群*/
  saveKafkaCluster(params){
    console.log(params)
    return http.post(`${proxy}/saveKafkaCluster`,params)
  },
  /*修改集群*/
  updateKafkaCluster(params){
    console.log(params)
    return http.post(`${proxy}/updateKafkaCluster`,params)
  },
  /*删除集群*/
  deleteKafkaCluster(id){
    return http.get(`${proxy}/deleteKafkaClusterById`,{id:id})
  },

  /*查看所有微服务*/
  findAllMicroServiceDto(params){
    return http.get(`${proxy}/findAllMicroServiceDto`,params)
  },

  /*查询所有为服务版本*/
  findAllMicroCategory(params){
    return http.get(`${proxy}/findAllMicroCategory`,params)
  },
  /**/
  findByCategoryId(params){
    return http.get(`${proxy}/findByCategoryId`,params)
  }
}
