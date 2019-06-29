import http from '@/utils/http'
let baseAll = "/kafkaRes/paas-kafka";
export default {
  kafkaPackFunction(uri, requestType, selectCluster,params){
    let datas = {}
    datas.uri = uri;
    datas.requestType = requestType;
    datas.selectCluster=selectCluster;
    if(params!= undefined){
      datas.params = params;
    }
    if(process.env.KAFKA_TYPE ==="paas"){
      return http.post(`${baseAll}/kafka/kafkaPack`, {arguments:datas})
    }else{
      if(requestType=="get"){
        return http.get(`${baseAll}/${uri}`,params).then(res =>{
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
      }else if(requestType=="post"){
        return http.post(`${baseAll}/${uri}`,params).then(res =>{
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
      }else if(requestType=="put"){
        return http.put(`${baseAll}/${uri}`,params).then(res =>{
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
      }else if(requestType=="delete"){
        return http.delete(`${baseAll}/${uri}`,params).then(res =>{
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

  },
  kafkaPackFunctionOri(uri, requestType,originalUri,selectCluster, params){
    if(process.env.KAFKA_TYPE !=="paas"){
      return this.kafkaPackFunction(uri,requestType,selectCluster,params);
    }
    let datas = {}
    datas.uri = uri;
    datas.requestType = requestType;
    datas.originalUri=originalUri;
    datas.selectCluster=selectCluster;
    if(params!= undefined){
      datas.params = params;
    }
    return http.post(`${baseAll}/kafka/kafkaPack`, {arguments:datas})
  },
  getTopicSize(params){
    return http.post(`${baseAll}/kafka/getTopicSize`,params)
  },
  saveTopics(params){
    return http.post(`${baseAll}/kafka/saveTopics`,params)
  },
  getTopicByClusterIdAndName(params){
    return http.post(`${baseAll}/kafka/getTopicByClusterIdAndName`,params)
  },
  deleteTopicByClusterIdAndNames(params){
    return http.post(`${baseAll}/kafka/deleteTopicByClusterIdAndNames`,params)
  },
  checkOauth(){
    return http.get(`${baseAll}/rbac/checkOauth.json`)
  },
}

