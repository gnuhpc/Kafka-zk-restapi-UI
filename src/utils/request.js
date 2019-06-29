import axios from 'axios'
export function fetch(url,params){
 return new Promise((resolve,reject)=>{
     axios.get(url,params).then(response=>{
         resolve(response.data);
     })
     .catch((error)=>{
         console.log(error)
         reject(error)
     })
 })
}
export function post(url,data={}){
    return new Promise((resolve,reject)=>{
        axios.post(url,data).then(response=>{
            resolve(response.data)},err=>{
                reject(err)
            
        })
    })
}