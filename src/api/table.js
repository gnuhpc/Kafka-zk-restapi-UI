import {post} from '../utils/request'
export default {
    mineBaseMsgApi(){
        return post('/con/queryClusterList.json')
    }
}