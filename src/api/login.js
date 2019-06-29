//axios封装和处理
import {fetch} from '../utils/request'
export default {
    mineBaseMsgApi(){
        return fetch('/paas1/treeMenu')
    }
}